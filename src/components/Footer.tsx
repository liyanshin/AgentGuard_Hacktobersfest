import React from 'react';
import { Shield, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto py-6 border-t border-[#1e90ff]/15 bg-[#060a14] text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-slate-500">
          <Shield className="w-3.5 h-3.5 text-[#1e90ff]" />
          <span>AgentShield · Local Memory Interceptor</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400" /> Client-Side Confidentiality
          </span>
        </div>

        <div className="text-[11px] tracking-wider text-slate-400 uppercase">
          Built by <span className="text-[#00bfff] font-bold">Kalyani & Jaywardhan</span>
        </div>
      </div>
    </footer>
  );
};
