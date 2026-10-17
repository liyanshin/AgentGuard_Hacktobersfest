import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Allow payloads for pasted text and base64 screenshots
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize the Google GenAI SDK for Gemini / Gemma calls
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface FlaggedItem {
  category: string;
  detail: string;
}

interface DetectionResult {
  risk_level: 'safe' | 'caution' | 'high_risk';
  flagged_items: FlaggedItem[];
  summary: string;
}

/**
 * Robust caller that uses the requested Gemma 4 model with fallback to gemini-3.8-flash
 */
async function callGemmaModel(contents: any, config: any) {
  // Try gemma-4 first per prompt requirement, then fallback to gemini-3.8-flash
  const candidateModels = ['gemma-4', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      return { response, modelUsed: model };
    } catch (err: any) {
      console.warn(`[AgentShield] Model "${model}" failed or unavailable: ${err?.message || err}. Attempting fallback if available...`);
      lastError = err;
    }
  }

  throw lastError || new Error('All model candidates failed');
}

/**
 * Call 1: Detection Engine (Gemma 4 Security Classifier)
 */
async function runDetectionPass(
  text: string,
  image?: { data: string; mimeType: string },
  isRetry = false
): Promise<DetectionResult> {
  const systemInstruction = `You are an elite cybersecurity data loss prevention (DLP) classifier engine called Gemma-4 Security Classifier.
Your mission is to rigorously inspect any text or screenshot before a user pastes or uploads it to public or third-party AI systems (e.g. ChatGPT, Claude, external LLMs).

Analyze the input for sensitive data across four critical vulnerability categories:
1. PII (Personally Identifiable Information): full names of non-public individuals, personal email addresses, phone numbers, home addresses, national ID / SSN, passport numbers, patient records.
2. Financial data: credit card numbers, CVVs, bank account/IBAN numbers, confidential revenue metrics, payroll figures, transaction ledgers, wire routing codes.
3. Credentials: API keys (e.g., sk-..., ghp_..., AIza...), passwords, Bearer tokens, private SSH/RSA keys, database connection strings (mongodb://, postgres://).
4. Confidential business info: unreleased source code, proprietary algorithms, trade secrets, internal roadmaps, unpublished contracts/NDA terms, non-public acquisition plans.

Determine the risk level:
- "safe": Contains NO sensitive, private, financial, credential, or proprietary confidential items. General knowledge, public content, benign prompts.
- "caution": Minor or potential exposure: internal team emails without passwords, business discussion without trade secrets, partial info that should be reviewed.
- "high_risk": Definite exposure of live API keys, credentials, plaintext passwords, SSNs/IDs, confidential financial ledgers, or customer PII.

${isRetry ? 'STRICT REQUIREMENT: Respond ONLY with valid, unescaped JSON matching the exact schema. Do not include markdown codeblocks or extra text.' : ''}`;

  const promptParts: any[] = [];

  if (image && image.data) {
    promptParts.push({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType || 'image/jpeg',
      },
    });
  }

  if (text && text.trim().length > 0) {
    promptParts.push({
      text: `Analyze this content for sensitive data leaks:\n\n${text}`,
    });
  } else if (!image) {
    throw new Error('No input provided for scanning');
  }

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      risk_level: {
        type: Type.STRING,
        enum: ['safe', 'caution', 'high_risk'],
        description: 'Overall threat risk classification',
      },
      flagged_items: {
        type: Type.ARRAY,
        description: 'List of detected sensitive items, empty if safe',
        items: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: 'One of: PII, Financial data, Credentials, Confidential business info',
            },
            detail: {
              type: Type.STRING,
              description: 'Brief detail of the exact sensitive pattern detected (masking sensitive tokens if needed)',
            },
          },
          required: ['category', 'detail'],
        },
      },
      summary: {
        type: Type.STRING,
        description: 'A concise 1-sentence technical finding summary',
      },
    },
    required: ['risk_level', 'flagged_items', 'summary'],
  };

  const { response, modelUsed } = await callGemmaModel(
    promptParts.length === 1 ? promptParts[0] : { parts: promptParts },
    {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.1,
    }
  );

  console.log(`[AgentShield] Detection pass completed using ${modelUsed}`);

  const rawText = response.text || '';
  try {
    const cleaned = rawText.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    const parsed = JSON.parse(cleaned);

    const validRisk = ['safe', 'caution', 'high_risk'].includes(parsed.risk_level)
      ? parsed.risk_level
      : 'caution';

    return {
      risk_level: validRisk,
      flagged_items: Array.isArray(parsed.flagged_items) ? parsed.flagged_items : [],
      summary: parsed.summary || 'Security inspection completed.',
    };
  } catch (parseErr) {
    console.error('[AgentShield] Failed to parse JSON response from Detection pass:', rawText);
    if (!isRetry) {
      console.log('[AgentShield] Retrying detection pass with stricter format constraint...');
      return await runDetectionPass(text, image, true);
    }
    throw new Error("AgentGuard couldn't analyze this — please try again");
  }
}

