import React, { useRef, useState, useEffect } from 'react';
import { 
  Upload, 
  Sparkles, 
  Trash2, 
  Clipboard, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertTriangle, 
  Key, 
  ShieldCheck,
  Search,
  ArrowRight
} from 'lucide-react';
import { DemoExample } from '../types';
import { soundFX } from '../utils/audio';

interface InputPanelProps {
  text: string;
  setText: (val: string) => void;
  image: { data: string; mimeType: string; fileName?: string } | null;
  setImage: (img: { data: string; mimeType: string; fileName?: string } | null) => void;
  onScan: () => void;
  isScanning: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'safe',
    category: 'safe',
    label: 'Safe Prompt',
    tag: 'Safe',
    title: 'Public Community Announcement',
    description: 'Harmless prompt with no private or sensitive data',
    badgeStyle: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20',
    text: `Hi AI, can you help me draft an encouraging welcome email for our upcoming open-source developer workshop? 

Here are the key points:
- Date: Friday, October 24th at 10:00 AM UTC
- Topic: Best practices for responsive web UI design & accessibility
- Duration: 90 minutes with live Q&A session
- Registration link: https://community.example.org/webinar-oct24

Keep the tone enthusiastic, friendly, and under 200 words. Thanks!`,
  },
  {
    id: 'pii',
    category: 'pii',
    label: 'PII Leak',
    tag: 'PII Risk',
    title: 'Confidential Patient / Client Records',
    description: 'Exposes full name, email, cell phone, SSN, and home address',
    badgeStyle: 'text-amber-400 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20',
    text: `Can you format this customer onboarding record into a neat JSON table for our CRM?

Client Dossier:
- Name: Marcus Vance
- Private Email: marcus.vance82@techfirm.co
- Direct Mobile: +1 (415) 555-0194
- Residential Address: 742 Evergreen Terrace, Springfield, OR 97477
- National Identification / SSN: 042-88-1920
- Emergency Contact: Sarah Vance (Spouse) at +1 (415) 555-0195`,
  },
  {
    id: 'credentials',
    category: 'credentials',
    label: 'Credential Leak',
    tag: 'Critical Credential',
    title: 'Live API Key & Database Passwords',
    description: 'Exposes production Stripe API key, DB secrets, and AWS tokens',
    badgeStyle: 'text-[#ff4d4d] border-red-500/40 bg-red-500/10 hover:bg-red-500/20',
    text: `Why is my payment processing webhook throwing a 401 error in Node.js? Here is my connection code:

const stripe = require('stripe')('sk_live_51OzK9eB28xLa902qQzL944A9B01cK8vP');

const dbConfig = {
  host: 'db.production.internal',
  user: 'admin_master',
  password: 'P@ssw0rdProd2026!SecureKey',
  aws_access_key: 'AKIAIOSFODNN7EXAMPLE',
  aws_secret: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
};

async function syncTransaction() {
  // Debugging auth failure
}`,
  },
];

