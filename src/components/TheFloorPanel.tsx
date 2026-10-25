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
  DevQuantCoreDisc,
} from './GrokJevAvatars';

interface Props {
  traders: TraderStats[];
  onInspectBot?: (name: string) => void;
}

export const TheFloorPanel: React.FC<Props> = ({ traders, onInspectBot }) => {
  const getAvatar = (name: string, isActive: boolean) => {
    switch (name) {
      case 'BAZZ':
        return <BazzAvatar size={34} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'QUILO':
        return <QuiloAvatar size={34} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'TOMI':
        return <TomiAvatar size={34} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'OKKO':
        return <OkkoAvatar size={34} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'FERRO':
        return <FerroAvatar size={34} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'LUX':
      default:
        return <LuxAvatar size={34} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
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

      {/* Dev's Quant Core Supervisor Bar */}
      <div 
        onClick={() => onInspectBot?.('DEV_CORE')}
        className="flex items-center justify-between p-2 rounded bg-[#0b0f19] border border-yellow-500/30 mb-3 text-xs font-mono cursor-pointer hover:border-yellow-400 hover:bg-yellow-950/20 transition-all group"
        title="Click to inspect Dev's Quant Core"
      >
        <div className="flex items-center gap-2">
          <DevQuantCoreDisc size={28} />
          <div>
            <span className="text-white font-bold text-[11px] group-hover:text-yellow-400 transition-colors">DEV'S QUANT CORE</span>
            <span className="text-slate-400 text-[9px] ml-1.5">LEAD DISPATCHER & GATES</span>
          </div>
        </div>
        <span className="text-[9px] font-mono text-yellow-400 bg-yellow-950/50 border border-yellow-500/30 px-2 py-0.5 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          MIRRORING BYBIT LEADERS
        </span>
      </div>

      {/* 6 Desks / Seats with Alive Avatars & Oscilloscopes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
        {traders.map((trader) => {
          const isOnNotice = trader.status === 'ON NOTICE' || trader.consecutiveLosses >= 2;
          const isActive = trader.consecutiveLosses === 0;
          const master = BYBIT_MASTER_TRADERS.find((m) => m.squadBot === trader.name);

          return (
            <div
              key={trader.id}
              onClick={() => onInspectBot?.(trader.name)}
              className={`p-2.5 rounded bg-[#0a0d14]/90 border transition-all flex flex-col justify-between cursor-pointer hover:scale-102 ${
                isOnNotice
                  ? 'border-rose-500/60 bg-rose-950/20 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                  : 'border-yellow-500/15 hover:border-yellow-500/40 shadow-sm'
              }`}
              title={`Click to inspect ${trader.name} / ${master?.name}`}
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
                {isOnNotice && (
                  <span className="text-[8px] font-mono font-bold text-rose-400 bg-rose-950/80 px-1 py-0.2 rounded border border-rose-500/40 animate-pulse">
                    LOSS: {trader.consecutiveLosses}
                  </span>
                )}
              </div>

              {/* Bybit Live Master Metrics */}
              {master && (
                <div className="grid grid-cols-2 gap-1 py-1 px-1.5 mb-1.5 rounded bg-black/40 border border-white/5 text-[9px] font-mono">
                  <div>
                    <span className="text-slate-400 text-[8px]">ROI: </span>
                    <span className="text-emerald-400 font-bold">{master.roi7d}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[8px]">WIN: </span>
                    <span className="text-cyan-400 font-bold">{master.winRate}</span>
                  </div>
                </div>
              )}

              {/* Oscilloscope Bars */}
              <div className="space-y-1 mt-auto">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-400">PNL</span>
                  <span
                    className={`font-bold ${
                      trader.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {trader.pnl >= 0 ? `+$${trader.pnl.toFixed(2)}` : `-$${Math.abs(trader.pnl).toFixed(2)}`}
                  </span>
                </div>
                {/* Micro Oscilloscope graphic */}
                <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden flex items-center gap-0.5 px-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      trader.pnl >= 0 ? 'bg-emerald-400' : 'bg-rose-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(10, Math.abs(trader.pnl) * 20))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TheFloorPanel;
