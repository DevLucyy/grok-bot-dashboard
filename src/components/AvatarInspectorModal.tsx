import React, { useEffect } from 'react';
import { BYBIT_MASTER_TRADERS } from '../engine/bybitMasterTraders';
import { TraderStats } from '../engine/grokJevEngine';
import {
  BazzAvatar,
  QuiloAvatar,
  TomiAvatar,
  OkkoAvatar,
  LuxAvatar,
  FerroAvatar,
  DevQuantCoreDisc,
  CyberCornerBrackets,
} from './GrokJevAvatars';

interface Props {
  botName: string | null;
  onClose: () => void;
  traderStats?: TraderStats;
}

export const AvatarInspectorModal: React.FC<Props> = ({ botName, onClose, traderStats }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!botName) return null;

  const isDevCore = botName === 'DEV_CORE' || botName === 'JEV';
  const master = BYBIT_MASTER_TRADERS.find((m) => m.squadBot === botName);

  const renderLargeAvatar = () => {
    switch (botName) {
      case 'BAZZ':
        return <BazzAvatar size={110} isActive={true} />;
      case 'QUILO':
        return <QuiloAvatar size={110} isActive={true} />;
      case 'TOMI':
        return <TomiAvatar size={110} isActive={true} />;
      case 'OKKO':
        return <OkkoAvatar size={110} isActive={true} />;
      case 'FERRO':
        return <FerroAvatar size={110} isActive={true} />;
      case 'LUX':
        return <LuxAvatar size={110} isActive={true} />;
      case 'DEV_CORE':
      case 'JEV':
      default:
        return <DevQuantCoreDisc size={110} />;
    }
  };

  const getAccentColor = () => {
    if (isDevCore) return { text: 'text-yellow-400', border: 'border-yellow-400', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.35)]' };
    if (!master) return { text: 'text-cyan-400', border: 'border-cyan-400', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.35)]' };
    switch (botName) {
      case 'BAZZ': return { text: 'text-cyan-400', border: 'border-cyan-500', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.35)]' };
      case 'QUILO': return { text: 'text-rose-400', border: 'border-rose-500', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.35)]' };
      case 'TOMI': return { text: 'text-pink-400', border: 'border-pink-500', glow: 'shadow-[0_0_30px_rgba(251,113,133,0.35)]' };
      case 'OKKO': return { text: 'text-purple-400', border: 'border-purple-500', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.35)]' };
      case 'FERRO': return { text: 'text-sky-400', border: 'border-sky-500', glow: 'shadow-[0_0_30px_rgba(56,189,248,0.35)]' };
      case 'LUX': return { text: 'text-slate-100', border: 'border-slate-300', glow: 'shadow-[0_0_30px_rgba(248,250,252,0.35)]' };
      default: return { text: 'text-yellow-400', border: 'border-yellow-400', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.35)]' };
    }
  };

  const accent = getAccentColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full max-w-xl rounded-xl bg-[#090b10]/95 border-2 ${accent.border} ${accent.glow} p-6 overflow-hidden shadow-2xl flex flex-col gap-5`}
      >
        <CyberCornerBrackets />

        {/* Ambient background grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab3080a_1px,transparent_1px),linear-gradient(to_bottom,#eab3080a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              AGENT TELEMETRY & INSPECTOR
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded border border-slate-700 bg-slate-900/60 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-rose-400 text-slate-400 text-xs font-mono flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Top Hero Section: Large Alive Avatar + Identity */}
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* Avatar Pod with Rotating Cyber Ring */}
          <div className="relative p-3 rounded-2xl bg-[#06080d] border border-white/10 shadow-inner flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl border border-yellow-400/20 animate-pulse pointer-events-none" />
            {renderLargeAvatar()}
          </div>

          {/* Identity & Badges */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
                {isDevCore ? "DEV'S QUANT CORE" : master ? master.name : botName}
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-black/60 border ${accent.border} ${accent.text}`}>
                {isDevCore ? 'MASTER ENGINE' : master ? master.badge : 'POD SEAT'}
              </span>
            </div>

            <p className="text-xs font-mono text-slate-400 leading-relaxed mb-3">
              {isDevCore
                ? 'HyperGrok 7-Agent Master Orchestrator. Evaluates stressed stop-loss, anti-wick bar closes, and 1,000-path Monte Carlo odds before authorising any copy execution.'
                : master?.style || 'High-speed automated algorithmic strategy.'}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101726] border border-blue-500/30 text-blue-300">
                {isDevCore ? 'ROLE: ORCHESTRATOR' : `SQUAD SEAT: ${botName}`}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                BYBIT LIVE TICK SYNC
              </span>
            </div>
          </div>
        </div>

        {/* Quant & Execution Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
          <div className="p-2.5 rounded bg-[#0b0e14] border border-white/10 flex flex-col">
            <span className="text-[9px] font-mono text-slate-400">7D BYBIT ROI</span>
            <span className="text-sm font-black font-mono text-emerald-400 mt-1">
              {isDevCore ? '+312.4%' : master?.roi7d || '+120.0%'}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#0b0e14] border border-white/10 flex flex-col">
            <span className="text-[9px] font-mono text-slate-400">WIN RATE</span>
            <span className="text-sm font-black font-mono text-cyan-400 mt-1">
              {isDevCore ? '72.5%' : master?.winRate || '68.0%'}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#0b0e14] border border-white/10 flex flex-col">
            <span className="text-[9px] font-mono text-slate-400">COPY FOLLOWERS</span>
            <span className="text-sm font-black font-mono text-yellow-400 mt-1">
              {isDevCore ? '12,450' : master?.followers?.toLocaleString() || '1,500'}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#0b0e14] border border-white/10 flex flex-col">
            <span className="text-[9px] font-mono text-slate-400">CURRENT PNL</span>
            <span className={`text-sm font-black font-mono mt-1 ${
              (traderStats?.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {(traderStats?.pnl || 0) >= 0 ? `+$${(traderStats?.pnl || 0).toFixed(2)}` : `-$${Math.abs(traderStats?.pnl || 0).toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Live Desk Telemetry: Strategy Parameters */}
        <div className="p-3 rounded bg-[#06080e] border border-white/10 space-y-2 text-xs font-mono relative z-10">
          <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-white/5">
            <span className="text-slate-400">Target Universe:</span>
            <div className="flex gap-1.5">
              {(master?.tokens || ['$SOL', '$BTC', '$ETH']).map((tok) => (
                <span key={tok} className="px-1.5 py-0.2 rounded bg-yellow-400/10 border border-yellow-500/30 text-yellow-300 font-bold text-[10px]">
                  {tok}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-white/5">
            <span className="text-slate-400">Consecutive Loss Rule:</span>
            <span className="text-rose-400 font-bold text-[10px]">
              2 CONSECUTIVE LOSSES = AUTO STANDDOWN & ROTATION
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Active Circuit Breaker:</span>
            <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              1.67R ASYMMETRIC REWARD-TO-RISK ENFORCED
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-yellow-500/20 relative z-10">
          <div className="text-[10px] font-mono text-slate-500">
            Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">ESC</kbd> to exit
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            DISMISS TELEMETRY
          </button>
        </div>
      </div>
    </div>
  );
};
export default AvatarInspectorModal;
