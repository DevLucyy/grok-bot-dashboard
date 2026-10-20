import { Users, Activity } from 'lucide-react';
import { Trader } from '../types';

interface TraderBenchProps {
  traders: Trader[];
  activeTraderId: string;
  onSelectTrader: (id: string) => void;
}

export const TraderBench = ({
  traders,
  activeTraderId,
  onSelectTrader
}: TraderBenchProps) => {
  return (
    <div className="cyber-card p-4 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3.5">
        <div className="text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>Operator Roster & Bench</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-400" />
          Real-Time Leaderboard · Click to Switch Operator
        </span>
      </div>

      {/* Grid of 6 Trader Cards with Big Animated Avatars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
        {traders.map((trader: Trader) => {
          const isActive = trader.id === activeTraderId;
          const isFired = trader.status === 'FIRED';

          return (
            <div
              key={trader.id}
              onClick={() => onSelectTrader(trader.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                isActive
                  ? 'bg-gradient-to-b from-[#111c38] to-[#0a1024] border-cyan-500/60 shadow-[0_0_25px_-4px_rgba(6,182,212,0.35)] scale-[1.02]'
                  : isFired
                  ? 'bg-slate-950/40 border-rose-900/40 opacity-70 hover:opacity-90'
                  : 'bg-[#0b1022]/70 border-slate-800/80 hover:border-slate-600 hover:shadow-lg'
              }`}
            >
              {/* Top row: Rank + Status Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-0.5">
                  #{trader.rank}
                </span>

                <span
                  className={`text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider flex items-center gap-1 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/50'
                      : isFired
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />}
                  {trader.status}
                </span>
              </div>

              {/* Large Animated Avatar */}
              <div className="flex flex-col items-center my-2 text-center">
                <div className="relative mb-2">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${trader.avatarColor} p-0.5 flex items-center justify-center font-bold text-white text-base shadow-lg border border-white/10 font-display transition-transform group-hover:scale-105 ${
                      isFired ? 'grayscale opacity-60' : ''
                    } ${isActive ? 'ring-2 ring-cyan-400/80 ring-offset-2 ring-offset-slate-950' : ''}`}
                  >
                    <div className="w-full h-full bg-[#080d1a]/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center relative overflow-hidden">
                      {isActive && (
                        <div className="absolute inset-0 bg-cyan-400/10 rounded-full animate-ping pointer-events-none" />
                      )}
                      <span className="relative z-10">{trader.initials}</span>
                    </div>
                  </div>

                  {/* Active radar dot */}
                  {isActive && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse flex items-center justify-center shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  )}
                </div>

                <div
                  className={`text-xs font-bold font-mono truncate max-w-full ${
                    isFired ? 'line-through text-slate-500' : 'text-white'
                  }`}
                >
                  {trader.handle}
                </div>

                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  +{trader.sevenDayReturn}% 7d · <span className="text-cyan-300 font-semibold">{trader.winRate}%</span> WR
                </div>

                {/* Last Six Arcade W/L Pills */}
                <div className="flex items-center gap-1 mt-2">
                  {trader.lastSix.map((res: 'W' | 'L', i: number) => (
                    <span
                      key={i}
                      className={`w-2 h-3 rounded-[2px] transition-all text-[8px] font-mono font-bold flex items-center justify-center ${
                        res === 'W'
                          ? 'bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.7)] text-emerald-950'
                          : 'bg-rose-500/90 shadow-[0_0_6px_rgba(244,63,94,0.7)] text-white'
                      }`}
                    >
                      {res}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom: Cumulative PnL with them */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 text-center">
                {trader.pnlWithUs > 0 ? (
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    Desk: +${trader.pnlWithUs.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">
                    On Standby
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
