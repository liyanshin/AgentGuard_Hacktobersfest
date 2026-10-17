# 🛡️ AgentShield

> **AI-Powered Data Leak Prevention Tool**  
> Intercept and analyze sensitive data before sharing it with external AI systems — with friendly, plain-language risk breakdowns delivered by **AgentGuard**.

---

## ⚡ Overview

As teams and creators adopt LLMs (like ChatGPT, Claude, and copilot tools) for daily workflows, sensitive data—such as **PII (names, emails, phones, SSNs)**, **live API keys**, **database credentials**, **financial metrics**, and **proprietary source code**—is frequently pasted into external prompts by accident.

**AgentShield** acts as a client-side and pre-flight security command center. Before sending any prompt or screenshot to an external AI service, users route their content through AgentShield's **Dual-Pass AI Pipeline**. 

Technical risk classifications are translated by **AgentGuard**—an approachable, friendly mascot with a shield motif—into plain English that small business owners, non-technical team members, and developers can immediately understand and act upon.

---

## ✨ Key Features

- **🔍 Dual-Pass AI Inspection Architecture**:
  - **Pass 1 — Gemma 4 Security Classifier**: Rigorously analyzes input against four vulnerability vectors: *PII*, *Financial Data*, *Credentials*, and *Confidential Business Information*. Returns structured JSON containing risk levels, flagged items, and forensic summaries.
  - **Pass 2 — AgentGuard Persona Pass**: Translates technical risk vectors into 2–4 sentences of clear, conversational guidance with zero intimidating jargon.
- **🖼️ Multimodal Screenshot & Document Analysis**:
  - Drag-and-drop or file picker for screenshots of spreadsheets, internal dashboards, database queries, contracts, and chat logs.
- **⚡ Pre-Loaded Quick-Demo Presets**:
  - **Safe Prompt**: Harmless community workshop announcement.
  - **PII Leak**: Client intake dossier with phone numbers, emails, addresses, and SSNs.
  - **Credential Leak**: Live Stripe API keys, database master passwords, and AWS secrets.
- **🎮 Gamified Cyber HUD Interface**:
  - Electric Blue (`#1e90ff` / `#00bfff`) neon glow accents with deep command-center navy background (`#080c16`).
  - Crimson red (`#ff3b3b`) strictly reserved for danger states and active threat alerts.
  - Satisfying 360° radar sweep animation with live step telemetry masking model latency.
  - Interactive audio sound effects powered by the Web Audio API (toggleable in one click).
- **🛡️ AgentGuard Mascot & Speech Bubble**:
  - Dynamic SVG avatar with expressive visor states:
    - 🟢 *Safe*: Friendly smile with shield checkmark.
    - 🟡 *Caution*: Inquisitive, attentive amber visor.
    - 🔴 *High Risk*: Protective defensive stance with pulsing red barrier.
  - Speech bubble UI with built-in Text-to-Speech (TTS) audio narration.
- **✂️ Defense Action Controls**:
  - **Proceed**: Marks content as reviewed for safe dispatch.
  - **Edit**: Returns cursor focus directly into the editor while preserving content.
  - **Block**: Instantly purges the input stream and prevents exfiltration.
  - **Auto-Redact**: Automatically replaces detected sensitive tokens with `[REDACTED]`.

---

## 🏗️ Architecture & Data Flow

