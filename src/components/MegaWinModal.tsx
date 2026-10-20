import React from 'react';
import { MegaWinState } from '../engine/grokJevEngine';
import {
  CyberCornerBrackets,
  LuxAvatar,
  BazzAvatar,
  OkkoAvatar,
  QuiloAvatar,
  FerroAvatar,
} from './GrokJevAvatars';

interface Props {
  megaWin: MegaWinState | null;
  onClose: () => void;
}

export const MegaWinModal: React.FC<Props> = ({ megaWin, onClose }) => {
  if (!megaWin) return null;

  const renderAvatar = (name: string) => {
    switch (name) {
      case 'BAZZ':
        return <BazzAvatar size={48} />;
      case 'OKKO':
        return <OkkoAvatar size={48} />;
      case 'QUILO':
        return <QuiloAvatar size={48} />;
      case 'FERRO':
        return <FerroAvatar size={48} />;
      case 'LUX':
      default:
        return <LuxAvatar size={48} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#07090e] border-2 border-yellow-400 p-6 rounded-lg shadow-[0_0_50px_rgba(234,179,8,0.35)] overflow-hidden">
        <CyberCornerBrackets />

        {/* Hazard Stripes Header Bar */}
        <div className="h-3 w-full hazard-stripes absolute top-0 left-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded bg-black/80 border border-yellow-500/40 text-yellow-400 hover:text-white hover:bg-yellow-500/20 flex items-center justify-center font-mono text-xs transition-colors z-30"
        >
          ✕
        </button>

        <div className="pt-2 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-400 text-black font-mono font-black text-xs uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-bounce">
            ⚡ MEGA WIN ALERT · BREAKOUT CAPTURED
          </div>

          {/* Trader & Token */}
          <div className="flex items-center justify-center gap-3 my-2">
            {renderAvatar(megaWin.trader)}
            <div className="text-left">
              <div className="text-sm font-mono font-bold text-white tracking-wide">
                {megaWin.trader} · <span className="text-yellow-400">{megaWin.role}</span>
              </div>
              <div className="text-2xl font-mono font-black text-yellow-400 tracking-wider">
                {megaWin.token}
              </div>
            </div>
          </div>

          {/* PNL Splash */}
          <div className="my-4 p-4 rounded bg-[#0f1422] border border-yellow-500/30">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              PROFIT REALIZED
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-black text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
              +${megaWin.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs font-mono text-slate-300 mt-2 italic">
              "{megaWin.desc}"
            </div>
          </div>

          {/* Vault Update */}
          <div className="flex items-center justify-between p-3 rounded bg-black/60 border border-yellow-500/20 text-xs font-mono">
            <span className="text-slate-400">NEW BANK VAULT TOTAL:</span>
            <span className="text-yellow-400 font-extrabold text-sm">
              ${megaWin.vault.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            CONFIRM & RETURN TO TERMINAL
          </button>
        </div>

        {/* Hazard Stripes Footer Bar */}
        <div className="h-2 w-full hazard-stripes absolute bottom-0 left-0" />
      </div>
    </div>
  );
};
