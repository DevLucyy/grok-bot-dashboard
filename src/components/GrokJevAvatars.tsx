import React from 'react';

// BAZZ: Cyan droplet with two white slit eyes that blink and dart
export const BazzAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean }> = ({
  size = 48,
  className = '',
  isActive = false,
}) => (
  <div className={`relative inline-flex items-center justify-center ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]' : 'drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]'} transition-all duration-300`}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob ${className}`}>
      <defs>
        <linearGradient id="bazzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="bazzGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2dd4bf" floodOpacity={isActive ? '0.9' : '0.5'} />
        </filter>
      </defs>
      <path
        d="M32 6 C32 6 52 30 52 44 C52 54 43 60 32 60 C21 60 12 54 12 44 C12 30 32 6 32 6 Z"
        fill="url(#bazzGrad)"
        filter="url(#bazzGlow)"
      />
      {/* Eyes with blinking & darting */}
      <g className="bot-dart">
        <rect x="23" y="38" width="4" height="10" rx="2" fill="#ffffff" className="bot-blink" />
        <rect x="37" y="38" width="4" height="10" rx="2" fill="#ffffff" className="bot-blink" />
      </g>
    </svg>
    {isActive && (
      <span className="absolute -inset-1 rounded-full border border-cyan-400 animate-ping opacity-40 pointer-events-none" />
    )}
  </div>
);

// QUILO: Pink faceted hexagonal gem with shimmering facets and hovering
export const QuiloAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean }> = ({
  size = 48,
  className = '',
  isActive = false,
}) => (
  <div className={`relative inline-flex items-center justify-center ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]' : 'drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]'} transition-all duration-300`}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob-fast ${className}`}>
      <defs>
        <linearGradient id="quiloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <filter id="quiloGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ec4899" floodOpacity={isActive ? '0.9' : '0.5'} />
        </filter>
      </defs>
      <polygon
        points="32,6 54,18 54,46 32,58 10,46 10,18"
        fill="url(#quiloGrad)"
        filter="url(#quiloGlow)"
      />
      <polygon points="32,6 54,18 32,28 10,18" fill="#fda4af" opacity={isActive ? '0.7' : '0.4'} className="animate-pulse" />
      <polygon points="54,18 54,46 32,36 32,28" fill="#e11d48" opacity="0.6" />
    </svg>
    {isActive && (
      <span className="absolute -inset-1 rounded-full border border-pink-400 animate-ping opacity-40 pointer-events-none" />
    )}
  </div>
);

// TOMI: Coral rounded squircle with two white eyes that blink and glance
export const TomiAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean }> = ({
  size = 48,
  className = '',
  isActive = false,
}) => (
  <div className={`relative inline-flex items-center justify-center ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(251,113,133,0.8)]' : 'drop-shadow-[0_0_6px_rgba(251,113,133,0.4)]'} transition-all duration-300`}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob ${className}`}>
      <defs>
        <linearGradient id="tomiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <filter id="tomiGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fb7185" floodOpacity={isActive ? '0.9' : '0.5'} />
        </filter>
      </defs>
      <rect
        x="10"
        y="12"
        width="44"
        height="42"
        rx="14"
        fill="url(#tomiGrad)"
        filter="url(#tomiGlow)"
      />
      <g className="bot-dart">
        <rect x="23" y="27" width="4" height="11" rx="2" fill="#ffffff" className="bot-blink" />
        <rect x="37" y="27" width="4" height="11" rx="2" fill="#ffffff" className="bot-blink" />
      </g>
    </svg>
    {isActive && (
      <span className="absolute -inset-1 rounded-full border border-rose-400 animate-ping opacity-40 pointer-events-none" />
    )}
  </div>
);

// OKKO: Lavender rounded triangle with floating motion and glowing eyes
export const OkkoAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean }> = ({
  size = 48,
  className = '',
  isActive = false,
}) => (
  <div className={`relative inline-flex items-center justify-center ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' : 'drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]'} transition-all duration-300`}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob-fast ${className}`}>
      <defs>
        <linearGradient id="okkoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="okkoGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity={isActive ? '0.9' : '0.5'} />
        </filter>
      </defs>
      <path
        d="M32 10 L54 50 C56 54 52 58 48 58 L16 58 C12 58 8 54 10 50 Z"
        fill="url(#okkoGrad)"
        filter="url(#okkoGlow)"
      />
      {/* Center glowing eye */}
      <circle cx="32" cy="40" r="5" fill="#ffffff" className="bot-blink" />
      <circle cx="32" cy="40" r="2.5" fill="#7c3aed" />
    </svg>
    {isActive && (
      <span className="absolute -inset-1 rounded-full border border-purple-400 animate-ping opacity-40 pointer-events-none" />
    )}
  </div>
);

