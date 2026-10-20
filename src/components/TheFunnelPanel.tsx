import React from 'react';
import { CyberCornerBrackets } from './GrokJevAvatars';
import { FunnelState } from '../engine/grokJevEngine';

interface TheFunnelPanelProps {
  funnel: FunnelState;
}

export const TheFunnelPanel: React.FC<TheFunnelPanelProps> = ({ funnel }) => {
  const gates = [
    { num: '0', label: 'UNIVERSE', count: funnel.universe, max: 5500, color: 'bg-yellow-700/60' },
    { num: '1', label: 'LIQUIDITY', count: funnel.liquidity, max: 2000, color: 'bg-yellow-600/70' },
    { num: '2', label: 'HOLDERS', count: funnel.holders, max: 800, color: 'bg-yellow-500/80' },
    { num: '3', label: 'JEV GATE', count: funnel.jevGate, max: 400, color: 'bg-yellow-400' },
    { num: '4', label: 'PASSED', count: funnel.passed, max: 200, color: 'bg-yellow-400' },
    { num: '5', label: 'FILLED', count: funnel.filled, max: 200, color: 'bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.5)]' }
  ];

  return (
    <div className="jev-panel p-3.5 flex flex-col justify-between h-full">
      <CyberCornerBrackets />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-yellow-400/20 pb-2 text-[10px] font-mono">
        <span className="font-black text-yellow-400 tracking-wider">THE FUNNEL</span>
        <span className="text-[9px] text-slate-500 italic">each gate kills harder</span>
      </div>

      {/* Funnel Rows */}
      <div className="space-y-1.5 my-2 flex-1 flex flex-col justify-center">
        {gates.map(g => {
          const pct = Math.min(100, Math.max(12, Math.round((g.count / funnel.universe) * 100)));
          return (
            <div key={g.num} className="flex items-center justify-between gap-2 text-[9px] font-mono">
              <span className="text-slate-400 w-20 shrink-0 font-bold">
                {g.num} {g.label}
              </span>
              <div className="flex-1 h-2 bg-slate-900 rounded-sm overflow-hidden flex items-center">
                <div
                  className={`h-full ${g.color} transition-all duration-300 rounded-sm`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-slate-200 font-bold w-12 text-right shrink-0">
                {g.count.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Red Killer Metric */}
      <div className="border-t border-yellow-400/20 pt-1.5 text-right text-[10px] font-mono">
        <span className="font-black text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
          {funnel.killedPercent.toFixed(2)}%
        </span>
        <span className="text-slate-400 text-[9px] ml-1.5">killed before a trade</span>
      </div>
    </div>
  );
};
