import React from 'react';
import { Terminal, Sparkles, Crown } from 'lucide-react';
import { TradeLog } from '../types';

interface CopyFeedProps {
  logs: TradeLog[];
}

export const CopyFeed: React.FC<CopyFeedProps> = ({ logs }) => {
  return (
    <div className="cyber-card p-4 rounded-2xl flex flex-col justify-between h-[360px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span>Hermes & Execution Feed</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
          <span>Neural Telemetry</span>
          <span className="w-3.5 h-3.5 rounded bg-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold text-[8px]">
            ⚡
          </span>
        </div>
      </div>

      {/* Terminal Logs List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 py-2 font-mono text-[11px] leading-relaxed pr-1">
        {logs.map((log: TradeLog) => {
          if (log.type === 'EVOLUTION') {
            return (
              <div
                key={log.id}
                className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 px-2 py-1 rounded-md text-[10px] flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="font-bold text-cyan-400">[EVOLUTION]</span>
                <span className="truncate">{log.message}</span>
              </div>
            );
          }

          if (log.type === 'HERMES') {
            return (
              <div
                key={log.id}
                className="bg-indigo-950/40 border border-indigo-500/30 text-slate-200 px-2 py-1 rounded-md text-[10px] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="font-bold text-amber-400">[HERMES]</span>
                  <span className="truncate">{log.message}</span>
                </div>
                {log.pnlUsd !== undefined && (
                  <span className={`font-bold shrink-0 ${log.isLoss ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {log.pnlUsd >= 0 ? `+$${log.pnlUsd.toFixed(2)}` : `-$${Math.abs(log.pnlUsd).toFixed(2)}`}
                  </span>
                )}
              </div>
            );
          }

          if (log.type === 'FIRE') {
            return (
              <div
                key={log.id}
                className="bg-rose-950/40 border border-rose-500/30 text-rose-300 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 animate-pulse"
              >
                <span className="text-rose-400">[FIRE]</span>
                <span>{log.message}</span>
              </div>
            );
          }

          if (log.type === 'PICK' || log.type === 'SCAN') {
            return (
              <div
                key={log.id}
                className="bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px]"
              >
                <span className="text-indigo-400 font-bold">[{log.type}]</span>{' '}
                <span>{log.message}</span>
              </div>
            );
          }

          if (log.type === 'QUANT') {
            return (
              <div
                key={log.id}
                className="bg-amber-950/30 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px]"
              >
                <span>{log.message}</span>
              </div>
            );
          }

          if (log.type === 'EXIT') {
            return (
              <div
                key={log.id}
                className="flex items-center justify-between text-slate-300 hover:bg-white/[0.02] px-1 py-0.5 rounded transition-colors"
              >
                <div className="truncate pr-2">
                  <span className="text-slate-400 font-semibold">[EXIT]</span>{' '}
                  <span className="text-slate-200">{log.traderHandle}</span> sold{' '}
                  <span className="text-blue-300 font-bold">{log.token}</span>
                </div>
                <div
                  className={`font-bold shrink-0 text-right ${
                    log.isLoss
                      ? 'text-rose-400'
                      : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]'
                  }`}
                >
                  {log.pnlUsd !== undefined && log.pnlUsd >= 0 ? `+$${log.pnlUsd.toFixed(2)}` : `-$${Math.abs(log.pnlUsd || 0).toFixed(2)}`}
                </div>
              </div>
            );
          }

          // Default / COPY
          return (
            <div
              key={log.id}
              className="flex items-center justify-between text-slate-400 hover:bg-white/[0.02] px-1 py-0.5 rounded transition-colors"
            >
              <div className="truncate">
                <span className="text-blue-400 font-semibold">[TRADE]</span>{' '}
                <span className="text-slate-300">{log.traderHandle || 'Bot'}</span> ·{' '}
                <span className="text-blue-300 font-bold">{log.token || 'EXEC'}</span> · {log.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Status Bar */}
      <div className="border-t border-slate-800/80 pt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Desk: Hermes Multi-Agent</span>
        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Neural Feedback Active
        </span>
      </div>
    </div>
  );
};
