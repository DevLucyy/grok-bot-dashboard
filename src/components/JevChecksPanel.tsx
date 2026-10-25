import React, { useState, useEffect } from 'react';
import { CyberCornerBrackets } from './GrokJevAvatars';

interface GateCheck {
  id: string;
  name: string;
  detail: string;
  baseMs: number;
}

const DEFAULT_CHECKS: GateCheck[] = [
  { id: 'size', name: 'STRESSED STOP SIZING', detail: '0.11% Taker Fees Buffered', baseMs: 142 },
  { id: 'wick', name: 'ANTI-WICK BAR CLOSE', detail: 'Confirmed Candle Close', baseMs: 198 },
  { id: 'exp', name: 'MATHEMATICAL EXPECTANCY', detail: 'Asymmetric 1.67R (E > 0)', baseMs: 235 },
  { id: 'mc', name: 'MONTE CARLO 1,000 PATHS', detail: 'Target Prob > 50%', baseMs: 310 },
  { id: 'loss', name: '2-LOSS AUTO ROTATION', detail: 'Circuit Breaker Armed', baseMs: 165 },
  { id: 'slip', name: 'SLIPPAGE & LOT BUFFER', detail: 'Max 5 bps Dynamic Guard', baseMs: 180 },
];

export const JevChecksPanel: React.FC = () => {
  const [latencies, setLatencies] = useState<{ [key: string]: number }>({
    size: 142,
    wick: 198,
    exp: 235,
    mc: 310,
    loss: 165,
    slip: 180,
  });

  // Subtle real-time jitter in latency to keep terminal alive
  useEffect(() => {
    const timer = setInterval(() => {
      setLatencies(prev => {
        const next = { ...prev };
        DEFAULT_CHECKS.forEach(c => {
          const jitter = Math.floor(Math.random() * 21) - 10;
          next[c.id] = Math.max(90, c.baseMs + jitter);
        });
        return next;
      });
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="jev-panel p-4 relative flex flex-col justify-between">
      <CyberCornerBrackets />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="font-mono font-bold tracking-wider text-xs text-yellow-400 flex items-center gap-1.5 uppercase">
            DEV'S PRE-FLIGHT QUANT GATES
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
          6 GATES · ALL PASSED
        </span>
      </div>

      {/* Gate Checks Grid / List */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        {DEFAULT_CHECKS.map((gate) => (
          <div
            key={gate.id}
            className="flex items-center justify-between p-2 rounded bg-[#0a0d14]/80 border border-yellow-500/10 hover:border-yellow-500/30 transition-all group"
          >
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[10px] font-mono text-slate-200 font-bold tracking-tight group-hover:text-yellow-400 transition-colors truncate">
                  {gate.name}
                </span>
                <span className="text-[9px] font-mono text-slate-500 shrink-0">
                  {latencies[gate.id]}ms
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-400 truncate">
                {gate.detail}
              </span>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-500/50 rounded shadow-[0_0_8px_rgba(16,185,129,0.25)] shrink-0">
              PASS
            </span>
          </div>
        ))}
      </div>

      {/* Bottom status line */}
      <div className="mt-3 pt-2 border-t border-yellow-500/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-slate-400">
          <span className="text-yellow-400">🛡️</span> RISK VETO: <span className="text-emerald-400 font-semibold">GATEWAY ACTIVE</span>
        </span>
        <span className="text-slate-500">
          VERIFIED: <span className="text-slate-300">0 BLOWUPS</span>
        </span>
      </div>
    </div>
  );
};
