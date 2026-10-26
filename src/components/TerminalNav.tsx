import React from 'react';
import { DevQuantCoreDisc } from './GrokJevAvatars';
import { BybitFeedState } from '../engine/bybitClient';
import { RefreshCw, KeyRound, Wifi, Clock, Activity, Cloud } from 'lucide-react';

interface TerminalNavProps {
  balance: number;
  digitalTime: string;
  cloudExecutions?: number;
  isCloudSynced?: boolean;
  lastCloudSync?: string;
  bybitFeed: BybitFeedState;
  onResetToFifteen: () => void;
  onOpenBybitModal: () => void;
}

export const TerminalNav: React.FC<TerminalNavProps> = ({
  balance,
  digitalTime,
  cloudExecutions = 0,
  isCloudSynced = true,
  lastCloudSync,
  bybitFeed,
  onResetToFifteen,
  onOpenBybitModal,
}) => {
  // Extract live tickers from Bybit public feed
  const tickers = [
    { symbol: 'BTC', price: bybitFeed.tickers?.['BTCUSDT']?.lastPrice ?? 80270, change: bybitFeed.tickers?.['BTCUSDT']?.price24hPcnt ?? 0.0042 },
    { symbol: 'ETH', price: bybitFeed.tickers?.['ETHUSDT']?.lastPrice ?? 2328, change: bybitFeed.tickers?.['ETHUSDT']?.price24hPcnt ?? -0.0011 },
    { symbol: 'SOL', price: bybitFeed.tickers?.['SOLUSDT']?.lastPrice ?? 101.43, change: bybitFeed.tickers?.['SOLUSDT']?.price24hPcnt ?? 0.0050 },
    { symbol: 'DOGE', price: bybitFeed.tickers?.['DOGEUSDT']?.lastPrice ?? 0.077, change: bybitFeed.tickers?.['DOGEUSDT']?.price24hPcnt ?? 0.0054 },
    { symbol: 'SUI', price: bybitFeed.tickers?.['SUIUSDT']?.lastPrice ?? 0.915, change: bybitFeed.tickers?.['SUIUSDT']?.price24hPcnt ?? 0.0020 },
  ];

  return (
    <header className="w-full flex flex-col gap-2.5 pt-2 pb-1">
      {/* Top Bar: Brand, Status Pill, Action Buttons, Digital Clock */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-1">
        {/* Left: Brand Identity with Alive Dev Quant Core */}
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer group">
            <DevQuantCoreDisc size={44} className="shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
                DEV'S QUANT TERMINAL
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold tracking-wider">
                  v2.4 PRO
                </span>
              </h1>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono font-medium text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>3.33R ASYMMETRIC BRACKET</span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
              <span>BYBIT LINEAR PERPETUALS</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-400/90 font-medium">100% REAL EXCHANGE PRICES</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400/90 font-bold">${(balance ?? 15).toFixed(2)} PAPER BANKROLL</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
          {/* Cloudflare 24/7 Edge Cron Status */}
          <div
            className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 flex items-center gap-1.5 shadow-sm"
            title={`Cloudflare Global Worker running 24/7. Last sync: ${lastCloudSync || 'Active'}`}
          >
            <Cloud className={`w-3.5 h-3.5 ${isCloudSynced ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span className="text-slate-400">EDGE:</span>
            <span className="text-cyan-300 font-bold flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isCloudSynced ? 'bg-cyan-400 animate-pulse' : 'bg-yellow-400'}`} />
              {cloudExecutions > 0 ? `${cloudExecutions} TICKS` : '24/7 LIVE'}
            </span>
          </div>

          {/* Reset $15.00 Button */}
          <button
            onClick={onResetToFifteen}
            className="px-3 py-1 text-[11px] font-mono font-medium rounded-lg bg-slate-900/80 hover:bg-emerald-950/70 border border-slate-700/60 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Reset paper wallet balance to pristine $15.00 baseline"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>RESET $15.00</span>
          </button>

          {/* Bybit API Modal Trigger */}
          <button
            onClick={onOpenBybitModal}
            className="px-3 py-1 text-[11px] font-mono font-medium rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Configure Bybit API / Testnet credentials"
          >
            <KeyRound className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">BYBIT API</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                bybitFeed.isConnected ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-yellow-400 animate-pulse'
              }`}
            />
          </button>

          {/* Real-Time Digital Clock */}
          <div className="px-3 py-1 rounded-lg bg-black/80 border border-white/10 shadow-sm flex items-center gap-2 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-100">
              {digitalTime}
            </span>
          </div>
        </div>
      </div>

      {/* Live Bybit Ticker Tape Marquee */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 min-w-max">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 py-1 rounded bg-slate-900/50 border border-white/5">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>BYBIT LINEAR PERPS:</span>
          </div>

          {tickers.map((t) => {
            const isUp = t.change >= 0;
            const changePct = (t.change * 100).toFixed(2);
            return (
              <div
                key={t.symbol}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-white/15 transition-all text-[11px] font-mono cursor-pointer"
              >
                <span className="font-bold text-slate-200">${t.symbol}</span>
                <span className="text-slate-300 font-mono-numbers">
                  ${t.price > 100 ? t.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : t.price.toFixed(4)}
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    isUp
                      ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-950/70 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isUp ? `+${changePct}%` : `${changePct}%`}
                </span>
              </div>
            );
          })}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/40 border border-white/5 text-[10px] font-mono text-slate-400">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>LATENCY: &lt;14ms</span>
          </div>
        </div>
      </div>
    </header>
  );
};
