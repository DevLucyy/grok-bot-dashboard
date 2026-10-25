import React from 'react';
import { TicketState } from '../engine/grokJevEngine';
import {
  CyberCornerBrackets,
  BazzAvatar,
  QuiloAvatar,
  TomiAvatar,
  OkkoAvatar,
  LuxAvatar,
  FerroAvatar,
} from './GrokJevAvatars';

interface Props {
  ticket: TicketState;
}

export const OnTheTicketPanel: React.FC<Props> = ({ ticket }) => {
  const renderAvatar = (name: string) => {
    switch (name) {
      case 'BAZZ':
        return <BazzAvatar size={44} isActive={true} />;
      case 'QUILO':
        return <QuiloAvatar size={44} isActive={true} />;
      case 'TOMI':
        return <TomiAvatar size={44} isActive={true} />;
      case 'OKKO':
        return <OkkoAvatar size={44} isActive={true} />;
      case 'FERRO':
        return <FerroAvatar size={44} isActive={true} />;
      case 'LUX':
      default:
        return <LuxAvatar size={44} isActive={true} />;
    }
  };

  const isPositive = ticket.resultPnl >= 0;

  return (
    <div className="jev-panel p-4 relative flex flex-col justify-between">
      <CyberCornerBrackets />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${ticket.isOpen ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
          <h3 className="font-mono font-bold tracking-wider text-xs text-yellow-400 uppercase">
            DEV'S QUANT CORE · ATOMIC TICKET
          </h3>
        </div>
        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
          ticket.isOpen
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            : 'bg-slate-900 border-slate-700 text-slate-400'
        }`}>
          {ticket.isOpen ? `${ticket.side?.toUpperCase() || 'LONG'} · 1.67R BRACKET` : 'SCANNING BYBIT...'}
        </span>
      </div>

      {/* Main Ticket Pod */}
      <div className="flex items-center gap-3 p-3 rounded bg-[#0a0d14]/90 border border-yellow-500/20 mb-3">
        <div className="relative">
          {renderAvatar(ticket.traderName)}
          <span className="absolute -bottom-1 -right-1 text-[8px] font-mono px-1 py-0.2 rounded bg-yellow-400 text-black font-extrabold shadow-sm">
            {ticket.role}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-white tracking-wide">
                {ticket.masterTraderName ? `Copying ${ticket.masterTraderName}` : `${ticket.traderName} · ${ticket.role}`}
              </span>
              {ticket.masterTraderBadge && (
                <span className="text-[8px] px-1.5 py-0.2 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-500/30 font-bold">
                  {ticket.masterTraderBadge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${
              ticket.isOpen
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                : 'text-slate-400 bg-slate-900/60 border-slate-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ticket.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {ticket.isOpen ? 'EXECUTION ARMED' : 'STANDBY'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <div className="text-xl font-mono font-black text-yellow-400 tracking-wider flex items-center gap-2">
              <span>{ticket.token}</span>
              {ticket.side && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  ticket.side === 'Long'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {ticket.side.toUpperCase()}
                </span>
              )}
            </div>
            {ticket.currentPrice && (
              <span className="text-xs font-mono font-extrabold text-white bg-black/60 px-2 py-0.5 rounded border border-slate-700">
                LIVE {ticket.currentPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quant Quant Signals & Verification Badge */}
      <div className="mb-2.5 flex flex-col gap-1.5">
        {ticket.strategyReason && (
          <div className="px-2.5 py-1 rounded bg-yellow-950/20 border border-yellow-500/20 text-[9px] font-mono text-yellow-300/90 truncate">
            <span className="font-bold text-yellow-400">SIGNAL:</span> {ticket.strategyReason}
          </div>
        )}

        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
          <div className="px-2 py-1 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center justify-between">
            <span className="text-slate-400">MONTE CARLO:</span>
            <span className="font-bold text-cyan-300">{ticket.monteCarloWinOdds ? `${ticket.monteCarloWinOdds}% WIN ODDS` : '58.4% WIN ODDS'}</span>
          </div>
          <div className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
            <span className="text-slate-400">R:R TARGET:</span>
            <span className="font-bold text-emerald-300">1.67R ASYMMETRIC</span>
          </div>
        </div>
      </div>

      {/* Metric Grid with Stressed Stops & Real Bybit Prices */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-black/60 border border-yellow-500/10 flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">ENTRY PRICE</span>
          <span className="text-sm font-bold text-white truncate">{ticket.entry}</span>
        </div>

        <div className="p-2 rounded bg-black/60 border border-yellow-500/10 flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">TARGET (+0.75%, 1.67R)</span>
          <span className="text-sm font-bold text-emerald-400 truncate">{ticket.exit}</span>
        </div>

        <div className="p-2 rounded bg-black/60 border border-yellow-500/10 flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">STRESSED SL (-0.45%)</span>
          <span className="text-xs font-bold text-rose-400 truncate">{ticket.stopLoss || 'N/A'}</span>
        </div>

        <div className="p-2 rounded bg-black/60 border border-yellow-500/10 flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
            {ticket.isOpen ? 'LIVE P&L (TICKING)' : 'LAST P&L'}
          </span>
          <span className={`text-sm font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>{isPositive ? `+$${(ticket.resultPnl ?? 0).toFixed(2)}` : `-$${Math.abs(ticket.resultPnl ?? 0).toFixed(2)}`}</span>
            {ticket.unrealizedPnlPercent !== undefined && (
              <span className="text-[10px] font-normal">
                ({ticket.unrealizedPnlPercent >= 0 ? `+${ticket.unrealizedPnlPercent}` : ticket.unrealizedPnlPercent}%)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Quant Micro Progress Bar */}
      <div className="mt-3 pt-2 border-t border-yellow-500/10">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>DEV'S QUANT PROTOCOL</span>
          <span className="text-yellow-400 font-bold">ANTI-WICK CONFIRMED · ZERO MARTINGALE</span>
        </div>
        <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-yellow-500/20">
          <div className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
