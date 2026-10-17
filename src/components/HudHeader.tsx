import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Volume2, VolumeX, Activity, Radio, Cpu } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface HudHeaderProps {
  scanCount: number;
  threatsBlocked: number;
}

export const HudHeader: React.FC<HudHeaderProps> = ({ scanCount, threatsBlocked }) => {
  const [audioMuted, setAudioMuted] = useState(false);

  const toggleAudio = () => {
    const nextState = !audioMuted;
    setAudioMuted(nextState);
    soundFX.setEnabled(!nextState);
    if (!nextState) {
      soundFX.playClick();
    }
  };

  return (
    <header className="w-full border-b border-[#1e90ff]/20 bg-[#080d1a]/95 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#0c1a33] to-[#060a14] border border-[#1e90ff] shadow-neon-blue">
            <Shield className="w-5 h-5 text-[#00bfff]" />
            <div className="absolute inset-0 rounded-lg border border-[#00e5ff]/40 animate-pulse pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-hud font-extrabold text-lg sm:text-xl tracking-wider text-white">
                AGENT<span className="text-[#00bfff]">SHIELD</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e90ff]/15 text-[#38bdf8] border border-[#1e90ff]/40 uppercase tracking-wider">
                v2.4 HUD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans tracking-wide">
              AI-Powered Data Leak Interceptor & Guardian
            </p>
          </div>
        </div>

        {/* Real-time Status & Telemetry Bar */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono">
          {/* Active Protection Beacon */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#0a1426] border border-[#1e90ff]/30 text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
            </span>
            <span className="text-[11px] text-emerald-400 tracking-wider">INTERCEPTOR ARMED</span>
          </div>

          {/* Model Engine Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-[#1e90ff]" />
            <span className="text-[11px]">ENGINE: <strong className="text-slate-200">GEMMA 4</strong> (2-PASS)</span>
          </div>

          {/* Scans Run Counter */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-[#00bfff]" />
            <span className="text-[11px]">SCANS: <strong className="text-white">{scanCount}</strong></span>
          </div>

          {/* Threats Blocked Counter */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-[#ff4d4d]" />
            <span className="text-[11px]">FLAGGED: <strong className="text-[#ff4d4d]">{threatsBlocked}</strong></span>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleAudio}
            title={audioMuted ? 'Unmute HUD Audio' : 'Mute HUD Audio'}
            className="p-1.5 rounded bg-slate-900 border border-[#1e90ff]/30 text-[#1e90ff] hover:bg-[#1e90ff]/20 hover:text-white transition-colors"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
