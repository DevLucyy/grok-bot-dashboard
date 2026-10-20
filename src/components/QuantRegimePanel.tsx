import { ShieldCheck, Cpu, Gauge, Zap } from 'lucide-react';
import { QuantState } from '../types';

interface QuantRegimePanelProps {
  quantState: QuantState;
}

export const QuantRegimePanel = ({ quantState }: QuantRegimePanelProps) => {
  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case 'TRENDING':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'MEAN_REVERTING':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'HIGH_VOL':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'CRISIS':
        return 'text-rose-400 bg-rose-500/20 border-rose-500/40 animate-pulse';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="cyber-card p-5 rounded-2xl border-indigo-500/30 bg-gradient-to-b from-[#0e142e] to-[#090d1f] shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/40 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-display">
                Quant Reflex &amp; State Engine
              </h2>
              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                System 1 · 81ms
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-numbers mt-0.5">
              Deterministic order-book state · Typed Jev decision schema
            </p>
          </div>
        </div>

        {/* Current Market Regime Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-numbers text-slate-400 uppercase">
            Market Regime:
          </span>
          <span
            className={`text-xs font-bold font-mono-numbers px-3 py-1 rounded-lg border ${getRegimeColor(
              quantState.regime
            )}`}
          >
            {quantState.regime}
          </span>
        </div>
      </div>

      {/* Grid of Quant Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-4">
        {/* Metric 1: Order Book Imbalance (OBI) */}
        <div className="bg-[#090d1e] p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono-numbers text-slate-400">
            <span>Order Book Imbalance</span>
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-white mt-1">
            {quantState.orderBookImbalance > 0 ? `+${quantState.orderBookImbalance}` : quantState.orderBookImbalance}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-300 ${
                quantState.orderBookImbalance >= 0 ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
              style={{
                width: `${Math.min(100, Math.abs(quantState.orderBookImbalance) * 100)}%`,
                marginLeft: quantState.orderBookImbalance < 0 ? '0%' : '50%'
              }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Mid Price & Spread */}
        <div className="bg-[#090d1e] p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono-numbers text-slate-400">
            <span>BTC Mid / Spread</span>
            <span className="text-[10px] text-emerald-400 font-bold">{quantState.spreadPercent}%</span>
          </div>
          <div className="text-xl font-bold font-mono-numbers text-white mt-1">
            ${quantState.midPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 font-mono-numbers mt-2 flex justify-between">
            <span>Causal block time</span>
            <span className="text-slate-400">&lt;400 tokens</span>
          </div>
        </div>

        {/* Metric 3: Realized Volatility */}
        <div className="bg-[#090d1e] p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono-numbers text-slate-400">
            <span>Realized Volatility</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-amber-300 mt-1">
            {quantState.realizedVolatility}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono-numbers mt-2 flex justify-between">
            <span>Gating filter</span>
            <span className="text-emerald-400">Quality {quantState.setupQuality}/3</span>
          </div>
        </div>

        {/* Metric 4: Drawdown & 15% Circuit Breaker */}
        <div className="bg-[#090d1e] p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono-numbers text-slate-400">
            <span>Drawdown Breaker</span>
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-rose-400 mt-1 flex items-center justify-between">
            <span>{quantState.currentDrawdown}%</span>
            <span className="text-xs text-slate-500 font-normal">/ 15.0%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${(quantState.currentDrawdown / 15.0) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Two-Layer Architecture Spec Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-numbers">
        {/* Layer 1: Brain (Opus 5.5) */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-1 text-slate-300 font-bold">
            <span className="text-purple-400">Layer 1: The Brain</span>
            <span className="text-[10px] text-slate-500 font-normal">Slow &amp; Deep</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Market regime derivation, fundamental catalyst extraction, bear-case invalidation, and overnight calibration review (Brier scores).
          </p>
        </div>

        {/* Layer 2: Reflex (Jev / System One) */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-1 text-slate-300 font-bold">
            <span className="text-emerald-400">Layer 2: The Reflex</span>
            <span className="text-[10px] text-emerald-400 font-normal">~81ms Live Gate</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Candle scoring via typed Jev schema. Fires only when setup quality &ge; 2, confidence &gt; 0.80, and sized via quarter-Kelly fraction (0.25x).
          </p>
        </div>
      </div>
    </div>
  );
};
