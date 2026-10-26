import React from 'react';
import { FunnelState, JevToken } from '../engine/grokJevEngine';
import { Filter, Gauge } from 'lucide-react';

interface QuantRadarFunnelProps {
  funnel: FunnelState;
  currentToken: JevToken;
  selectedIndex: number;
  onSelectToken: (index: number) => void;
}

export const QuantRadarFunnel: React.FC<QuantRadarFunnelProps> = ({
  funnel,
  currentToken,
  selectedIndex,
  onSelectToken,
}) => {
  const gates = [
    { num: '0', label: 'UNIVERSE', count: funnel.universe, color: 'bg-slate-700' },
    { num: '1', label: 'LIQUIDITY', count: funnel.liquidity, color: 'bg-cyan-900' },
    { num: '2', label: 'HOLDERS', count: funnel.holders, color: 'bg-cyan-700' },
    { num: '3', label: 'SLIP GATE (≤5bps)', count: funnel.jevGate, color: 'bg-amber-600' },
    { num: '4', label: 'PULLBACK', count: funnel.passed, color: 'bg-emerald-600' },
    { num: '5', label: '3.33R TICKET', count: funnel.filled, color: 'bg-emerald-400 shadow-[0_0_8px_#10b981]' },
  ];

  const candidateTokens = ['$SOL', '$BTC', '$ETH', '$SUI', '$DOGE'];

  return (
    <div className="terminal-card h-full">
      <div className="terminal-card-inner p-4 sm:p-5 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
              QUANT FUNNEL & CANDIDATE RADAR
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="text-slate-400">KILLED:</span>
            <span className="font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
              {funnel.killedPercent.toFixed(2)}% REJECTED
            </span>
          </div>
        </div>

        {/* Funnel Progress Bars */}
        <div className="space-y-1.5 my-1 flex-1 flex flex-col justify-center">
          {gates.map((g) => {
            const pct = Math.min(100, Math.max(10, Math.round((g.count / funnel.universe) * 100)));
            return (
              <div key={g.num} className="flex items-center justify-between gap-2 text-[10px] font-mono">
                <span className="text-slate-300 w-28 shrink-0 font-medium">
                  {g.num} {g.label}
                </span>
                <div className="flex-1 h-2 bg-black/60 rounded-full overflow-hidden flex items-center border border-white/5">
                  <div
                    className={`h-full ${g.color} transition-all duration-300 rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-slate-100 font-bold w-12 text-right shrink-0">
                  {g.count.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Token Candidates Switcher & Radar Strip */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              TRACKED BYBIT PERP CANDIDATES
            </span>
            <span className="text-emerald-400 font-bold">1-MINUTE SCANNER</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {candidateTokens.map((token, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={token}
                  onClick={() => onSelectToken(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-black/40 hover:bg-white/5 text-slate-300 border border-white/5 hover:border-white/15'
                  }`}
                >
                  {token}
                </button>
              );
            })}
          </div>

          {/* Current Candidate Telemetry Box */}
          <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-white/5 grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div>
              <span className="text-slate-400">PRICE:</span>{' '}
              <span className="text-slate-100 font-bold">{currentToken.price}</span>
            </div>
            <div>
              <span className="text-slate-400">24H CHG:</span>{' '}
              <span
                className={`font-bold ${
                  currentToken.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {currentToken.change24h >= 0 ? `+${currentToken.change24h.toFixed(2)}%` : `${currentToken.change24h.toFixed(2)}%`}
              </span>
            </div>
            <div>
              <span className="text-slate-400">REGIME:</span>{' '}
              <span className="text-cyan-300 font-bold">TRENDING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
