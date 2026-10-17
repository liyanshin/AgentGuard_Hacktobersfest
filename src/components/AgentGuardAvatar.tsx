import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { RiskLevel } from '../types';

interface AgentGuardAvatarProps {
  status: 'idle' | 'scanning' | RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  spokenText?: string;
}

export const AgentGuardAvatar: React.FC<AgentGuardAvatarProps> = ({
  status,
  size = 'md',
  spokenText,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getThemeColors = () => {
    switch (status) {
      case 'high_risk':
        return {
          glow: 'rgba(255, 59, 59, 0.65)',
          stroke: '#ff3b3b',
          visor: '#ff4d4d',
          accent: '#991b1b',
          badge: '#ff3b3b',
        };
      case 'caution':
        return {
          glow: 'rgba(245, 158, 11, 0.55)',
          stroke: '#f59e0b',
          visor: '#fbbf24',
          accent: '#b45309',
          badge: '#f59e0b',
        };
      case 'safe':
        return {
          glow: 'rgba(16, 185, 129, 0.55)',
          stroke: '#10b981',
          visor: '#34d399',
          accent: '#065f46',
          badge: '#10b981',
        };
      case 'scanning':
        return {
          glow: 'rgba(0, 191, 255, 0.8)',
          stroke: '#00bfff',
          visor: '#38bdf8',
          accent: '#0369a1',
          badge: '#00e5ff',
        };
      case 'idle':
      default:
        return {
          glow: 'rgba(30, 144, 255, 0.4)',
          stroke: '#1e90ff',
          visor: '#60a5fa',
          accent: '#1e40af',
          badge: '#3b82f6',
        };
    }
  };

  const colors = getThemeColors();

  const dimensionClass = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }[size];

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!spokenText || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 1.05;
    utterance.pitch = 1.08; // Friendly, slightly upbeat pitch

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none group">
      {/* Outer Pulse Glow */}
      <div
        className={`relative ${dimensionClass} flex items-center justify-center rounded-2xl transition-all duration-500`}
        style={{
          boxShadow: `0 0 24px ${colors.glow}`,
          background: 'linear-gradient(135deg, #0d1527 0%, #080c16 100%)',
          border: `2px solid ${colors.stroke}`,
        }}
      >
        {/* SVG Mascot Character: AgentGuard */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1.5 transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Ambient Shield Aura */}
          <path
            d="M50 8L82 22V48C82 70 50 90 50 90C50 90 18 70 18 48V22L50 8Z"
            fill={colors.accent}
            fillOpacity="0.22"
            stroke={colors.stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Inner Shield Plate */}
          <path
            d="M50 14L76 25V46C76 64 50 82 50 82C50 82 24 64 24 46V25L50 14Z"
            fill="#0f172a"
            stroke={colors.stroke}
            strokeWidth="1.5"
          />

          {/* Security Officer Beret / Helmet Crest */}
          <path
            d="M32 28C32 22 40 18 50 18C60 18 68 22 68 28H32Z"
            fill={colors.accent}
            stroke={colors.stroke}
            strokeWidth="1.5"
          />
          {/* Badge star / shield crest on helmet */}
          <circle cx="50" cy="24" r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" />

          {/* Friendly Visor Face */}
          <rect
            x="34"
            y="32"
            width="32"
            height="18"
            rx="6"
            fill="#050811"
            stroke={colors.stroke}
            strokeWidth="1.5"
          />

          {/* Visor Content depends on state */}
          {status === 'safe' && (
            <>
              {/* Friendly Happy Eyes (^ ^) */}
              <path
                d="M40 43C41 38 45 38 46 43"
                stroke={colors.visor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M54 43C55 38 59 38 60 43"
                stroke={colors.visor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Soft smile */}
              <path
                d="M47 46C49 48 51 48 53 46"
                stroke={colors.visor}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </>
          )}

          {status === 'caution' && (
            <>
              {/* Inquisitive / Alert Eyes */}
              <circle cx="43" cy="41" r="3.2" fill={colors.visor} />
              <circle cx="57" cy="41" r="3.2" fill={colors.visor} />
              {/* Thoughtful line */}
              <line x1="46" y1="46" x2="54" y2="46" stroke={colors.visor} strokeWidth="1.8" strokeLinecap="round" />
            </>
          )}

          {status === 'high_risk' && (
            <>
              {/* Stern Protective Visor Slit */}
              <path
                d="M38 38L45 42M62 38L55 42"
                stroke={colors.visor}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="44" cy="42" r="2.5" fill={colors.visor} />
              <circle cx="56" cy="42" r="2.5" fill={colors.visor} />
              <line x1="45" y1="46" x2="55" y2="46" stroke={colors.visor} strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {status === 'scanning' && (
            <>
              {/* Scanning Laser Sweep Line */}
              <rect x="36" y="39" width="28" height="4" rx="2" fill={colors.visor} className="animate-pulse" />
              <line x1="36" y1="41" x2="64" y2="41" stroke="#ffffff" strokeWidth="1.5" />
            </>
          )}

          {status === 'idle' && (
            <>
              {/* Friendly Normal Glow Eyes */}
              <ellipse cx="43" cy="41" rx="2.5" ry="3.5" fill={colors.visor} />
              <ellipse cx="57" cy="41" rx="2.5" ry="3.5" fill={colors.visor} />
              <circle cx="44.2" cy="40" r="1" fill="#ffffff" />
              <circle cx="58.2" cy="40" r="1" fill="#ffffff" />
              {/* Gentle smile */}
              <path
                d="M46 45C48 47 52 47 54 45"
                stroke={colors.visor}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Chest Shield Emblem */}
          <path
            d="M50 56L61 62V71C61 78 50 83 50 83C50 83 39 78 39 71V62L50 56Z"
            fill={colors.accent}
            stroke={colors.stroke}
            strokeWidth="1.2"
          />
          {status === 'safe' ? (
            /* Checkmark */
            <path
              d="M46 70L49 73L55 65"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : status === 'high_risk' ? (
            /* Exclamation mark */
            <>
              <line x1="50" y1="63" x2="50" y2="71" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="50" cy="76" r="1.2" fill="#ffffff" />
            </>
          ) : status === 'caution' ? (
            /* Warning triangle mini */
            <circle cx="50" cy="69" r="2.2" fill="#ffffff" />
          ) : (
            /* Keyhole / shield core */
            <circle cx="50" cy="69" r="2.5" fill="#60a5fa" />
          )}
        </svg>

        {/* Small Audio Listen Button Overlay if text is available */}
        {spokenText && size !== 'sm' && (
          <button
            onClick={handleSpeak}
            title={isSpeaking ? 'Stop voice' : 'Listen to AgentGuard'}
            className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-slate-900 border border-[#1e90ff]/60 text-[#1e90ff] hover:bg-[#1e90ff]/20 hover:text-white transition-all shadow-md"
          >
            {isSpeaking ? (
              <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      <div className="mt-1 flex items-center gap-1">
        <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-[#1e90ff]">
          AgentGuard
        </span>
      </div>
    </div>
  );
};
