import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Scissors
} from 'lucide-react';
import { ScanResult, RiskLevel } from '../types';
import { AgentGuardAvatar } from './AgentGuardAvatar';
import { soundFX } from '../utils/audio';

interface RiskReportProps {
  result: ScanResult;
  onProceed: () => void;
  onEdit: () => void;
  onBlock: () => void;
  onRedactItem?: (detail: string) => void;
}

export const RiskReport: React.FC<RiskReportProps> = ({
  result,
  onProceed,
  onEdit,
  onBlock,
  onRedactItem,
}) => {
  const [copied, setCopied] = useState(false);

  const getRiskDetails = (level: RiskLevel) => {
    switch (level) {
      case 'high_risk':
        return {
          title: 'CRITICAL LEAK DETECTED',
          subtitle: 'Active sensitive credentials or high-risk identifiers found.',
          badgeBg: 'bg-red-500/15',
          badgeBorder: 'border-red-500',
          textColor: 'text-red-400',
          containerBorder: 'border-[#ff3b3b]',
          containerShadow: 'shadow-neon-red shadow-neon-red-pulse',
          icon: <ShieldAlert className="w-6 h-6 text-[#ff3b3b] animate-bounce" />,
          actionText: 'High exposure danger — do NOT share externally.',
        };
      case 'caution':
        return {
          title: 'POTENTIAL EXPOSURE RISK',
          subtitle: 'Content contains internal identifiers or personal contacts.',
          badgeBg: 'bg-amber-500/15',
          badgeBorder: 'border-amber-500/60',
          textColor: 'text-amber-400',
          containerBorder: 'border-amber-500/50',
          containerShadow: 'shadow-neon-caution',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          actionText: 'Review flagged items before dispatching to external AI.',
        };
      case 'safe':
      default:
        return {
          title: 'SAFE TO SHARE',
          subtitle: 'Zero sensitive credentials, PII, or confidential secrets detected.',
          badgeBg: 'bg-emerald-500/15',
          badgeBorder: 'border-emerald-500/60',
          textColor: 'text-emerald-400',
          containerBorder: 'border-emerald-500/50',
          containerShadow: 'shadow-neon-safe',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
          actionText: 'Content verified clean. Safe to transmit to external AI tools.',
        };
    }
  };

  const riskMeta = getRiskDetails(result.risk_level);

  return (
    <div
      className={`p-5 md:p-6 bg-[#0a0f20] border-2 rounded-sm transition-all duration-300 relative ${riskMeta.containerBorder} ${riskMeta.containerShadow}`}
    >
      {/* Cyber Corner Markers */}
      <div className={`absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 ${riskMeta.textColor}`} />
      <div className={`absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 ${riskMeta.textColor}`} />
      <div className={`absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 ${riskMeta.textColor}`} />
      <div className={`absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 ${riskMeta.textColor}`} />

      {/* Top Threat Classification Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-900 border border-slate-700">
            {riskMeta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-hud font-extrabold text-base md:text-lg tracking-wider uppercase ${riskMeta.textColor}`}
              >
                {riskMeta.title}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${riskMeta.badgeBg} ${riskMeta.badgeBorder} ${riskMeta.textColor}`}
              >
                LEVEL: {result.risk_level.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              {riskMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Latency & Protocol tag */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 self-start sm:self-auto">
          {result.latency_ms && (
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#00bfff]">
              {result.latency_ms}ms SCAN
            </span>
          )}
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            GEMMA 4 DUAL-PASS
          </span>
        </div>
      </div>

      {/* AgentGuard Speech Bubble & Avatar Section */}
      <div className="mb-6 flex flex-col sm:flex-row items-start gap-4 p-4 rounded bg-[#070b16] border border-[#1e90ff]/30 shadow-neon-blue">
        {/* Mascot Avatar */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <AgentGuardAvatar
            status={result.risk_level}
            size="md"
            spokenText={result.explanation}
          />
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 relative">
          {/* Decorative speech arrow on desktop */}
          <div className="hidden sm:block absolute -left-2 top-4 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-[#0d162d]" />

          <div className="p-4 rounded-xl bg-[#0d162d] border border-[#1e90ff]/40 text-slate-100 relative">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#00bfff] font-bold tracking-wider uppercase">
                  AGENTGUARD EXPLANATION
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  · Plain Language Security Brief
                </span>
              </div>
            </div>

            {/* Explanation Content */}
            <p className="text-sm text-slate-200 leading-relaxed font-sans font-normal">
              {result.explanation}
            </p>

            {/* Technical Summary Footnote */}
            {result.summary && (
              <div className="mt-3 pt-2 border-t border-[#1e90ff]/20 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="text-[#38bdf8]">Gemma-4 Finding:</span>
                <span>{result.summary}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flagged Items Breakdown Table */}
      {result.flagged_items && result.flagged_items.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="font-hud text-xs text-[#00bfff] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>DETECTED HAZARDS ({result.flagged_items.length})</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              CLICK REDACT TO AUTO-MASK IN INPUT
            </span>
          </div>

          <div className="space-y-2">
            {result.flagged_items.map((item, index) => {
              const categoryColor =
                item.category.toLowerCase().includes('credential')
                  ? 'text-red-400 border-red-500/40 bg-red-500/10'
                  : item.category.toLowerCase().includes('financial')
                  ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                  : 'text-[#38bdf8] border-[#1e90ff]/40 bg-[#1e90ff]/10';

              return (
                <div
                  key={index}
                  className="p-3 rounded bg-[#060a14] border border-[#1e90ff]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#1e90ff]/50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-2.5 overflow-hidden">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ${categoryColor}`}
                    >
                      {item.category}
                    </span>
                    <span className="font-mono text-xs text-slate-200 break-all">
                      {item.detail}
                    </span>
                  </div>

                  {onRedactItem && (
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        onRedactItem(item.detail);
                      }}
                      title="Redact this exact value with [REDACTED] in your input box"
                      className="self-end sm:self-auto flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-[#38bdf8] hover:text-white bg-[#1e90ff]/15 hover:bg-[#1e90ff]/30 border border-[#1e90ff]/30 rounded transition-all flex-shrink-0"
                    >
                      <Scissors className="w-3 h-3" />
                      <span>Mask / Redact</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Safe confirmation box */
        <div className="mb-6 p-4 rounded bg-[#06141a]/60 border border-emerald-500/30 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs font-sans text-slate-300">
            <strong className="text-emerald-400 font-mono uppercase tracking-wider">
              Zero Vulnerabilities Identified:
            </strong>{' '}
            No API credentials, secret passwords, customer PII, financial details, or proprietary source code patterns were detected.
          </div>
        </div>
      )}

      {/* Clear Action Row with the 3 Mandatory Buttons */}
      <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Button 1: Proceed */}
        <button
          onClick={() => {
            soundFX.playClick();
            onProceed();
          }}
          className="flex items-center justify-center gap-2 py-3 px-4 font-hud text-xs uppercase font-bold tracking-wider rounded bg-[#1e90ff]/20 hover:bg-[#1e90ff]/35 border border-[#1e90ff]/60 text-[#38bdf8] hover:text-white transition-all shadow-[0_0_15px_rgba(30,144,255,0.2)]"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Proceed (Reviewed)</span>
        </button>

        {/* Button 2: Edit */}
        <button
          onClick={() => {
            soundFX.playClick();
            onEdit();
          }}
          className="flex items-center justify-center gap-2 py-3 px-4 font-hud text-xs uppercase font-bold tracking-wider rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white transition-all"
        >
          <Edit3 className="w-4 h-4 text-[#00bfff]" />
          <span>Edit & Refine</span>
        </button>

        {/* Button 3: Block */}
        <button
          onClick={() => {
            soundFX.playClick();
            onBlock();
          }}
          className="flex items-center justify-center gap-2 py-3 px-4 font-hud text-xs uppercase font-bold tracking-wider rounded bg-red-500/15 hover:bg-red-500/30 border border-red-500/60 text-red-400 hover:text-white transition-all shadow-[0_0_15px_rgba(255,59,59,0.2)]"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>Block & Clear All</span>
        </button>
      </div>
    </div>
  );
};
