import React from 'react';
import { FeedFill } from '../engine/grokJevEngine';
import { CyberCornerBrackets } from './GrokJevAvatars';

interface Props {
  feeds: FeedFill[];
}

export const LineFeedPanel: React.FC<Props> = ({ feeds }) => {
  return (
    <div className="jev-panel p-4 relative flex flex-col justify-between">
      <CyberCornerBrackets />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="font-mono font-bold tracking-wider text-xs text-yellow-400 uppercase">
            LINE FEED
          </h3>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            · LIVE EXECUTION LEDGER
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-slate-400">STATUS:</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            STREAMING FILLS
          </span>
        </div>
      </div>

      {/* Execution Ledger Table */}
      <div className="overflow-x-auto no-scrollbar max-h-64 overflow-y-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-yellow-500/10 text-[9px] uppercase tracking-wider text-slate-500">
              <th className="py-1.5 px-2">TIME</th>
              <th className="py-1.5 px-2">TRADER</th>
              <th className="py-1.5 px-2">ROLE</th>
              <th className="py-1.5 px-2">TOKEN</th>
              <th className="py-1.5 px-2">EXECUTION / NOTES</th>
              <th className="py-1.5 px-2 text-right">PNL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yellow-500/5">
            {feeds.map((fill) => {
              const isWin = !fill.isLoss;
              const isMega = fill.isMega;

              return (
                <tr
                  key={fill.id}
                  className={`transition-colors text-[11px] ${
                    isMega
                      ? 'bg-yellow-500/15 border-l-2 border-yellow-400 text-yellow-300 font-bold shadow-[0_0_12px_rgba(234,179,8,0.2)]'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-2 text-slate-400 text-[10px] whitespace-nowrap">
                    {fill.time}
                  </td>
                  <td className="py-2 px-2 font-bold whitespace-nowrap">
                    <span
                      className={
                        fill.trader === 'BAZZ'
                          ? 'text-cyan-400'
                          : fill.trader === 'QUILO'
                          ? 'text-pink-400'
                          : fill.trader === 'TOMI'
                          ? 'text-rose-400'
                          : fill.trader === 'OKKO'
                          ? 'text-purple-400'
                          : fill.trader === 'FERRO'
                          ? 'text-blue-400'
                          : 'text-white'
                      }
                    >
                      {fill.trader}
                    </span>
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-slate-400">
                      {fill.role}
                    </span>
                  </td>
                  <td className="py-2 px-2 font-bold text-yellow-400/90 whitespace-nowrap">
                    {fill.token}
                  </td>
                  <td
                    className="py-2 px-2 text-slate-300 truncate max-w-xs sm:max-w-md cursor-help"
                    title={fill.desc}
                  >
                    {fill.desc}
                  </td>
                  <td
                    className={`py-2 px-2 text-right font-bold whitespace-nowrap ${
                      isWin ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isWin
                      ? `+$${fill.pnl.toFixed(2)}`
                      : `-$${Math.abs(fill.pnl).toFixed(2)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer bar */}
      <div className="mt-2 pt-2 border-t border-yellow-500/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>SPEED: &lt;12ms ROUTING</span>
        <span className="text-yellow-400/80">TOTAL ORDERS LOGGED: {feeds.length}</span>
      </div>
    </div>
  );
};
