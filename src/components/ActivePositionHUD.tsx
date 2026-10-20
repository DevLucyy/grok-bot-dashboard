import React from 'react';
import { LivePosition } from '../types';
import { ArrowUpRight, ArrowDownRight, Target, ShieldAlert, Crosshair, XCircle, Radio, Sparkles } from 'lucide-react';

interface ActivePositionHUDProps {
  position: LivePosition | null;
  onManualClose?: () => void;
  bybitConnected: boolean;
  orderBookImbalance: number;
}

export const ActivePositionHUD: React.FC<ActivePositionHUDProps> = ({
  position,
  onManualClose,
  bybitConnected,
  orderBookImbalance
}) => {
  if (!position) {
    // Scanning state: No open position currently
    return (
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#090d1e] via-[#0b1226] to-[#090d1e] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden shrink-0">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="absolute inset-0 bg-cyan-400/10 rounded-full animate-ping pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                BYBIT REAL-TICK RADAR ACTIVE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% LIVE FEED
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Scanning Order Book Depth for A+ Confluence</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-300 font-semibold">
                L2 Skew: {(orderBookImbalance * 100).toFixed(0)}% {orderBookImbalance >= 0 ? 'Bid Skew' : 'Ask Skew'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
            <span className={`w-2 h-2 rounded-full ${bybitConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{bybitConnected ? 'WebSocket Live' : 'Connecting'}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>Awaiting Setup Touch</span>
          </div>
        </div>
      </div>
    );
  }

  // Active Position Open State
  const isLong = position.action === 'BUY';
  const isProfit = position.unrealizedPnlUsd >= 0;

  // Calculate percentage of progress between Stop Loss and Take Profit
  const totalRange = Math.abs(position.takeProfitPrice - position.stopLossPrice);
  const currentDiff = isLong
    ? position.currentPrice - position.stopLossPrice
    : position.stopLossPrice - position.currentPrice;
  const progressPercent = Math.min(100, Math.max(0, (currentDiff / Math.max(1, totalRange)) * 100));

  return (
    <div className={`p-4 md:p-5 rounded-2xl border transition-all relative overflow-hidden shadow-2xl ${
      isProfit
        ? 'bg-gradient-to-b from-[#08181a] via-[#061114] to-[#04090b] border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.15)]'
        : 'bg-gradient-to-b from-[#1c0c11] via-[#12070b] to-[#080305] border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.15)]'
    }`}>
      {/* Background ambient sweep */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${isProfit ? 'emerald' : 'rose'}-400 to-transparent animate-pulse`} />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Position Identity & Live P&L */}
        <div className="flex items-center gap-3.5">
          {/* Action Badge */}
          <div className={`w-14 h-14 rounded-2xl p-0.5 shadow-lg flex items-center justify-center relative overflow-hidden shrink-0 ${
            isLong
              ? 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/30'
              : 'bg-gradient-to-br from-rose-500 to-red-700 shadow-rose-500/30'
          }`}>
            <div className="w-full h-full bg-[#050b0f] rounded-[14px] flex flex-col items-center justify-center">
              {isLong ? <ArrowUpRight className="w-6 h-6 text-emerald-400" /> : <ArrowDownRight className="w-6 h-6 text-rose-400" />}
              <span className={`text-[9px] font-mono font-black ${isLong ? 'text-emerald-300' : 'text-rose-300'}`}>
                {position.leverage}x
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white font-mono">
                {position.instrument}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase ${
                isLong
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {isLong ? 'LONG' : 'SHORT'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Size: {position.sizeContracts} (~${position.notionalUsd.toFixed(2)})
              </span>
            </div>

            {/* Live Real-Tick P&L Display */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-black font-mono tracking-tight ${
                isProfit ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {isProfit ? '+' : ''}${position.unrealizedPnlUsd.toFixed(2)}
              </span>
              <span className={`text-xs font-mono font-bold ${
                isProfit ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                ({isProfit ? '+' : ''}{position.unrealizedPnlPercent.toFixed(2)}%)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Margin: ${position.marginUsedUsd.toFixed(2)} · Fee: ${position.takerFeeUsd.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Price Telemetry & Visual SL/TP Range */}
        <div className="flex-1 max-w-md bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <span className="text-rose-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> SL: ${position.stopLossPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}
            </span>
            <span className="text-white font-bold flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-cyan-400" /> Bybit: ${position.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Target className="w-3 h-3" /> TP: ${position.takeProfitPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className={`h-full transition-all duration-150 ${
                isProfit
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-1">
            <span>Entry: ${position.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>
            <span>Liq Price: ${position.liquidationPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>
          </div>
        </div>

        {/* Right: Manual Close Button */}
        {onManualClose && (
          <div className="flex items-center justify-end">
            <button
              onClick={onManualClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              title="Close position at current Bybit market price"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Close Position</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
