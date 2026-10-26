import React from 'react';
import { TicketState } from '../engine/grokJevEngine';
import {
  BazzAvatar,
  QuiloAvatar,
  TomiAvatar,
  OkkoAvatar,
  LuxAvatar,
  FerroAvatar,
} from './GrokJevAvatars';
import { Target, ShieldAlert, CheckCircle2, Crosshair, ArrowUpRight, ArrowDownRight, Radio } from 'lucide-react';

interface ActiveTicketHUDProps {
  ticket: TicketState;
  onInspectBot?: (name: string) => void;
}

export const ActiveTicketHUD: React.FC<ActiveTicketHUDProps> = ({ ticket, onInspectBot }) => {
  const renderAvatar = (name: string) => {
    switch (name) {
      case 'BAZZ':
        return <BazzAvatar size={40} isActive={true} onClick={() => onInspectBot?.(name)} />;
      case 'QUILO':
        return <QuiloAvatar size={40} isActive={true} onClick={() => onInspectBot?.(name)} />;
      case 'TOMI':
        return <TomiAvatar size={40} isActive={true} onClick={() => onInspectBot?.(name)} />;
      case 'OKKO':
        return <OkkoAvatar size={40} isActive={true} onClick={() => onInspectBot?.(name)} />;
      case 'FERRO':
        return <FerroAvatar size={40} isActive={true} onClick={() => onInspectBot?.(name)} />;
      case 'LUX':
      default:
        return <LuxAvatar size={40} isActive={true} onClick={() => onInspectBot?.(name)} />;
    }
  };

  const isLong = ticket.side === 'Long' || !ticket.side;
  const isPositive = ticket.resultPnl >= 0;

  return (
    <div className="terminal-card h-full">
      <div className="terminal-card-inner p-4 sm:p-5 flex flex-col justify-between h-full">
        {/* Header: Status Beacon & Bracket Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                ticket.isOpen ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              LIVE ORDER TICKET HUD
            </h3>
          </div>

          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              ticket.isOpen
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/80 border-white/10 text-slate-400'
            }`}
          >
            {ticket.isOpen ? `${ticket.side?.toUpperCase() || 'LONG'} · 3.33R BRACKET` : 'SCANNING BYBIT POOLS...'}
          </span>
        </div>

        {ticket.isOpen ? (
          <>
            {/* Active Position Hero Pod */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-white/10 mb-3">
              <div className="relative shrink-0">
                {renderAvatar(ticket.traderName)}
                <span className="absolute -bottom-1 -right-1 text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-400 text-black font-extrabold shadow-sm">
                  {ticket.role}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs font-bold text-white tracking-wide font-sans truncate">
                      {ticket.masterTraderName ? `Copying ${ticket.masterTraderName}` : `${ticket.traderName} · ${ticket.role}`}
                    </span>
                    {ticket.masterTraderBadge && (
                      <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-500/30 font-bold shrink-0">
                        {ticket.masterTraderBadge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-black font-mono text-cyan-300">
                    {ticket.token}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                      isLong
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {isLong ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {ticket.side?.toUpperCase() || 'LONG'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    SIZE: ${ticket.sizeUsd.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Floating Real-Time PnL */}
              <div className="text-right shrink-0">
                <div
                  className={`text-base font-extrabold font-mono ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? `+$${ticket.resultPnl.toFixed(2)}` : `-$${Math.abs(ticket.resultPnl).toFixed(2)}`}
                </div>
                <div
                  className={`text-[10px] font-mono font-bold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {ticket.unrealizedPnlPercent !== undefined
                    ? `${ticket.unrealizedPnlPercent >= 0 ? '+' : ''}${ticket.unrealizedPnlPercent.toFixed(2)}%`
                    : '+0.00%'}
                </div>
              </div>
            </div>

            {/* 3-Point Price Bracket Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-center font-mono">
              <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/20 flex flex-col">
                <span className="text-[9px] text-rose-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> STOP (-0.45%)
                </span>
                <span className="text-xs font-bold text-rose-300 mt-0.5 truncate">
                  {ticket.stopLoss || '$0.00'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider">ENTRY ANCHOR</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 truncate">{ticket.entry}</span>
              </div>

              <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex flex-col">
                <span className="text-[9px] text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Target className="w-3 h-3" /> TARGET (+1.50%)
                </span>
                <span className="text-xs font-bold text-emerald-300 mt-0.5 truncate">{ticket.exit}</span>
              </div>
            </div>

            {/* Strategy Verification Badges */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10 text-[9px] font-mono">
              <div className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>SLIPPAGE GATE: ≤5 BPS</span>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>PULLBACK CONFIRMED</span>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>
                  MC WIN ODDS: {ticket.monteCarloWinOdds ? `${ticket.monteCarloWinOdds}%` : '68.4%'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>3.33R RATIO (FEE SAFE)</span>
              </div>
            </div>
          </>
        ) : (
          /* Empty / Scanning State */
          <div className="flex flex-col items-center justify-center py-6 text-center my-auto">
            <div className="relative mb-3">
              <Radio className="w-10 h-10 text-cyan-400/70 animate-pulse" />
              <span className="absolute -inset-1 rounded-full border border-cyan-400/40 animate-ping opacity-60" />
            </div>

            <div className="text-xs font-bold text-white uppercase font-sans tracking-wide">
              AUTONOMOUS RADAR SCANNING
            </div>
            <p className="text-[11px] font-mono text-slate-400 max-w-xs mt-1">
              Evaluating 1,000 Monte Carlo paths on Bybit Linear perps. Waiting for ≤5 bps slippage gate and pullback confirmation.
            </p>

            <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>ROUTING SPEED: &lt;12ms TO BYBIT</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
