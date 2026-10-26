import React from 'react';

// BAZZ: Cyan tactical sniper droplet with rotating targeting reticle and darting optics
export const BazzAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean; onClick?: () => void }> = ({
  size = 48,
  className = '',
  isActive = false,
  onClick,
}) => (
  <div 
    onClick={onClick}
    className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-all duration-300 ${
      isActive ? 'scale-110 drop-shadow-[0_0_16px_rgba(6,182,212,0.9)]' : 'hover:scale-105 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]'
    }`}
  >
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob ${className}`}>
      <defs>
        <linearGradient id="bazzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <filter id="bazzGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22d3ee" floodOpacity={isActive ? '0.95' : '0.6'} />
        </filter>
      </defs>
      {/* Outer Tactical Reticle (Spinning when active) */}
      <circle
        cx="32"
        cy="34"
        r="28"
        stroke="#06b6d4"
        strokeWidth="1.2"
        strokeDasharray="4 6"
        opacity={isActive ? 0.9 : 0.4}
        className={isActive ? 'animate-[spin_6s_linear_infinite]' : ''}
      />
      {/* Droplet Body */}
      <path
        d="M32 6 C32 6 52 30 52 44 C52 54 43 60 32 60 C21 60 12 54 12 44 C12 30 32 6 32 6 Z"
        fill="url(#bazzGrad)"
        filter="url(#bazzGlow)"
        stroke="#67e8f9"
        strokeWidth="1.5"
      />
      {/* Tactical Visor / Crosshair */}
      <line x1="20" y1="40" x2="44" y2="40" stroke="#083344" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      {/* Glowing Optics */}
      <g className="bot-dart">
        <rect x="23" y="37" width="5" height="10" rx="2" fill="#ffffff" className="bot-blink" />
        <rect x="36" y="37" width="5" height="10" rx="2" fill="#ffffff" className="bot-blink" />
        <circle cx="25.5" cy="42" r="1.5" fill="#06b6d4" />
        <circle cx="38.5" cy="42" r="1.5" fill="#06b6d4" />
      </g>
    </svg>
    {isActive && (
      <span className="absolute -inset-1.5 rounded-full border border-cyan-400 animate-ping opacity-50 pointer-events-none" />
    )}
  </div>
);

// QUILO: Ruby/Rose faceted gem with shimmering crystal facet pulses and satellites
export const QuiloAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean; onClick?: () => void }> = ({
  size = 48,
  className = '',
  isActive = false,
  onClick,
}) => (
  <div 
    onClick={onClick}
    className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-all duration-300 ${
      isActive ? 'scale-110 drop-shadow-[0_0_16px_rgba(244,63,94,0.9)]' : 'hover:scale-105 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]'
    }`}
  >
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob-fast ${className}`}>
      <defs>
        <linearGradient id="quiloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <filter id="quiloGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f43f5e" floodOpacity={isActive ? '0.95' : '0.6'} />
        </filter>
      </defs>
      {/* Outer Hexagon Orbit */}
      <polygon
        points="32,2 60,16 60,48 32,62 4,48 4,16"
        stroke="#f43f5e"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity={isActive ? 0.8 : 0.3}
        className={isActive ? 'animate-[spin_8s_linear_infinite]' : ''}
      />
      {/* Main Faceted Crystal */}
      <polygon
        points="32,6 54,18 54,46 32,58 10,46 10,18"
        fill="url(#quiloGrad)"
        filter="url(#quiloGlow)"
        stroke="#fda4af"
        strokeWidth="1.5"
      />
      {/* Shimmering Top & Side Facets */}
      <polygon points="32,6 54,18 32,28 10,18" fill="#ffe4e6" opacity={isActive ? '0.85' : '0.5'} className="animate-pulse" />
      <polygon points="54,18 54,46 32,36 32,28" fill="#9f1239" opacity="0.6" />
      <polygon points="10,18 10,46 32,36 32,28" fill="#e11d48" opacity="0.7" />
      {/* Central Quantum Eye */}
      <circle cx="32" cy="32" r="3.5" fill="#ffffff" className="bot-blink" />
    </svg>
    {isActive && (
      <span className="absolute -inset-1.5 rounded-full border border-pink-400 animate-ping opacity-50 pointer-events-none" />
    )}
  </div>
);

