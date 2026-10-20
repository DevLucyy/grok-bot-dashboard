import React from 'react';
import { GrokCoreDisc } from './GrokJevAvatars';

interface GrokJevHeaderProps {
  balance: number;
  digitalTime: string;
  onResetToFifteen?: () => void;
}

export const GrokJevHeader: React.FC<GrokJevHeaderProps> = ({
  balance,
  digitalTime,
  onResetToFifteen
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 px-1">
      {/* Left: Brand Identity with Alive Grok Disc */}
      <div className="flex items-center gap-3">
        <GrokCoreDisc size={40} className="shrink-0" />
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono flex items-center gap-2">
            Grok Bot <span className="text-yellow-400 font-bold">×</span> Jev
          </h1>
          <p className="text-[11px] font-mono text-yellow-400 font-semibold tracking-wider uppercase mt-0.5">
            DAY 1 · ${balance.toFixed(2)} REAL WALLET · JEV PICKS, GROK TRADES (NO DEMOS)
          </p>
        </div>
      </div>

      {/* Right: Digital Time Pill & Reset to $15 Wallet Action */}
      <div className="flex items-center gap-2 self-start sm:self-center">
        {onResetToFifteen && (
          <button
            onClick={onResetToFifteen}
            className="px-2.5 py-1 text-[10px] font-mono font-bold rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            title="Reset wallet to $15.00 initial balance"
          >
            <span>🔄</span> RESET TO $15.00
          </button>
        )}

        <div className="px-3.5 py-1 rounded-full bg-black border border-yellow-400/80 shadow-[0_0_10px_rgba(250,204,21,0.25)] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
          <span className="text-xs font-mono font-black text-yellow-400 tracking-wider">
            {digitalTime}
          </span>
        </div>
      </div>
    </header>
  );
};
