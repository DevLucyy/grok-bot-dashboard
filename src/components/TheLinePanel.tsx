import React from 'react';
import {
  CyberCornerBrackets,
  BazzAvatar,
  QuiloAvatar,
  TomiAvatar,
  OkkoAvatar,
  LuxAvatar,
  FerroAvatar,
  DevQuantCoreDisc,
} from './GrokJevAvatars';

interface Props {
  activeStationIndex: number;
  rugBinCount: number;
  vaultPings: string[];
  balance: number;
  conveyorTokens: string[];
  onInspectBot?: (name: string) => void;
}

const STATIONS = [
  { name: 'QUILO', role: 'ARB', avatar: QuiloAvatar, color: 'text-pink-400', borderColor: 'border-pink-500', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]' },
  { name: 'BAZZ', role: 'SNIPE', avatar: BazzAvatar, color: 'text-cyan-400', borderColor: 'border-cyan-500', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]' },
  { name: 'TOMI', role: 'EXIT', avatar: TomiAvatar, color: 'text-rose-400', borderColor: 'border-rose-500', glow: 'shadow-[0_0_15px_rgba(251,113,133,0.4)]' },
  { name: 'OKKO', role: 'LADDER', avatar: OkkoAvatar, color: 'text-purple-400', borderColor: 'border-purple-500', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]' },
  { name: 'LUX', role: 'BOOK', avatar: LuxAvatar, color: 'text-white', borderColor: 'border-white', glow: 'shadow-[0_0_15px_rgba(255,255,255,0.4)]' },
  { name: 'FERRO', role: 'TRACK', avatar: FerroAvatar, color: 'text-blue-400', borderColor: 'border-blue-500', glow: 'shadow-[0_0_15px_rgba(56,189,248,0.4)]' },
];

