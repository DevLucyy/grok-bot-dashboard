import React from 'react';
import { TraderStats } from '../engine/grokJevEngine';
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
  traders: TraderStats[];
}

export const WhosCarryingPanel: React.FC<Props> = ({ traders }) => {
  const getAvatar = (name: string) => {
    switch (name) {
      case 'BAZZ':
        return <BazzAvatar size={30} />;
      case 'QUILO':
        return <QuiloAvatar size={30} />;
      case 'TOMI':
        return <TomiAvatar size={30} />;
      case 'OKKO':
        return <OkkoAvatar size={30} />;
      case 'FERRO':
        return <FerroAvatar size={30} />;
      case 'LUX':
      default:
        return <LuxAvatar size={30} />;
    }
  };

  // Sort traders by PnL descending
  const sorted = [...traders].sort((a, b) => b.pnl - a.pnl);
  const maxPnl = Math.max(0.1, ...sorted.map(t => Math.max(0.1, t.pnl)));

  return (
    <div className="jev-panel p-4 relative flex flex-col justify-between">
      <CyberCornerBrackets />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold text-xs">👑</span>
          <h3 className="font-mono font-bold tracking-wider text-xs text-yellow-400 uppercase">
            WHO'S CARRYING
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          6 TRADERS · REAL PNL
        </span>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2 flex-1">
        {sorted.map((trader, idx) => {
          const isTop = idx === 0;
          const isOnNotice = trader.status === 'ON NOTICE' || trader.consecutiveLosses >= 2;
          const barWidth = trader.pnl > 0 ? Math.min(100, Math.max(8, (trader.pnl / maxPnl) * 100)) : 6;

          return (
            <div
              key={trader.id}
              className={`p-2 rounded bg-[#0a0d14]/90 border transition-all ${
                isTop
                  ? 'border-yellow-500/40 bg-yellow-950/15 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                  : isOnNotice
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : 'border-yellow-500/10 hover:border-yellow-500/25'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] font-extrabold w-4 text-center ${
                      isTop ? 'text-yellow-400' : 'text-slate-500'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  {getAvatar(trader.name)}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-white tracking-wide">
                        {trader.name}
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black border border-white/10 text-slate-400">
                        {trader.role}
                      </span>
                      {isOnNotice && (
                        <span className="text-[8px] font-mono font-bold text-rose-400 bg-rose-950/80 px-1 rounded border border-rose-500/40 animate-pulse">
                          ON NOTICE
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-mono font-bold ${
                      trader.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {trader.pnl >= 0
                      ? `+$${trader.pnl.toFixed(2)}`
                      : `-$${Math.abs(trader.pnl).toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: isOnNotice ? '#f43f5e' : trader.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
