import React from 'react';
import { TraderStats } from '../engine/grokJevEngine';
import { BYBIT_MASTER_TRADERS } from '../engine/bybitMasterTraders';
import {
  BazzAvatar,
  QuiloAvatar,
  TomiAvatar,
  OkkoAvatar,
  LuxAvatar,
  FerroAvatar,
} from './GrokJevAvatars';
import { Users, ExternalLink } from 'lucide-react';

interface TraderRosterBentoProps {
  traders: TraderStats[];
  onInspectBot?: (name: string) => void;
}

export const TraderRosterBento: React.FC<TraderRosterBentoProps> = ({ traders, onInspectBot }) => {
  const getAvatar = (name: string, isActive: boolean) => {
    switch (name) {
      case 'BAZZ':
        return <BazzAvatar size={38} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'QUILO':
        return <QuiloAvatar size={38} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'TOMI':
        return <TomiAvatar size={38} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'OKKO':
        return <OkkoAvatar size={38} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'FERRO':
        return <FerroAvatar size={38} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
      case 'LUX':
      default:
        return <LuxAvatar size={38} isActive={isActive} onClick={() => onInspectBot?.(name)} />;
    }
  };

  return (
    <div className="terminal-card h-full">
      <div className="terminal-card-inner p-4 sm:p-5 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
              THE TRADING FLOOR · 6 SQUAD AGENTS
            </h3>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              · BYBIT MASTER COPY SEATS
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            2-STRIKE ROTATION ACTIVE
          </span>
        </div>

        {/* 6-Card Responsive Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 flex-1">
          {traders.map((trader) => {
            const master = BYBIT_MASTER_TRADERS.find((m) => m.squadBot === trader.name);
            const isBenched = (trader.consecutiveLosses ?? 0) >= 2;
            const isWinning = trader.pnl >= 0;

            return (
              <div
                key={trader.id}
                onClick={() => onInspectBot?.(trader.name)}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.98] ${
                  isBenched
                    ? 'bg-rose-950/20 border-rose-500/20 opacity-70 hover:opacity-100 hover:border-rose-500/40'
                    : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                {/* Top: Avatar, Name & PnL */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative shrink-0">
                      {getAvatar(trader.name, !isBenched)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold font-sans ${trader.textColor}`}>
                          {trader.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/80 border border-white/10 text-slate-300">
                          {trader.role}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                        {master?.name || 'Bybit Leader'}
                      </div>
                    </div>
                  </div>

                  {/* PnL Pill */}
                  <div className="text-right">
                    <div
                      className={`text-xs font-bold font-mono ${
                        isWinning ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isWinning ? `+$${trader.pnl.toFixed(2)}` : `-$${Math.abs(trader.pnl).toFixed(2)}`}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400">
                      {isBenched ? 'BENCHED' : 'IN PLAY'}
                    </div>
                  </div>
                </div>

                {/* Middle: Master Trader Stats */}
                {master && (
                  <div className="grid grid-cols-2 gap-1.5 my-2.5 p-1.5 rounded-lg bg-black/50 border border-white/5 text-[9px] font-mono">
                    <div>
                      <span className="text-slate-400">7D ROI:</span>{' '}
                      <span className="text-emerald-400 font-bold">{master.roi7d}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">WIN:</span>{' '}
                      <span className="text-cyan-300 font-bold">{master.winRate}</span>
                    </div>
                  </div>
                )}

                {/* Bottom: Status & Inspect Hint */}
                <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-white/5">
                  <span
                    className={`font-semibold ${
                      isBenched ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  >
                    {isBenched ? '2 LOSSES (COOLDOWN)' : 'READY ON SIGNAL'}
                  </span>
                  <span className="text-slate-400 group-hover:text-cyan-300 flex items-center gap-0.5 transition-colors">
                    <span>INSPECT</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>RULE: 2 CONSECUTIVE LOSSES = MANDATORY BENCH & SEAT ROTATION</span>
          <span className="text-emerald-400 font-bold">100% NON-CUSTODIAL EXECUTION</span>
        </div>
      </div>
    </div>
  );
};
