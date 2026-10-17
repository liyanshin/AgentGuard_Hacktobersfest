import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Terminal } from 'lucide-react';
import { AgentGuardAvatar } from './AgentGuardAvatar';

export const RadarScanner: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const steps = [
    { title: 'Pass 1 // Gemma 4 Security Classifier', desc: 'Deploying deep neural inspection...' },
    { title: 'Entropy & Token Analysis', desc: 'Screening credentials, API keys, tokens & PII...' },
    { title: 'Pass 2 // AgentGuard Character Pass', desc: 'Translating threat vectors to plain language...' },
  ];

  useEffect(() => {
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => {
      clearInterval(timerInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[380px] p-6 bg-[#0a0f1e]/90 border border-[#1e90ff]/40 rounded-sm shadow-neon-blue relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background cyber grid */}
      <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />

      {/* Cyber Corner Accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00bfff]" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#00bfff]" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#00bfff]" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00bfff]" />

      {/* Center Radar Assembly */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 mb-6 flex items-center justify-center">
        {/* Outer Circular Bounds */}
        <div className="absolute inset-0 rounded-full border border-[#1e90ff]/30 shadow-[0_0_20px_rgba(30,144,255,0.2)]" />
        <div className="absolute inset-4 rounded-full border border-dashed border-[#1e90ff]/25" />
        <div className="absolute inset-12 rounded-full border border-[#1e90ff]/20" />
        <div className="absolute inset-20 rounded-full border border-dotted border-[#00bfff]/30" />

        {/* Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[1px] bg-[#1e90ff]/20" />
          <div className="h-full w-[1px] bg-[#1e90ff]/20 absolute" />
        </div>

        {/* Angle markers */}
        <span className="absolute -top-1 font-mono text-[9px] text-[#1e90ff]/60">000°</span>
        <span className="absolute -bottom-1 font-mono text-[9px] text-[#1e90ff]/60">180°</span>
        <span className="absolute -left-1 font-mono text-[9px] text-[#1e90ff]/60">270°</span>
        <span className="absolute -right-1 font-mono text-[9px] text-[#1e90ff]/60">090°</span>

        {/* Rotating Radar Conical Sweep */}
        <div className="absolute inset-0 rounded-full animate-radar pointer-events-none overflow-hidden">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, rgba(0, 191, 255, 0.45) 0deg, rgba(30, 144, 255, 0.15) 30deg, transparent 65deg, transparent 360deg)',
            }}
          />
        </div>

        {/* Ping blips that flicker */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-ping" style={{ animationDelay: '0.6s' }} />

        {/* Center Mascot Mini Display */}
        <div className="relative z-10 scale-90">
          <AgentGuardAvatar status="scanning" size="md" />
        </div>
      </div>

      {/* Dynamic Telemetry Info */}
      <div className="text-center max-w-sm z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1e90ff]/10 border border-[#1e90ff]/30 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
          <span className="font-mono text-xs text-[#00e5ff] uppercase tracking-wider font-semibold">
            {steps[currentStep].title}
          </span>
        </div>

        <p className="text-xs text-slate-300 font-sans tracking-wide">
          {steps[currentStep].desc}
        </p>

        {/* HUD Progress Bar */}
        <div className="w-56 h-1.5 bg-slate-800/80 rounded-full mt-4 mx-auto overflow-hidden border border-[#1e90ff]/20">
          <div
            className="h-full bg-gradient-to-r from-[#1e90ff] to-[#00e5ff] transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(95, (elapsed / 2500) * 100)}%` }}
          />
        </div>

        {/* Latency counter */}
        <div className="mt-3 flex items-center justify-center gap-3 text-[10px] font-mono text-slate-400">
          <span>SCAN DURATION: {(elapsed / 1000).toFixed(1)}s</span>
          <span>·</span>
          <span>PROTOCOL: GEMMA-4 DUAL-PASS</span>
        </div>
      </div>
    </div>
  );
};