/**
 * Call 2: Explanation Layer (Gemma 4 Character Pass — AgentGuard)
 */
async function runAgentGuardExplanation(
  detectionResult: DetectionResult,
  originalText?: string
): Promise<string> {
  const systemInstruction = `You are AgentGuard, a friendly, approachable, and vigilant AI security guard character with a shield motif.
Your job is to explain the security classification results in simple, plain, non-technical language that a small business owner, creator, or team member with no cybersecurity training can immediately grasp.

Guidelines:
- Explain WHY this matters and WHAT practical action they should take (e.g. "Mask out John's phone number", "Replace your live API key with an environment variable", "You're good to hit send!").
- Keep your explanation to 2-4 sentences.
- Tone: Warm, protective, conversational, reassuring, never intimidating or overly alarmist.
- CRITICAL RULE: If risk_level is "safe", DO NOT return an empty or generic response! Give a cheerful, reassuring confirmation that their text is completely clean and safe to share with external AI tools.
- Do NOT use markdown headers, bullet lists, or robotic jargon. Speak directly as AgentGuard.`;

  const userPrompt = `Here is the security scan result:
Risk Level: ${detectionResult.risk_level.toUpperCase()}
Technical Summary: ${detectionResult.summary}
Detected Flagged Items: ${JSON.stringify(detectionResult.flagged_items, null, 2)}
Original text snippet: ${originalText ? originalText.slice(0, 300) : '[Image content analyzed]'}

Please give your 2-4 sentence AgentGuard explanation to the user.`;

  const { response, modelUsed } = await callGemmaModel(userPrompt, {
    systemInstruction,
    temperature: 0.7,
  });

  console.log(`[AgentShield] AgentGuard character pass completed using ${modelUsed}`);
  const explanation = (response.text || '').trim();

  if (!explanation) {
    if (detectionResult.risk_level === 'safe') {
      return "All clear! I took a close look at your content and found zero sensitive details, passwords, or personal info. You're completely safe to share this with external AI tools!";
    }
    return `AgentGuard notice: We detected ${detectionResult.flagged_items.length} sensitive item(s) that shouldn't be shared with external AI tools. Please redact these items before sending.`;
  }

  return explanation;
}

// POST /api/scan endpoint
app.post('/api/scan', async (req, res) => {
  const startTime = Date.now();
  try {
    const { text = '', image } = req.body;

    if (!text.trim() && !image?.data) {
      return res.status(400).json({
        error: 'Please enter text or upload an image to scan.',
      });
    }

    // Step 1: Detection Engine (Gemma 4 - Call 1)
    const detectionResult = await runDetectionPass(text, image);

    // Step 2: Explanation Layer (Gemma 4 - Call 2, AgentGuard persona)
    const explanation = await runAgentGuardExplanation(detectionResult, text);

    const latencyMs = Date.now() - startTime;

    return res.json({
      risk_level: detectionResult.risk_level,
      flagged_items: detectionResult.flagged_items,
      summary: detectionResult.summary,
      explanation,
      latency_ms: latencyMs,
      timestamp: new Date().toISOString(),
      character: 'AgentGuard',
    });
  } catch (error: any) {
    console.error('[AgentShield API Error]', error);
    const latencyMs = Date.now() - startTime;
    return res.status(500).json({
      error: "AgentGuard couldn't analyze this — please try again",
      details: error?.message || 'Internal inspection error',
      latency_ms: latencyMs,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    shield: 'active',
    character: 'AgentGuard',
    time: new Date().toISOString(),
  });
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ AgentShield Server live on http://localhost:${PORT}`);
  });
}

startServer();