// LUX: White cloud/pill capsule with glowing eyes that dart
export const LuxAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean }> = ({
  size = 48,
  className = '',
  isActive = false,
}) => (
  <div className={`relative inline-flex items-center justify-center ${isActive ? 'scale-110 drop-shadow-[0_0_14px_rgba(255,255,255,0.9)]' : 'drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]'} transition-all duration-300`}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob ${className}`}>
      <defs>
        <linearGradient id="luxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <filter id="luxGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity={isActive ? '0.8' : '0.4'} />
        </filter>
      </defs>
      <ellipse cx="32" cy="34" rx="24" ry="16" fill="url(#luxGrad)" filter="url(#luxGlow)" />
      <circle cx="24" cy="28" r="11" fill="url(#luxGrad)" />
      <circle cx="40" cy="28" r="11" fill="url(#luxGrad)" />
      <circle cx="32" cy="24" r="13" fill="url(#luxGrad)" />
      <g className="bot-dart">
        <rect x="25" y="27" width="4" height="9" rx="2" fill="#0f172a" className="bot-blink" />
        <rect x="35" y="27" width="4" height="9" rx="2" fill="#0f172a" className="bot-blink" />
      </g>
    </svg>
    {isActive && (
      <span className="absolute -inset-1 rounded-full border border-white animate-ping opacity-40 pointer-events-none" />
    )}
  </div>
);

// FERRO: Electric blue diamond with floating rotation and eye scan
export const FerroAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean }> = ({
  size = 48,
  className = '',
  isActive = false,
}) => (
  <div className={`relative inline-flex items-center justify-center ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]' : 'drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]'} transition-all duration-300`}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob-fast ${className}`}>
      <defs>
        <linearGradient id="ferroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <filter id="ferroGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity={isActive ? '0.9' : '0.5'} />
        </filter>
      </defs>
      <rect
        x="12"
        y="12"
        width="40"
        height="40"
        rx="12"
        transform="rotate(45 32 32)"
        fill="url(#ferroGrad)"
        filter="url(#ferroGlow)"
      />
      <circle cx="32" cy="32" r="4" fill="#ffffff" className="bot-blink" />
    </svg>
    {isActive && (
      <span className="absolute -inset-1 rounded-full border border-blue-400 animate-ping opacity-40 pointer-events-none" />
    )}
  </div>
);

// JEV: Robot head avatar with black visor, glowing cyan eyes that blink and sweep
export const JevAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <div className="relative inline-flex items-center justify-center drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob ${className}`}>
      <rect x="10" y="16" width="44" height="32" rx="16" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
      <rect x="18" y="24" width="28" height="16" rx="8" fill="#090d16" />
      <g className="bot-dart">
        <circle cx="28" cy="32" r="3" fill="#38bdf8" className="bot-blink" />
        <circle cx="36" cy="32" r="3" fill="#38bdf8" className="bot-blink" />
      </g>
    </svg>
  </div>
);

// DEV'S QUANT CORE: Spinning golden matrix rim + cybernetic quant indicator
export const DevQuantCoreDisc: React.FC<{ size?: number; className?: string }> = ({ size = 80, className = '' }) => (
  <div className="relative inline-flex items-center justify-center">
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <defs>
        <radialGradient id="quantRim" cx="50%" cy="50%" r="50%">
          <stop offset="65%" stopColor="#0a0f1d" />
          <stop offset="85%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <filter id="quantGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f59e0b" floodOpacity="0.7" />
        </filter>
      </defs>
      {/* Outer spinning dashed ring */}
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeDasharray="6 4"
        className="animate-[spin_12s_linear_infinite]"
      />
      {/* Pulsing radar ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="#38bdf8"
        strokeWidth="1.5"
        opacity="0.4"
        className="animate-ping"
      />
      {/* Inner dark body with glow */}
      <circle cx="50" cy="50" r="40" fill="url(#quantRim)" filter="url(#quantGlow)" stroke="#38bdf8" strokeWidth="1.5" />
      {/* Golden Hexagon & Quant Slits */}
      <polygon points="50,22 72,35 72,65 50,78 28,65 28,35" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.6" />
      <g className="bot-dart">
        <rect x="38" y="44" width="6" height="14" rx="2" fill="#38bdf8" className="bot-blink" />
        <rect x="56" y="44" width="6" height="14" rx="2" fill="#38bdf8" className="bot-blink" />
      </g>
    </svg>
  </div>
);

// Backward compatibility alias for GrokCoreDisc
export const GrokCoreDisc = DevQuantCoreDisc;

// Cyber corner brackets for panels
export const CyberCornerBrackets: React.FC = () => (
  <>
    <span className="absolute -top-[1.5px] -left-[1.5px] w-2.5 h-2.5 border-t-[2.5px] border-l-[2.5px] border-yellow-400 pointer-events-none z-20" />
    <span className="absolute -top-[1.5px] -right-[1.5px] w-2.5 h-2.5 border-t-[2.5px] border-r-[2.5px] border-yellow-400 pointer-events-none z-20" />
    <span className="absolute -bottom-[1.5px] -left-[1.5px] w-2.5 h-2.5 border-b-[2.5px] border-l-[2.5px] border-yellow-400 pointer-events-none z-20" />
    <span className="absolute -bottom-[1.5px] -right-[1.5px] w-2.5 h-2.5 border-b-[2.5px] border-r-[2.5px] border-yellow-400 pointer-events-none z-20" />
  </>
);