```text
       User Prompt / Screenshot
                 │
                 ▼
     ┌────────────────────────┐
     │   Input Stream Panel   │
     └───────────┬────────────┘
                 │ (POST /api/scan)
                 ▼
┌────────────────────────────────────────────────────────┐
│               AgentShield Backend (Express)             │
│                                                        │
│  [Pass 1: Detection Engine]                            │
│  Gemma 4 Security Classifier                           │
│  ├── PII (names, phones, emails, SSNs)                 │
│  ├── Financials (IBANs, accounts, revenue)             │
│  ├── Credentials (API keys, tokens, DB secrets)        │
│  └── Confidential IP (source code, roadmaps, NDAs)     │
│                 │                                      │
│                 ▼                                      │
│         Structured JSON Output                         │
│  { risk_level, flagged_items, summary }                │
│                 │                                      │
│                 ▼                                      │
│  [Pass 2: Explanation Layer]                           │
│  AgentGuard Character Pass                             │
│  └── Plain-language advice (2-4 sentences)             │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │   Gamified HUD Risk Report     │
        │  ├── Color-Coded Risk Badge    │
        │  ├── AgentGuard Speech Bubble  │
        │  ├── Flagged Hazards Table     │
        │  └── Action Row (Proceed/Block)│
        └────────────────────────────────┘


🛠️ Tech Stack
Frontend: React 19, TypeScript
Build Tool: Vite 8
Styling: Tailwind CSS v4
Icons: Lucide React
Sound Engine: Web Audio API (synthesized real-time HUD sound effects)
Speech Narration: Web SpeechSynthesis API
Backend: Express, Node.js (Full-stack SSR / Vite Middleware in development)
AI SDK: @google/genai calling Gemma 4 / Gemini models
🚀 Getting Started
Prerequisites
Node.js: v20.0.0 or higher (tested on Node v22)
npm or pnpm
Google Gemini API Key: Obtainable from Google AI Studio
1. Clone the Repository
code
Bash
git clone https://github.com/your-username/AgentShield.git
cd AgentShield
2. Install Dependencies
code
Bash
npm install
3. Configure Environment Variables
Create a .env file in the project root:
code
Bash
cp .env.example .env
Add your Gemini API key:
code
Env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
Security Note: The GEMINI_API_KEY is strictly accessed on the backend server (server.ts) and is never exposed to client-side bundles or browsers.
4. Run Development Server
code
Bash
npm run dev
Open your browser at:
code
Text
http://localhost:3000
5. Production Build
To build the optimized static frontend bundle:
code
Bash
npm run build
To start the full-stack production server:
code
Bash
npm run start
📁 Project Structure
code
Text
AgentShield/
├── index.html                    # HTML entry point with HUD typography & meta tags
├── metadata.json                 # AI Studio capability & permissions definition
├── package.json                  # Dependencies & execution scripts
├── server.ts                     # Full-stack Express server & dual-pass AI endpoints
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite build and Tailwind integration
├── src/
│   ├── main.tsx                  # React DOM entry point
│   ├── App.tsx                   # Main layout, HUD state & event handlers
│   ├── index.css                 # Cyber HUD glow utilities, fonts & clip paths
│   ├── types.ts                  # TypeScript interfaces for scans, hazards & presets
│   ├── components/
│   │   ├── AgentGuardAvatar.tsx  # Expressive SVG mascot with TTS narration support
│   │   ├── HudHeader.tsx         # Command-center top navigation, stats & sound toggle
│   │   ├── InputPanel.tsx        # Text stream, image drag-and-drop & demo presets
│   │   ├── RadarScanner.tsx      # Rotating 360° radar sweep & progress telemetry
│   │   ├── RiskReport.tsx        # Color-coded risk badge, speech bubble & action row
│   │   └── Footer.tsx            # Built by Kalyani attribution
│   └── utils/
│       └── audio.ts              # Web Audio API sound synthesizer
└── README.md
🧪 Testing the 3 Built-in Scenarios
Test Scenario 1 (Safe Content):
Click the "Safe Prompt" quick demo button.
Click "Scan with AgentShield".
Result: Emerald green HUD badge (SAFE TO SHARE). AgentGuard confirms that the content contains no private credentials or personal data.
Test Scenario 2 (Personally Identifiable Information):
Click the "PII Leak" quick demo button.
Click "Scan with AgentShield".
Result: Amber HUD badge (POTENTIAL EXPOSURE RISK). Flagged hazards detail the client's direct mobile number, private email, SSN, and home address.
Test Scenario 3 (Critical Credentials):
Click the "Credential Leak" quick demo button.
Click "Scan with AgentShield".
Result: Crimson red HUD badge with active pulse animation (CRITICAL LEAK DETECTED). AgentGuard flags the live Stripe secret key and database password, advising immediate removal.
Click "Block & Clear All" to immediately purge the dangerous stream.
👤 Author & Attribution
Built with 💙 by Kalyani
Powered by Google AI Studio and Gemma 4
📄 License
This project is licensed under the Apache-2.0 License. See the LICENSE file for details.
code
Code
