import React from 'react';
import {
  CyberCornerBrackets,
  BazzAvatar,
  QuiloAvatar,
  TomiAvatar,
  OkkoAvatar,
  LuxAvatar,
  FerroAvatar,
  JevAvatar,
  GrokCoreDisc,
} from './GrokJevAvatars';

interface Props {
  activeStationIndex: number;
  rugBinCount: number;
  vaultPings: string[];
  balance: number;
  conveyorTokens: string[];
}

const STATIONS = [
  { name: 'QUILO', role: 'ARB', avatar: QuiloAvatar, color: 'text-pink-400', borderColor: 'border-pink-500/50' },
  { name: 'BAZZ', role: 'SNIPE', avatar: BazzAvatar, color: 'text-cyan-400', borderColor: 'border-cyan-500/50' },
  { name: 'TOMI', role: 'EXIT', avatar: TomiAvatar, color: 'text-rose-400', borderColor: 'border-rose-500/50' },
  { name: 'OKKO', role: 'LADDER', avatar: OkkoAvatar, color: 'text-purple-400', borderColor: 'border-purple-500/50' },
  { name: 'LUX', role: 'BOOK', avatar: LuxAvatar, color: 'text-white', borderColor: 'border-white/50' },
  { name: 'FERRO', role: 'TRACK', avatar: FerroAvatar, color: 'text-blue-400', borderColor: 'border-blue-500/50' },
];

export const TheLinePanel: React.FC<Props> = ({
  activeStationIndex,
  rugBinCount,
  vaultPings,
  balance,
  conveyorTokens,
}) => {
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
            · ASSEMBLY CONVEYOR
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-950/40 border border-yellow-500/30 text-yellow-400">
            AUTO-DISPATCH
          </span>
        </div>
      </div>

      {/* Assembly Stage */}
      <div className="relative py-2 px-1">
        {/* Trader Stations & Jev Gate */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 items-center">
          {/* Gatekeeper: JEV */}
          <div className="flex flex-col items-center p-1.5 rounded bg-[#0b0e14] border border-slate-700/60 shadow-inner">
            <div className="relative">
              <JevAvatar size={34} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <span className="text-[9px] font-mono font-bold text-white mt-1">JEV</span>
            <span className="text-[7px] font-mono text-cyan-400 tracking-wider">GATE</span>
          </div>

          {/* 6 Pod Stations */}
          {STATIONS.map((st, idx) => {
            const AvatarComponent = st.avatar;
            const isActive = activeStationIndex === idx;
            return (
              <div
                key={st.name}
                className={`flex flex-col items-center p-1.5 rounded transition-all duration-300 ${
                  isActive
                    ? `bg-[#131b2a] ${st.borderColor} border-2 shadow-[0_0_12px_rgba(234,179,8,0.3)] scale-105`
                    : 'bg-[#0b0e14] border border-yellow-500/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="relative">
                  <AvatarComponent size={32} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                  )}
                </div>
                <span className={`text-[9px] font-mono font-bold mt-1 ${st.color}`}>{st.name}</span>
                <span className="text-[7px] font-mono text-slate-400">{st.role}</span>
              </div>
            );
          })}
        </div>

        {/* Central Conveyor Track with Grok Disc in Center */}
        <div className="relative my-2 py-3 px-2 bg-[#050608] border-y border-dashed border-yellow-500/40 overflow-hidden rounded">
          {/* Moving hazard track pattern background */}
          <div className="absolute inset-0 conveyor-track opacity-15 pointer-events-none" />

          {/* Tokens traveling along conveyor */}
          <div className="relative z-10 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
            {conveyorTokens.map((tok, i) => (
              <div
                key={`${tok}-${i}`}
                className="px-2 py-1 rounded bg-[#0e1420] border border-yellow-500/30 text-[10px] font-mono font-bold text-yellow-300 whitespace-nowrap shadow-sm hover:scale-110 transition-transform"
              >
                {tok}
              </div>
            ))}
          </div>

          {/* Center Grok Engine Overlay Floating */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 opacity-80 scale-75">
            <GrokCoreDisc size={64} />
          </div>
        </div>

        {/* Diverters: Rug Bin (Left) & The Vault (Right) */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {/* Left: RUG BIN */}
          <div className="p-2.5 rounded bg-[#120a0a] border border-rose-500/40 relative overflow-hidden flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-rose-400 text-lg">🗑️</span>
              <div>
                <div className="text-[10px] font-mono font-bold text-rose-300 uppercase tracking-wide">
                  RUG BIN
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  KILLED BY JEV GATE
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-mono font-black text-rose-400">
                {rugBinCount}+
              </span>
              <div className="text-[8px] font-mono text-rose-500 uppercase tracking-widest">
                REJECTED
              </div>
            </div>
          </div>

          {/* Right: THE VAULT */}
          <div className="p-2.5 rounded bg-[#141208] border border-yellow-500/50 relative overflow-hidden flex items-center justify-between shadow-[0_0_12px_rgba(234,179,8,0.15)]">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">🏦</span>
              <div>
                <div className="text-[10px] font-mono font-bold text-yellow-300 uppercase tracking-wide flex items-center gap-1.5">
                  THE VAULT
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                  {vaultPings[0] && (
                    <span className="animate-pulse font-bold">{vaultPings[0]}</span>
                  )}
                  {vaultPings[1] && (
                    <span className="text-slate-500 text-[8px]">{vaultPings[1]}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-mono font-black text-emerald-400">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="text-[8px] font-mono text-yellow-500 uppercase tracking-widest">
                COMPOUNDED
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