// TOMI: Amber/Rose protective squircle with glowing guardian shield
export const TomiAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean; onClick?: () => void }> = ({
  size = 48,
  className = '',
  isActive = false,
  onClick,
}) => (
  <div 
    onClick={onClick}
    className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-all duration-300 ${
      isActive ? 'scale-110 drop-shadow-[0_0_16px_rgba(251,113,133,0.9)]' : 'hover:scale-105 drop-shadow-[0_0_8px_rgba(251,113,133,0.4)]'
    }`}
  >
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob ${className}`}>
      <defs>
        <linearGradient id="tomiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="50%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <filter id="tomiGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fb7185" floodOpacity={isActive ? '0.95' : '0.6'} />
        </filter>
      </defs>
      {/* Guardian Shield Outline */}
      <rect
        x="6"
        y="8"
        width="52"
        height="48"
        rx="18"
        stroke="#fb7185"
        strokeWidth="1.2"
        strokeDasharray="6 3"
        opacity={isActive ? 0.8 : 0.3}
        className={isActive ? 'animate-[spin_10s_linear_infinite]' : ''}
      />
      <rect
        x="10"
        y="12"
        width="44"
        height="40"
        rx="14"
        fill="url(#tomiGrad)"
        filter="url(#tomiGlow)"
        stroke="#fecdd3"
        strokeWidth="1.5"
      />
      {/* Armored Visor */}
      <rect x="18" y="24" width="28" height="15" rx="5" fill="#4c0519" opacity="0.75" />
      <g className="bot-dart">
        <rect x="23" y="27" width="4.5" height="10" rx="2" fill="#ffffff" className="bot-blink" />
        <rect x="36.5" y="27" width="4.5" height="10" rx="2" fill="#ffffff" className="bot-blink" />
      </g>
    </svg>
    {isActive && (
      <span className="absolute -inset-1.5 rounded-full border border-rose-400 animate-ping opacity-50 pointer-events-none" />
    )}
  </div>
);

// OKKO: Cyber-violet rounded triangle with dynamic frequency audio visualizer
export const OkkoAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean; onClick?: () => void }> = ({
  size = 48,
  className = '',
  isActive = false,
  onClick,
}) => (
  <div 
    onClick={onClick}
    className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-all duration-300 ${
      isActive ? 'scale-110 drop-shadow-[0_0_16px_rgba(168,85,247,0.9)]' : 'hover:scale-105 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]'
    }`}
  >
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob-fast ${className}`}>
      <defs>
        <linearGradient id="okkoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
        <filter id="okkoGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity={isActive ? '0.95' : '0.6'} />
        </filter>
      </defs>
      {/* Outer Pulse Arc */}
      <circle
        cx="32"
        cy="36"
        r="26"
        stroke="#c084fc"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity={isActive ? 0.8 : 0.3}
        className={isActive ? 'animate-[spin_7s_linear_infinite]' : ''}
      />
      {/* Delta Body */}
      <path
        d="M32 10 L54 50 C56 54 52 58 48 58 L16 58 C12 58 8 54 10 50 Z"
        fill="url(#okkoGrad)"
        filter="url(#okkoGlow)"
        stroke="#e9d5ff"
        strokeWidth="1.5"
      />
      {/* Tri-Wave Frequency Visualizer on Visor */}
      <g className="bot-dart">
        <rect x="23" y="40" width="3" height="10" rx="1.5" fill="#ffffff" className="animate-pulse" />
        <rect x="28" y="36" width="3" height="14" rx="1.5" fill="#f3e8ff" className="animate-pulse" />
        <rect x="33" y="36" width="3" height="14" rx="1.5" fill="#f3e8ff" className="animate-pulse" />
        <rect x="38" y="40" width="3" height="10" rx="1.5" fill="#ffffff" className="animate-pulse" />
      </g>
    </svg>
    {isActive && (
      <span className="absolute -inset-1.5 rounded-full border border-purple-400 animate-ping opacity-50 pointer-events-none" />
    )}
  </div>
);

// LUX: Monolithic white/platinum head with sweeping laser visor beam
export const LuxAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean; onClick?: () => void }> = ({
  size = 48,
  className = '',
  isActive = false,
  onClick,
}) => (
  <div 
    onClick={onClick}
    className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-all duration-300 ${
      isActive ? 'scale-110 drop-shadow-[0_0_18px_rgba(255,255,255,0.95)]' : 'hover:scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
    }`}
  >
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob ${className}`}>
      <defs>
        <linearGradient id="luxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <filter id="luxGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity={isActive ? '0.9' : '0.5'} />
        </filter>
      </defs>
      {/* Outer Halo Ring */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeDasharray="8 6"
        opacity={isActive ? 0.9 : 0.4}
        className={isActive ? 'animate-[spin_12s_linear_infinite]' : ''}
      />
      {/* Cloud / Pill Body */}
      <ellipse cx="32" cy="34" rx="24" ry="16" fill="url(#luxGrad)" filter="url(#luxGlow)" stroke="#f8fafc" strokeWidth="1.5" />
      <circle cx="24" cy="28" r="11" fill="url(#luxGrad)" />
      <circle cx="40" cy="28" r="11" fill="url(#luxGrad)" />
      <circle cx="32" cy="24" r="13" fill="url(#luxGrad)" />
      {/* Dark Visor Slit with Laser */}
      <rect x="20" y="27" width="24" height="9" rx="4.5" fill="#020617" opacity="0.9" />
      <g className="bot-dart">
        <circle cx="28" cy="31.5" r="2.5" fill="#38bdf8" className="bot-blink" />
        <circle cx="36" cy="31.5" r="2.5" fill="#38bdf8" className="bot-blink" />
      </g>
    </svg>
    {isActive && (
      <span className="absolute -inset-1.5 rounded-full border border-white animate-ping opacity-50 pointer-events-none" />
    )}
  </div>
);