export const TheLinePanel: React.FC<Props> = ({
  activeStationIndex,
  rugBinCount,
  vaultPings,
  balance,
  conveyorTokens,
  onInspectBot,
}) => {
  const activeStation = STATIONS[activeStationIndex] || STATIONS[0];

  return (
    <div className="jev-panel p-4 relative overflow-hidden flex flex-col justify-between">
      <CyberCornerBrackets />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded bg-yellow-400 animate-pulse" />
          <h3 className="font-mono font-bold tracking-wider text-xs text-yellow-400 uppercase">
            THE LINE
          </h3>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            · INDUSTRIAL QUANT ASSEMBLY PIPELINE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-yellow-950/40 border border-yellow-500/30 text-yellow-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE DISPATCH: <strong className="text-white">{activeStation.name}</strong>
          </span>
        </div>
      </div>

      {/* Assembly Stage */}
      <div className="relative py-1">
        {/* SVG Inter-Agent Laser Pipelines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
          <defs>
            <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#eab308" stopOpacity="1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {/* Animated pulsing data beam between Dev's Quant Core and active pod */}
          <line
            x1="7%"
            y1="22%"
            x2={`${14 + (activeStationIndex + 1) * 12}%`}
            y2="22%"
            stroke="url(#laserBeamGrad)"
            strokeWidth="2"
            className="pipeline-laser"
          />
          {/* Vertical drop beam from active trader down to conveyor belt */}
          <line
            x1={`${14 + (activeStationIndex + 1) * 12}%`}
            y1="38%"
            x2={`${14 + (activeStationIndex + 1) * 12}%`}
            y2="55%"
            stroke="#eab308"
            strokeWidth="2"
            className="pipeline-laser"
          />
        </svg>

        {/* Top Stations Row: Dev's Quant Core + 6 Pod Stations */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 items-center relative z-20">
          {/* Gatekeeper: Dev's Quant Core */}
          <div 
            onClick={() => onInspectBot?.('DEV_CORE')}
            className="flex flex-col items-center p-2 rounded bg-[#0b0e14] border border-yellow-500/40 shadow-[0_0_12px_rgba(234,179,8,0.2)] relative overflow-hidden group cursor-pointer hover:scale-105 hover:border-yellow-400 transition-all"
            title="Click to inspect Dev's Quant Core"
          >
            {/* Vertical scanner laser sweeping down gatekeeper */}
            <div className="absolute inset-x-0 h-0.5 bg-yellow-400/80 shadow-[0_0_8px_rgba(234,179,8,1)] animate-[scanLaserH_2s_ease-in-out_infinite]" />
            <div className="relative">
              <DevQuantCoreDisc size={36} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            </div>
            <span className="text-[10px] font-mono font-bold text-white mt-1">DEV'S CORE</span>
            <span className="text-[8px] font-mono text-yellow-400 tracking-wider">GATEKEEPER</span>
          </div>

          {/* 6 Pod Stations */}
          {STATIONS.map((st, idx) => {
            const AvatarComponent = st.avatar;
            const isActive = activeStationIndex === idx;
            return (
              <div
                key={st.name}
                onClick={() => onInspectBot?.(st.name)}
                className={`flex flex-col items-center p-2 rounded transition-all duration-300 relative cursor-pointer group ${
                  isActive
                    ? `bg-[#131b2a] ${st.borderColor} border-2 ${st.glow} scale-105 z-30`
                    : 'bg-[#0b0e14] border border-yellow-500/10 opacity-75 hover:opacity-100 hover:scale-105'
                }`}
                title={`Click to inspect ${st.name} Telemetry`}
              >
                <div className="relative">
                  <AvatarComponent size={34} isActive={isActive} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
                  )}
                </div>
                <span className={`text-[10px] font-mono font-bold mt-1 ${st.color}`}>
                  {st.name}
                </span>
                <span className="text-[8px] font-mono text-slate-400">
                  {st.role}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1.5 text-[7px] font-mono px-1 rounded bg-yellow-400 text-black font-extrabold shadow-sm">
                    ON TICKET
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Central Conveyor Track with Hazard Stripes & Animated Tokens */}
        <div className="relative my-3 py-3 px-3 bg-[#050608] border-y-2 border-dashed border-yellow-500/50 overflow-hidden rounded shadow-inner">
          {/* Continuous rolling hazard conveyor track */}
          <div className="absolute inset-0 conveyor-track opacity-25 pointer-events-none" />

          {/* Laser Scanner Line traversing left-to-right across track */}
          <div className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.9)] animate-[scanLaserH_4s_ease-in-out_infinite] pointer-events-none z-20" />

          {/* Rotating gears on conveyor edges */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 text-yellow-500/40 text-xs animate-[spin_4s_linear_infinite]">
            ⚙️
          </div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-yellow-500/40 text-xs animate-[spin_4s_linear_infinite]">
            ⚙️
          </div>

          {/* Tokens Traveling Along Conveyor Belt */}
          <div className="relative z-10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1 px-4">
            {conveyorTokens.map((tok, i) => (
              <div
                key={`${tok}-${i}`}
                className="px-2.5 py-1 rounded bg-[#0d131f] border border-yellow-400/40 text-[11px] font-mono font-bold text-yellow-300 whitespace-nowrap shadow-sm hover:scale-110 hover:border-yellow-400 transition-transform flex items-center gap-1.5 bot-bob cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                {tok}
              </div>
            ))}
          </div>

          {/* Center Spinning Dev's Quant Core AI Disc */}
          <div 
            onClick={() => onInspectBot?.('DEV_CORE')}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 opacity-95 scale-85 hover:scale-95 transition-transform drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]"
            title="Inspect Dev's Quant Core"
          >
            <DevQuantCoreDisc size={68} />
          </div>
        </div>

        {/* Diverters: Rug Bin (Left) & The Vault (Right) */}
        <div className="grid grid-cols-2 gap-3 mt-3 relative z-20">
          {/* Left: RUG BIN */}
          <div className="p-3 rounded bg-[#140808] border-2 border-rose-500/50 relative overflow-hidden flex items-center justify-between shadow-[0_0_12px_rgba(244,63,94,0.2)]">
            <div className="flex items-center gap-2.5">
              <span className="text-rose-400 text-2xl animate-bounce">🗑️</span>
              <div>
                <div className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                  RUG BIN
                  <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-500/30">
                    DEV'S FILTERS
                  </span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                  REJECTED BY GATES
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-mono font-black text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                {rugBinCount}+
              </span>
              <div className="text-[8px] font-mono text-rose-500 uppercase tracking-widest">
                SCAMS FILTERED
              </div>
            </div>
          </div>

          {/* Right: THE VAULT */}
          <div className="p-3 rounded bg-[#171408] border-2 border-yellow-400 relative overflow-hidden flex items-center justify-between shadow-[0_0_20px_rgba(234,179,8,0.25)]">
            {/* Golden glowing corner pulse */}
            <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-400/20 blur-md pointer-events-none" />

            <div className="flex items-center gap-2.5">
              {/* Spinning Vault Door Wheel */}
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-yellow-400 flex items-center justify-center animate-[spin_8s_linear_infinite] shrink-0">
                <span className="text-yellow-400 text-xs">🪙</span>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-yellow-300 uppercase tracking-wide flex items-center gap-1.5">
                  THE VAULT
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                {/* Floating Real Vault Pings */}
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-2 mt-0.5">
                  {vaultPings[0] && (
                    <span className="font-extrabold text-emerald-300 animate-pulse drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]">
                      {vaultPings[0]}
                    </span>
                  )}
                  {vaultPings[1] && (
                    <span className="text-slate-400 text-[9px]">{vaultPings[1]}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-mono font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                ${(balance ?? 0).toFixed(2)}
              </span>
              <div className="text-[8px] font-mono text-yellow-500 uppercase tracking-widest">
                REAL COMPOUND
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TheLinePanel;
