import React from 'react';

// BAZZ: Cyan droplet with two white slit eyes
export const BazzAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="bazzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2dd4bf" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="bazzGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2dd4bf" floodOpacity="0.5" />
      </filter>
    </defs>
    <path
      d="M32 6 C32 6 52 30 52 44 C52 54 43 60 32 60 C21 60 12 54 12 44 C12 30 32 6 32 6 Z"
      fill="url(#bazzGrad)"
      filter="url(#bazzGlow)"
    />
    {/* Eyes */}
    <rect x="23" y="38" width="4" height="10" rx="2" fill="#ffffff" />
    <rect x="37" y="38" width="4" height="10" rx="2" fill="#ffffff" />
  </svg>
);

// QUILO: Pink faceted hexagonal gem
export const QuiloAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="quiloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <filter id="quiloGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ec4899" floodOpacity="0.5" />
      </filter>
    </defs>
    <polygon
      points="32,6 54,18 54,46 32,58 10,46 10,18"
      fill="url(#quiloGrad)"
      filter="url(#quiloGlow)"
    />
    <polygon points="32,6 54,18 32,28 10,18" fill="#fda4af" opacity="0.4" />
    <polygon points="54,18 54,46 32,36 32,28" fill="#e11d48" opacity="0.5" />
  </svg>
);

// TOMI: Coral rounded squircle with two white eyes
export const TomiAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="tomiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
      <filter id="tomiGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fb7185" floodOpacity="0.5" />
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
    <rect x="23" y="27" width="4" height="11" rx="2" fill="#ffffff" />
    <rect x="37" y="27" width="4" height="11" rx="2" fill="#ffffff" />
  </svg>
);

// OKKO: Lavender rounded triangle
export const OkkoAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="okkoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <filter id="okkoGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.5" />
      </filter>
    </defs>
    <path
      d="M32 10 L54 50 C56 54 52 58 48 58 L16 58 C12 58 8 54 10 50 Z"
      fill="url(#okkoGrad)"
      filter="url(#okkoGlow)"
    />
  </svg>
);

// LUX: White cloud/pill capsule with two dark eyes
export const LuxAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="luxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <filter id="luxGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.4" />
      </filter>
    </defs>
    <ellipse cx="32" cy="34" rx="24" ry="16" fill="url(#luxGrad)" filter="url(#luxGlow)" />
    <circle cx="24" cy="28" r="11" fill="url(#luxGrad)" />
    <circle cx="40" cy="28" r="11" fill="url(#luxGrad)" />
    <circle cx="32" cy="24" r="13" fill="url(#luxGrad)" />
    <rect x="25" y="27" width="4" height="9" rx="2" fill="#0f172a" />
    <rect x="35" y="27" width="4" height="9" rx="2" fill="#0f172a" />
  </svg>
);

// FERRO: Electric blue rounded diamond
export const FerroAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="ferroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <filter id="ferroGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.5" />
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
  </svg>
);

// JEV: Robot head avatar with black visor and pill body
export const JevAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <rect x="10" y="16" width="44" height="32" rx="16" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
    <rect x="18" y="24" width="28" height="16" rx="8" fill="#090d16" />
    <circle cx="28" cy="32" r="3" fill="#38bdf8" />
    <circle cx="36" cy="32" r="3" fill="#38bdf8" />
  </svg>
);

// GROK BOT CENTRAL CORE: The black circular rotating eye disc in the center of the line
export const GrokCoreDisc: React.FC<{ size?: number; className?: string }> = ({ size = 80, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <defs>
      <radialGradient id="grokRim" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stopColor="#0f172a" />
        <stop offset="90%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#eab308" />
      </radialGradient>
      <filter id="grokGlow">
        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#eab308" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Outer dashed spinning ring */}
    <circle cx="50" cy="50" r="47" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[spin_12s_linear_infinite]" />
    {/* Inner dark body */}
    <circle cx="50" cy="50" r="42" fill="url(#grokRim)" filter="url(#grokGlow)" stroke="#334155" strokeWidth="2" />
    {/* Eyes */}
    <rect x="36" y="40" width="6" height="20" rx="3" fill="#ffffff" />
    <rect x="58" y="40" width="6" height="20" rx="3" fill="#ffffff" />
  </svg>
);

// Cyber corner brackets for panels
export const CyberCornerBrackets: React.FC = () => (
  <>
    <span className="absolute -top-[1.5px] -left-[1.5px] w-2.5 h-2.5 border-t-[2.5px] border-l-[2.5px] border-yellow-400 pointer-events-none z-20" />
    <span className="absolute -top-[1.5px] -right-[1.5px] w-2.5 h-2.5 border-t-[2.5px] border-r-[2.5px] border-yellow-400 pointer-events-none z-20" />
    <span className="absolute -bottom-[1.5px] -left-[1.5px] w-2.5 h-2.5 border-b-[2.5px] border-l-[2.5px] border-yellow-400 pointer-events-none z-20" />
    <span className="absolute -bottom-[1.5px] -right-[1.5px] w-2.5 h-2.5 border-b-[2.5px] border-r-[2.5px] border-yellow-400 pointer-events-none z-20" />
  </>
);
