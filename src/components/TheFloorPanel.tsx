import React from 'react';
import { TraderStats } from '../engine/grokJevEngine';
import { BYBIT_MASTER_TRADERS } from '../engine/bybitMasterTraders';
import {
  CyberCornerBrackets,
  BazzAvatar,
  QuiloAvatar,
  TomiAvatar,
  OkkoAvatar,
  LuxAvatar,
  FerroAvatar,
  JevAvatar,
} from './GrokJevAvatars';

interface Props {
  traders: TraderStats[];
}

export const TheFloorPanel: React.FC<Props> = ({ traders }) => {
  const getAvatar = (name: string, isActive: boolean) => {
    switch (name) {
      case 'BAZZ':
        return <BazzAvatar size={34} isActive={isActive} />;
      case 'QUILO':
        return <QuiloAvatar size={34} isActive={isActive} />;
      case 'TOMI':
        return <TomiAvatar size={34} isActive={isActive} />;
      case 'OKKO':
        return <OkkoAvatar size={34} isActive={isActive} />;
      case 'FERRO':
        return <FerroAvatar size={34} isActive={isActive} />;
      case 'LUX':
      default:
        return <LuxAvatar size={34} isActive={isActive} />;
    }
  };

  return (
    <div className="jev-panel p-4 relative flex flex-col justify-between">
      <CyberCornerBrackets />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
          <h3 className="font-mono font-bold tracking-wider text-xs text-yellow-400 uppercase">
            THE FLOOR · BYBIT MASTERS
          </h3>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            · 6 COPY SEATS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            WHALE RADAR ACTIVE
          </span>
        </div>
      </div>

      {/* Jev Supervisor bar */}
      <div className="flex items-center justify-between p-2 rounded bg-[#0b0f19] border border-cyan-500/20 mb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <JevAvatar size={26} />
          <div>
            <span className="text-white font-bold text-[11px]">JEV</span>
            <span className="text-slate-400 text-[9px] ml-1.5">LEAD COPY DISPATCHER</span>
          </div>
        </div>
        <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          MIRRORING BYBIT LEADERS
        </span>
      </div>

      {/* 6 Desks / Seats with Alive Avatars & Oscilloscopes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
        {traders.map((trader) => {
          const isOnNotice = trader.status === 'ON NOTICE' || trader.consecutiveLosses >= 2;
          const isActive = trader.consecutiveLosses === 0;
          const master = BYBIT_MASTER_TRADERS.find(m => m.squadBot === trader.name);

          return (
            <div
              key={trader.id}
              className={`p-2.5 rounded bg-[#0a0d14]/90 border transition-all flex flex-col justify-between ${
                isOnNotice
                  ? 'border-rose-500/60 bg-rose-950/20 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                  : 'border-yellow-500/15 hover:border-yellow-500/40 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {getAvatar(trader.name, isActive)}
                  <div>
                    <div className="text-[10px] font-mono font-bold text-white leading-tight truncate">
                      {master ? master.name : trader.name}
                    </div>
                    <div className="text-[8px] font-mono text-yellow-400/90 truncate">
                      {master ? master.badge : trader.role}
                    </div>
                  </div>
                </div>

                {isOnNotice ? (
                  <span className="text-[7px] font-mono font-black px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                    ON NOTICE
                  </span>
                ) : (
                  <span
                    className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-black/60 border border-white/10"
                    style={{ color: trader.color }}
                  >
                    READY
                  </span>
                )}
              </div>

              {/* Dynamic Oscilloscope Neon Waveform */}
              <div className="h-6 w-full bg-black/80 rounded flex items-center px-1 overflow-hidden relative border border-yellow-500/10 my-1">
                <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path
                    d={
                      isOnNotice
                        ? "M 0,12 Q 15,20 30,12 T 60,12 T 90,12 L 100,12"
                        : "M 0,12 Q 10,2 25,12 T 50,12 T 75,2 T 100,12"
                    }
                    fill="none"
                    stroke={isOnNotice ? '#f43f5e' : trader.color}
                    strokeWidth="1.8"
                    className="opacity-90 animate-pulse"
                  />
                </svg>
              </div>

              {/* Trader PnL scaled for real micro-wallet */}
              <div className="mt-1 flex items-center justify-between text-[9px] font-mono pt-1 border-t border-white/5">
                <span className="text-slate-500">REAL P&L</span>
                <span className={`font-bold ${(trader.pnl ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {(trader.pnl ?? 0) >= 0 ? `+$${(trader.pnl ?? 0).toFixed(2)}` : `-$${Math.abs(trader.pnl ?? 0).toFixed(2)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