export const InputPanel: React.FC<InputPanelProps> = ({
  text,
  setText,
  image,
  setImage,
  onScan,
  isScanning,
  textareaRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to load example
  const handleSelectExample = (example: DemoExample) => {
    soundFX.playClick();
    setText(example.text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP screenshot).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.split(',')[1];
      setImage({
        data: base64Data,
        mimeType: file.type,
        fileName: file.name,
      });
      soundFX.playClick();
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handlePaste = async () => {
    soundFX.playClick();
    try {
      if (navigator.clipboard) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          setText(clipText);
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 1500);
        }
      }
    } catch {
      // Fallback: focus textarea
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  const handleClear = () => {
    soundFX.playClick();
    setText('');
    setImage(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if ((text.trim() || image) && !isScanning) {
          e.preventDefault();
          onScan();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text, image, isScanning, onScan]);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const tokenEst = Math.round(charCount / 4);

  return (
    <div className="bg-[#0b1021] border border-[#1e90ff]/30 rounded-sm shadow-neon-blue relative flex flex-col p-5 md:p-6 transition-all">
      {/* Top HUD Header with Example Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1e90ff]/20">
        <div>
          <label htmlFor="agent-input-stream" className="font-hud font-bold text-sm tracking-widest text-[#00bfff] uppercase flex items-center gap-2">
            <span>INPUT STREAM</span>
            <span className="text-[10px] text-slate-400 font-mono font-normal">
              [PASTE CONTENT BEFORE SHARING WITH AI]
            </span>
          </label>
        </div>

        {/* 3 Pre-filled Clickable Demo Examples */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden lg:inline">
            Quick Demos:
          </span>
          {DEMO_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleSelectExample(ex)}
              title={`${ex.title}: ${ex.description}`}
              className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 ${ex.badgeStyle}`}
            >
              {ex.id === 'safe' && <ShieldCheck className="w-3.5 h-3.5" />}
              {ex.id === 'pii' && <AlertTriangle className="w-3.5 h-3.5" />}
              {ex.id === 'credentials' && <Key className="w-3.5 h-3.5" />}
              <span>{ex.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="relative">
        <textarea
          id="agent-input-stream"
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste draft prompt, customer ticket, code snippet, contract excerpt, or message here before sending to ChatGPT, Claude, or any external AI tool..."
          className="w-full h-64 md:h-72 bg-[#060a14]/90 border border-[#1e90ff]/30 p-4 font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff]/50 transition-all resize-none rounded-sm"
          disabled={isScanning}
        />

        {/* Floating Quick Action Overlay inside textarea */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {text.length === 0 ? (
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-[#0e172a] border border-[#1e90ff]/40 text-[#38bdf8] hover:bg-[#1e90ff]/20 rounded transition-colors"
            >
              <Clipboard className="w-3 h-3" />
              <span>{copyFeedback ? 'Pasted!' : 'Paste Clipboard'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClear}
              title="Clear input"
              className="p-1.5 bg-[#0e172a] border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Image Upload / Drop Zone Area */}
      <div className="mt-4">
        {image ? (
          /* Image Preview Card */
          <div className="p-3 rounded bg-[#070c18] border border-[#1e90ff]/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 rounded bg-black/60 border border-[#1e90ff]/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  src={`data:${image.mimeType};base64,${image.data}`}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-[#00bfff] truncate">
                  {image.fileName || 'Screenshot Document'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {image.mimeType} · Ready for Gemma-4 OCR & leak analysis
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                setImage(null);
              }}
              title="Remove image"
              className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Dropzone */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded p-3 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#00bfff] bg-[#1e90ff]/15'
                : 'border-[#1e90ff]/30 hover:border-[#1e90ff]/70 bg-[#070c18]/60 hover:bg-[#070c18]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-300">
              <Upload className="w-4 h-4 text-[#00bfff]" />
              <span>
                Attach screenshot / document image <span className="text-slate-500">(Drag & drop or browse)</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Metrics & Action Bar */}
      <div className="mt-4 pt-3 border-t border-[#1e90ff]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Real-time counters */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 w-full sm:w-auto">
          <span>{charCount} CHARS</span>
          <span>·</span>
          <span>{wordCount} WORDS</span>
          <span>·</span>
          <span>~{tokenEst} TOKENS</span>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto flex items-center gap-3">
          <button
            onClick={() => {
              soundFX.playScanStart();
              onScan();
            }}
            disabled={isScanning || (!text.trim() && !image)}
            className="w-full sm:w-auto px-6 py-2.5 font-hud font-bold text-sm uppercase tracking-widest text-[#080d1a] bg-[#00bfff] hover:bg-[#38bdf8] active:bg-[#0099ff] disabled:opacity-40 disabled:pointer-events-none rounded transition-all shadow-[0_0_20px_rgba(0,191,255,0.4)] flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Scan with AgentShield</span>
                <span className="text-[10px] font-mono opacity-60 hidden md:inline ml-1">[⌘+↵]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
