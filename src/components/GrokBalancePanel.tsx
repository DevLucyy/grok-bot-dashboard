import React, { useRef, useEffect } from 'react';
import { CyberCornerBrackets } from './GrokJevAvatars';

interface BalanceHistoryPoint {
  time: string;
  balance: number;
  flag?: string;
  isLoss?: boolean;
}

interface GrokBalancePanelProps {
  balance: number;
  tonightStart: number;
  tonightGainPercent: number;
  wins: number;
  losses: number;
  history: BalanceHistoryPoint[];
}

export const GrokBalancePanel: React.FC<GrokBalancePanelProps> = ({
  balance,
  tonightStart,
  tonightGainPercent,
  wins,
  losses,
  history
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    if (history.length < 2) return;

    const padTop = 22;
    const padBottom = 24;
    const padLeft = 44;
    const padRight = 16;
    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    // Dynamic scale for realistic micro-wallet ($15 to $35+)
    const historyBalances = history.map(h => h.balance);
    const minBal = Math.max(0, Math.min(...historyBalances, tonightStart) * 0.94);
    const maxBal = Math.max(...historyBalances, balance) * 1.08;

    const getY = (val: number) => {
      const denom = maxBal - minBal || 1;
      return padTop + plotHeight * (1 - (val - minBal) / denom);
    };

    // Y Axis Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    const ticks = [
      { val: maxBal * 0.96, label: `$${(maxBal * 0.96).toFixed(2)}` },
      { val: (maxBal + minBal) / 2, label: `$${((maxBal + minBal) / 2).toFixed(2)}` },
      { val: minBal * 1.04, label: `$${(minBal * 1.04).toFixed(2)}` }
    ];

    ticks.forEach(t => {
      const y = getY(t.val);
      ctx.fillText(t.label, padLeft - 6, y + 3);
      // subtle grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    });

    // Draw Volume Bars at base
    const stepW = plotWidth / (history.length - 1);
    history.forEach((h, i) => {
      const x = padLeft + i * stepW;
      const vH = Math.min(18, Math.max(4, ((h.balance * 10) % 20) + 4));
      ctx.fillStyle = h.isLoss ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)';
      ctx.fillRect(x - 2, height - padBottom - vH, 4, vH);
    });

    // Draw Stepped Line (Authentic Cyber Terminal Stepped Curve)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    history.forEach((h, i) => {
      const x = padLeft + i * stepW;
      const y = getY(h.balance);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        // Stepped: horizontal then vertical
        ctx.lineTo(x, getY(history[i - 1].balance));
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Dotted projection line from last point
    const lastX = padLeft + (history.length - 1) * stepW;
    const lastY = getY(history[history.length - 1].balance);
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(width - padRight, lastY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Milestones Flags
    ctx.textAlign = 'center';
    history.forEach((h, i) => {
      if (!h.flag) return;
      const x = padLeft + i * stepW;
      const y = getY(h.balance);

      // Node circle
      ctx.fillStyle = h.isLoss ? '#f43f5e' : '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Flag Pill
      ctx.font = 'bold 8.5px monospace';
      const textW = ctx.measureText(h.flag).width;
      const pillW = textW + 10;
      const pillH = 14;
      const pillY = y - 18;

      ctx.fillStyle = h.isLoss ? 'rgba(136, 19, 55, 0.95)' : 'rgba(6, 78, 59, 0.95)';
      ctx.strokeStyle = h.isLoss ? '#f43f5e' : '#10b981';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(x - pillW / 2, pillY, pillW, pillH, 4);
      } else {
        ctx.rect(x - pillW / 2, pillY, pillW, pillH);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = h.isLoss ? '#fecdd3' : '#a7f3d0';
      ctx.fillText(h.flag, x, pillY + 10);
    });
  }, [history, balance, tonightStart]);

  return (
    <div className="jev-panel p-3.5 flex flex-col justify-between h-full">
      <CyberCornerBrackets />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-yellow-400/20 pb-2 text-[10px] font-mono">
        <div>
          <span className="font-black text-yellow-400 tracking-wider">
            BALANCE · DAY 1 · REAL $15 WALLET
          </span>
          <div className="text-[9px] text-slate-400 mt-0.5">
            START $15.00 · SIZING 25% ($3.75) · 0 DEMOS
          </div>
        </div>
        <div className="text-right">
          <span className="font-bold text-white">{wins}W {losses}L</span>
          <span className="text-slate-500 mx-1">·</span>
          <span className="font-bold text-emerald-400">
            TONIGHT +{tonightGainPercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Main Body: Left Chart + Right Real Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 my-2 items-center flex-1">
        {/* Left: Stepped Canvas Chart */}
        <div className="sm:col-span-7 h-[115px] relative">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Right: Big Balance Display */}
        <div className="sm:col-span-5 flex flex-col justify-center text-right pr-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-end gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE WALLET
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            +${(balance - tonightStart).toFixed(2)} net profit tonight
          </div>
        </div>
      </div>
    </div>
  );
};
