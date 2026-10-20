import React, { useState, useEffect } from 'react';
import { CyberCornerBrackets } from './GrokJevAvatars';

interface GateCheck {
  id: string;
  name: string;
  baseMs: number;
}

const DEFAULT_CHECKS: GateCheck[] = [
  { id: 'liq', name: 'liquidity depth', baseMs: 266 },
  { id: 'hold', name: 'holder spread', baseMs: 183 },
  { id: 'vol', name: 'volume vs mcap', baseMs: 768 },
  { id: 'rug', name: 'rug signature', baseMs: 297 },
  { id: 'wal', name: 'fresh wallets', baseMs: 134 },
  { id: 'win', name: 'entry window', baseMs: 231 },
];

export const JevChecksPanel: React.FC = () => {
  const [latencies, setLatencies] = useState<{ [key: string]: number }>({
    liq: 266,
    hold: 183,
    vol: 768,
    rug: 297,
    wal: 134,
    win: 231,
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
            JEV CHECKS
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
          6 GATES · ALL CLEAR
        </span>
      </div>

      {/* Gate Checks Grid / List */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        {DEFAULT_CHECKS.map((gate) => (
          <div
            key={gate.id}
            className="flex items-center justify-between p-2 rounded bg-[#0a0d14]/80 border border-yellow-500/10 hover:border-yellow-500/30 transition-all group"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-slate-300 font-semibold tracking-tight group-hover:text-yellow-400 transition-colors">
                {gate.name}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {latencies[gate.id]}ms
              </span>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-500/50 rounded shadow-[0_0_8px_rgba(16,185,129,0.25)]">
              PASS
            </span>
          </div>
        ))}
      </div>

      {/* Bottom status line */}
      <div className="mt-3 pt-2 border-t border-yellow-500/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-slate-400">
          <span className="text-yellow-400">⚡</span> RUG SHIELD: <span className="text-emerald-400 font-semibold">100% HEALTH</span>
        </span>
        <span className="text-slate-500">
          AVG: <span className="text-slate-300">313ms</span>
        </span>
      </div>
    </div>
  );
};
