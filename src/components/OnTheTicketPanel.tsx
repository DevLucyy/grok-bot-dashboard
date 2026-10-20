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
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="font-mono font-bold tracking-wider text-xs text-yellow-400 uppercase">
            ON THE TICKET
          </h3>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
          IN POSITION
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
            <span className="text-xs font-mono font-bold text-white tracking-wide">
              {ticket.traderName} · {ticket.role}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVE
            </span>
          </div>
          <div className="text-xl font-mono font-black text-yellow-400 tracking-wider">
            {ticket.token}
          </div>
        </div>
      </div>

      {/* Metric Grid with Real Micro-Wallet Values */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-black/60 border border-yellow-500/10 flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">ENTRY</span>
          <span className="text-sm font-bold text-white truncate">{ticket.entry}</span>
        </div>

        <div className="p-2 rounded bg-black/60 border border-yellow-500/10 flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">TARGET / EXIT</span>
          <span className="text-sm font-bold text-white truncate">{ticket.exit}</span>
        </div>

        <div className="p-2 rounded bg-black/60 border border-yellow-500/10 flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">SIZE (25% BANK)</span>
          <span className="text-xs font-bold text-slate-200">
            ${ticket.sizeUsd.toFixed(2)} <span className="text-yellow-400/80">({ticket.sizePercent}%)</span>
          </span>
        </div>

        <div className="p-2 rounded bg-black/60 border border-yellow-500/10 flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">RESULT P&L</span>
          <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? `+$${ticket.resultPnl.toFixed(2)}` : `-$${Math.abs(ticket.resultPnl).toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Micro Progress Bar */}
      <div className="mt-3 pt-2 border-t border-yellow-500/10">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>PIPELINE ROUTING</span>
          <span className="text-yellow-400 font-bold">100% EXECUTED</span>
        </div>
        <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-yellow-500/20">
          <div className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
