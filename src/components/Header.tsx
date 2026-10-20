import React from 'react';
import { Play, Pause, RotateCcw, Radio } from 'lucide-react';
import { BybitFeedState, BybitCredentials } from '../engine/bybitClient';

interface HeaderProps {
  tradesCopied: number;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  onReset: () => void;
  bybitFeed: BybitFeedState;
  bybitCreds: BybitCredentials;
  onOpenBybitModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tradesCopied,
  isRunning,
  setIsRunning,
  speed,
  setSpeed,
  onReset,
  bybitFeed,
  bybitCreds,
  onOpenBybitModal
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1a233d]">
      {/* Left: Brand Avatar & Mastermind Identity */}
      <div className="flex items-center gap-3">
        {/* Grok Bot Mask Avatar */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-400 p-0.5 shadow-lg shadow-white/5 flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-[#0a0d1a] rounded-[14px] flex items-center justify-center relative overflow-hidden">
            <div className="w-7 h-7 bg-white rounded-full relative flex items-center justify-center shadow-inner">
              <div className="w-2 h-2.5 bg-black rounded-full absolute -left-0.5 top-2.5" />
              <div className="w-2 h-2.5 bg-black rounded-full absolute -right-0.5 top-2.5" />
              <div className="w-3.5 h-1.5 border-b-2 border-black rounded-full absolute bottom-1" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">Grok Bot</h1>
            <div className="flex items-center gap-0.5 text-amber-400">
              <span className="w-1 h-2 bg-amber-400 rounded-full inline-block animate-pulse" />
              <span className="w-1 h-3.5 bg-amber-400 rounded-full inline-block" />
              <span className="w-1 h-1.5 bg-amber-400 rounded-full inline-block" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              MASTERMIND CORE
            </span>
          </div>
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 font-mono uppercase mt-0.5 flex items-center gap-2">
            <span>Autonomous Trading Engine</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">Self-Evolving 24/7</span>
          </p>
        </div>
      </div>

      {/* Right: Clean Playback Controls, Bybit Feed & Status */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Play / Pause / Reset & Speed Pills */}
        <div className="bg-[#0b1022] p-1 rounded-xl border border-[#212b48] flex items-center gap-1 shadow-inner">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-1.5 rounded-lg transition-colors ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
            title={isRunning ? 'Pause Engine' : 'Resume Engine'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset Engine & Bankroll"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          {[1, 2, 5, 10].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-[11px] font-mono rounded font-semibold transition-all ${
                speed === s
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Bybit V5 Live Feed Pill */}
        <button
          onClick={onOpenBybitModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold transition-all shadow-sm shadow-amber-500/10"
          title="Bybit V5 Testnet Feed & Optional Demo API Keys"
        >
          <Radio className={`w-3.5 h-3.5 ${bybitFeed.isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
          <span>Bybit V5: {bybitFeed.isConnected ? `${bybitFeed.latencyMs}ms` : 'Connecting'}</span>
          {bybitCreds.isConfigured && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          )}
        </button>

        {/* Live Trades Counter */}
        <div className="hidden sm:block text-right font-mono">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
            {tradesCopied} Trades
          </span>
        </div>

        {/* LIVE Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
            AUTOPILOT
          </span>
        </div>
      </div>
    </header>
  );
};
