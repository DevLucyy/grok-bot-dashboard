import React from 'react';
import { ArrowUpRight, ArrowDownRight, Flame, UserCheck } from 'lucide-react';
import { Trader, MarketCategory } from '../types';

interface BalanceCardsProps {
  balance: number;
  startingBalance: number;
  totalPnl: number;
  pnlPercent: number;
  pnlMultiplier: number;
  activeTrader: Trader;
  lossesInARow: number;
  firedCount: number;
  onManualFire: () => void;
  marketCategory?: MarketCategory;
}

export const BalanceCards: React.FC<BalanceCardsProps> = ({
  balance,
  startingBalance,
  totalPnl,
  pnlPercent,
  pnlMultiplier,
  activeTrader,
  lossesInARow,
  firedCount,
  onManualFire,
  marketCategory = 'PROP_FIRM'
}) => {
  const isBybit = marketCategory === 'BYBIT_TESTNET';
  const isPropFirm = marketCategory === 'PROP_FIRM';
  const targetGoal = isBybit ? 45.00 : (isPropFirm ? 53000 : 5739);
  const baseline = isBybit ? 0 : (isPropFirm ? 48000 : 0);
  const progressPercent = Math.min(100, Math.max(0, ((balance - baseline) / Math.max(1, targetGoal - baseline)) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. BALANCE CARD */}
      <div className="cyber-card p-4 rounded-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase">
          <span>{isBybit ? 'Bybit Real-Tick Capital' : (isPropFirm ? 'Topstep Account Balance' : 'Crypto Balance')}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold">
            {isBybit ? '$15 MICRO LIVE' : (isPropFirm ? '$50K CHALLENGE' : '$42 START')}
          </span>
        </div>
        <div className="my-2">
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            started at ${startingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>{isBybit ? '3x Milestone: $45.00' : (isPropFirm ? 'Target: $53,000' : 'Target: $5,739')}</span>
            <span className="text-cyan-400 font-bold">{progressPercent.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. TOTAL P&L CARD */}
      <div className="cyber-card p-4 rounded-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase">
          <span>Net Realized P&L</span>
          {totalPnl >= 0 ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
          )}
        </div>
        <div className="my-2">
          <div className={`text-3xl font-extrabold font-mono tracking-tight flex items-center gap-1 ${
            totalPnl >= 0 ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]' : 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.35)]'
          }`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono border ${
              totalPnl >= 0
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}>
              {totalPnl >= 0 ? '+' : ''}{pnlPercent.toLocaleString()}%
            </span>
            <span className="text-[11px] font-medium text-slate-400 font-mono">
              x{pnlMultiplier.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 font-mono flex justify-between">
          <span>{isPropFirm ? 'Trailing Loss Floor' : 'Compounding'}</span>
          <span className={isPropFirm ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
            {isPropFirm ? '$48,000.00' : '100% Compounding'}
          </span>
        </div>
      </div>

      {/* 3. NOW COPYING / ACTIVE TRADER CARD */}
      <div className="cyber-card p-4 rounded-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            Lead Operator
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
            Recent 6
          </span>
        </div>

        <div className="my-2 flex items-center justify-between gap-2">
          {/* Avatar and handle */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeTrader.avatarColor} p-0.5 flex items-center justify-center font-bold text-white text-base shadow-lg border border-white/10 shrink-0 font-display ring-2 ring-blue-500/50`}>
                <div className="w-full h-full bg-[#080d1a]/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-400/10 rounded-full animate-ping pointer-events-none" />
                  <span className="relative z-10">{activeTrader.initials}</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono leading-tight">
                {activeTrader.handle}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {activeTrader.weeklyRank} · <span className="text-cyan-300 font-semibold">{activeTrader.winRate}%</span> WR
              </div>
            </div>
          </div>

          {/* Last 6 Win/Loss Pills */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              {activeTrader.lastSix.map((res: 'W' | 'L', i: number) => (
                <span
                  key={i}
                  className={`w-2.5 h-4 rounded-sm transition-all ${
                    res === 'W'
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                      : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  }`}
                  title={res === 'W' ? 'Win' : 'Loss'}
                />
              ))}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1.5 font-semibold">
              P&L: +${activeTrader.pnlWithUs.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono flex justify-between">
          <span>{isBybit ? 'Micro Margin Sizing' : (isPropFirm ? 'Sentinel Sizing' : 'Active Allocation')}</span>
          <span className="text-blue-400 font-semibold">{isBybit ? '10x Leverage (~$8.20)' : (isPropFirm ? '0.75% ($375)' : '25% per Trade')}</span>
        </div>
      </div>

      {/* 4. SENTINEL FIRE / 2-LOSS RULE CARD */}
      <div className="cyber-card p-4 rounded-2xl flex flex-col justify-between border-rose-500/20">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            2-Strike Lockout
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
            Consecutive L
          </span>
        </div>

        <div className="my-2 flex items-center justify-between">
          <div>
            <div className="text-xl font-extrabold text-white font-mono tracking-tight">
              2 L in a row
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              → Sentinel desk handover
            </div>
          </div>

          {/* Losses boxes */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold border ${
                  lossesInARow >= 1
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {lossesInARow >= 1 ? 'L' : '-'}
              </span>
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold border ${
                  lossesInARow >= 2
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {lossesInARow >= 2 ? 'L' : '-'}
              </span>
              <span className="text-xs font-mono text-slate-400 ml-1">
                {lossesInARow}/2
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1.5">
              handovers: <span className="text-rose-400 font-bold">{firedCount}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-500 font-mono">Disciplined Handbrake</span>
          <button
            onClick={onManualFire}
            className="text-[10px] font-mono text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/20 transition-all font-semibold"
          >
            Manual Handover
          </button>
        </div>
      </div>
    </div>
  );
};