// FERRO: Electric cobalt diamond with spinning radar sonar wave
export const FerroAvatar: React.FC<{ size?: number; className?: string; isActive?: boolean; onClick?: () => void }> = ({
  size = 48,
  className = '',
  isActive = false,
  onClick,
}) => (
  <div 
    onClick={onClick}
    className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-all duration-300 ${
      isActive ? 'scale-110 drop-shadow-[0_0_16px_rgba(56,189,248,0.9)]' : 'hover:scale-105 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]'
    }`}
  >
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`bot-bob-fast ${className}`}>
      <defs>
        <linearGradient id="ferroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <filter id="ferroGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity={isActive ? '0.95' : '0.6'} />
        </filter>
      </defs>
      {/* Radar Sonar Arc */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="#60a5fa"
        strokeWidth="1.2"
        strokeDasharray="3 5"
        opacity={isActive ? 0.85 : 0.35}
        className={isActive ? 'animate-[spin_5s_linear_infinite]' : ''}
      />
      {/* Diamond Body */}
      <rect
        x="13"
        y="13"
        width="38"
        height="38"
        rx="12"
        transform="rotate(45 32 32)"
        fill="url(#ferroGrad)"
        filter="url(#ferroGlow)"
        stroke="#93c5fd"
        strokeWidth="1.5"
      />
      {/* Sonar Center Target */}
      <circle cx="32" cy="32" r="5" fill="#ffffff" className="bot-blink" />
      <circle cx="32" cy="32" r="2" fill="#1d4ed8" />
    </svg>
    {isActive && (
      <span className="absolute -inset-1.5 rounded-full border border-blue-400 animate-ping opacity-50 pointer-events-none" />
    )}
  </div>
);

// DEV'S QUANT CORE (NEXUS LEAD): Central Golden Matrix Core with multi-layered quantum rings
export const DevQuantCoreDisc: React.FC<{ size?: number; className?: string; onClick?: () => void }> = ({
  size = 80,
  className = '',
  onClick,
}) => (
  <div onClick={onClick} className={`relative inline-flex items-center justify-center cursor-pointer select-none group ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="quantCoreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#080c18" />
          <stop offset="80%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <filter id="quantCoreGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.8" />
        </filter>
      </defs>
      {/* Outer Counter-Rotating Dashed Gold Ring */}
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeDasharray="8 6"
        className="animate-[spin_12s_linear_infinite]"
      />
      {/* Cyan Inner Gyroscope Ring */}
      <circle
        cx="50"
        cy="50"
        r="43"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeDasharray="4 8"
        opacity="0.6"
        className="animate-[spin_8s_linear_infinite_reverse]"
      />
      {/* Pulsing Quantum Field */}
      <circle
        cx="50"
        cy="50"
        r="39"
        stroke="#fbbf24"
        strokeWidth="1.5"
        opacity="0.35"
        className="animate-ping"
      />
      {/* Main Reactor Body */}
      <circle cx="50" cy="50" r="36" fill="url(#quantCoreGrad)" filter="url(#quantCoreGlow)" stroke="#38bdf8" strokeWidth="1.5" />
      {/* Sacred Golden Hexagon Geometry */}
      <polygon points="50,22 68,32 68,54 50,64 32,54 32,32" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.75" />
      {/* Active Optic Slits */}
      <g className="bot-dart">
        <rect x="41" y="42" width="5" height="15" rx="2.5" fill="#38bdf8" className="bot-blink" />
        <rect x="54" y="42" width="5" height="15" rx="2.5" fill="#38bdf8" className="bot-blink" />
      </g>
    </svg>
    {/* Micro Ping Badge */}
    <span className="absolute -bottom-1 text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-yellow-400 text-black font-black uppercase tracking-wider shadow-md">
      CORE
    </span>
  </div>
);

// Backward compatibility alias for GrokCoreDisc & JevAvatar
export const GrokCoreDisc = DevQuantCoreDisc;
export const JevAvatar: React.FC<{ size?: number; className?: string; onClick?: () => void }> = ({ size = 48, className = '', onClick }) => (
  <DevQuantCoreDisc size={size} className={className} onClick={onClick} />
);

// Sleek subtle corner markers for terminal panels
export const CyberCornerBrackets: React.FC = () => (
  <>
    <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-white/20 pointer-events-none z-10" />
    <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-white/20 pointer-events-none z-10" />
    <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-white/20 pointer-events-none z-10" />
    <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-white/20 pointer-events-none z-10" />
  </>
);
