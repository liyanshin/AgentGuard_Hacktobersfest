import React, { useState, useRef } from 'react';
import { HudHeader } from './components/HudHeader';
import { InputPanel } from './components/InputPanel';
import { RadarScanner } from './components/RadarScanner';
import { RiskReport } from './components/RiskReport';
import { Footer } from './components/Footer';
import { AgentGuardAvatar } from './components/AgentGuardAvatar';
import { ScanResult, RiskLevel } from './types';
import { soundFX } from './utils/audio';
import { 
  Shield, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Terminal,
  Zap,
  Info
} from 'lucide-react';

export default function App() {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<{ data: string; mimeType: string; fileName?: string } | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);
  
  // Dashboard Metrics
  const [scanCount, setScanCount] = useState<number>(0);
  const [threatsBlocked, setThreatsBlocked] = useState<number>(0);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const showToast = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleScan = async () => {
    if (!text.trim() && !image) return;

    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "AgentGuard couldn't analyze this — please try again");
      }

      const data: ScanResult = await response.json();
      setResult(data);
      setScanCount((prev) => prev + 1);

      if (data.risk_level === 'high_risk') {
        soundFX.playDangerAlarm();
        setThreatsBlocked((prev) => prev + 1);
        showToast('High risk data leak detected! Review before sharing.', 'danger');
      } else if (data.risk_level === 'caution') {
        soundFX.playCautionAlert();
        setThreatsBlocked((prev) => prev + 1);
        showToast('Potential exposure risk flagged by AgentGuard.', 'info');
      } else {
        soundFX.playSafeChime();
        showToast('Content verified clean! Safe to share.', 'success');
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      const friendlyMsg = err.message || "AgentGuard couldn't analyze this — please try again";
      setError(friendlyMsg);
      showToast(friendlyMsg, 'danger');
    } finally {
      setIsScanning(false);
    }
  };

  // Button 1: Proceed (clears risk report, shows brief confirmation state)
  const handleProceed = () => {
    setResult(null);
    showToast('Marked as reviewed — ready for your workflow!', 'success');
  };

  // Button 2: Edit (returns focus/cursor to input box, keeping current text)
  const handleEdit = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
    showToast('Cursor returned to input editor. Modify and scan again.', 'info');
  };

  // Button 3: Block (clears input box entirely and resets to empty state)
  const handleBlock = () => {
    setText('');
    setImage(null);
    setResult(null);
    showToast('Input stream blocked and purged entirely.', 'danger');
  };

  // Helper to auto-redact specific flagged pattern from the text
  const handleRedactItem = (detail: string) => {
    if (!text) return;
    
    // Attempt exact match first
    let updatedText = text;
    if (updatedText.includes(detail)) {
      updatedText = updatedText.replaceAll(detail, '[REDACTED]');
    } else {
      // Extract possible tokens or emails
      const tokens = detail.match(/[a-zA-Z0-9_\-\.\+@]{4,}/g) || [];
      tokens.forEach((tok) => {
        if (tok.length > 3 && updatedText.includes(tok)) {
          updatedText = updatedText.replaceAll(tok, '[REDACTED]');
        }
      });
    }

    setText(updatedText);
    showToast('Sensitive item masked with [REDACTED] in input stream.', 'info');
    if (textareaRef.current) textareaRef.current.focus();
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col relative selection:bg-[#1e90ff]/30 selection:text-white">
      {/* Ambient background glow & HUD grid */}
      <div className="fixed inset-0 hud-grid opacity-35 pointer-events-none" />
      <div className="fixed -top-40 left-1/4 w-[600px] h-[300px] bg-[#1e90ff]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-[500px] h-[400px] bg-[#00bfff]/8 rounded-full blur-[150px] pointer-events-none" />

      {/* Persistent HUD Command Center Header */}
      <HudHeader scanCount={scanCount} threatsBlocked={threatsBlocked} />

      {/* Floating Alert / Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-2.5 rounded shadow-lg border text-xs font-mono flex items-center gap-2.5 backdrop-blur-md ${
              toast.type === 'danger'
                ? 'bg-red-950/90 border-red-500 text-red-200 shadow-neon-red'
                : toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-neon-safe'
                : 'bg-slate-900/90 border-[#1e90ff] text-[#38bdf8] shadow-neon-blue'
            }`}
          >
            {toast.type === 'danger' && <AlertCircle className="w-4 h-4 text-[#ff3b3b]" />}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#00bfff]" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10 flex flex-col gap-6">
        {/* Hero Mission Bar */}
        <section className="bg-gradient-to-r from-[#0a1226]/80 via-[#070c18]/90 to-[#0a1226]/80 border border-[#1e90ff]/20 p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#0b172e] border border-[#1e90ff]/40 text-[#00bfff]">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-hud font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
                <span>AI Data Leak Interception Zone</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ACTIVE DEFENSE
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Screen prompts, documents, credentials & customer records before submitting to external LLMs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#070d1c] border border-slate-800">
              <span className="text-slate-500">PII</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-500">CREDENTIALS</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-500">FINANCIALS</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-500">IP</span>
            </div>
          </div>
        </section>

        {/* Error notification if inspection failed */}
        {error && (
          <div className="p-4 rounded bg-red-950/40 border border-red-500/60 text-red-200 text-xs font-mono flex items-center justify-between gap-3 shadow-neon-red">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleScan()}
              className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 text-red-200 transition-colors uppercase font-bold text-[10px]"
            >
              Retry Scan
            </button>
          </div>
        )}

        {/* Split Grid: Left = Input Stream, Right = Results/Scanner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Input Panel */}
          <div className="flex flex-col">
            <InputPanel
              text={text}
              setText={setText}
              image={image}
              setImage={setImage}
              onScan={handleScan}
              isScanning={isScanning}
              textareaRef={textareaRef}
            />
          </div>

          {/* Right Column: Dynamic Analysis Output */}
          <div className="flex flex-col">
            {isScanning ? (
              /* Active Radar Sweep Loading State */
              <RadarScanner />
            ) : result ? (
              /* Risk Report State */
              <RiskReport
                result={result}
                onProceed={handleProceed}
                onEdit={handleEdit}
                onBlock={handleBlock}
                onRedactItem={handleRedactItem}
              />
            ) : (
              /* System Idle State */
              <div className="h-full min-h-[380px] p-8 bg-[#090e1e]/60 border border-dashed border-[#1e90ff]/25 rounded-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
                {/* Background decorative watermark */}
                <div className="absolute inset-0 hud-dots opacity-20 pointer-events-none" />

                <div className="mb-4">
                  <AgentGuardAvatar status="idle" size="lg" />
                </div>

                <h3 className="font-hud font-bold text-base tracking-wider uppercase text-[#00bfff] mb-1">
                  Awaiting Input Stream
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed font-sans">
                  Paste text or attach a screenshot on the left to initiate the dual-pass Gemma 4 security classification.
                </p>

                {/* 3 Steps Explainer */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-md text-left">
                  <div className="p-2.5 rounded bg-[#060a14] border border-[#1e90ff]/20">
                    <p className="text-[10px] font-mono text-[#00bfff] uppercase font-bold mb-1">01. INGEST</p>
                    <p className="text-[11px] text-slate-400">Pasted prompts, code, docs, or screenshots</p>
                  </div>
                  <div className="p-2.5 rounded bg-[#060a14] border border-[#1e90ff]/20">
                    <p className="text-[10px] font-mono text-[#00bfff] uppercase font-bold mb-1">02. DETECT</p>
                    <p className="text-[11px] text-slate-400">Gemma 4 security neural classifier pass</p>
                  </div>
                  <div className="p-2.5 rounded bg-[#060a14] border border-[#1e90ff]/20">
                    <p className="text-[10px] font-mono text-[#00bfff] uppercase font-bold mb-1">03. GUARD</p>
                    <p className="text-[11px] text-slate-400">AgentGuard explains risk in plain English</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mandatory Unobtrusive Footer */}
      <Footer />
    </div>
  );
}
