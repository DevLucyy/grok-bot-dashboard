import React, { useRef, useEffect } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, ShieldCheck } from 'lucide-react';
import { SimulationMode } from '../engine/grokJevEngine';

interface BalanceHistoryPoint {
  time: string;
  balance: number;
  flag?: string;
  isLoss?: boolean;
}

interface PortfolioMatrixCardProps {
  balance: number;
  tonightStart: number;
  tonightGainPercent: number;
  wins: number;
  losses: number;
  history: BalanceHistoryPoint[];
  winRatePercent?: number;
  profitFactor?: number;
  maxDrawdown?: number;
  consecutiveLosses?: number;
  maxConsecutiveLosses?: number;
  simMode?: SimulationMode;
  onToggleSimMode?: (mode: SimulationMode) => void;
  isRuin?: boolean;
}

export const PortfolioMatrixCard: React.FC<PortfolioMatrixCardProps> = ({
  balance,
  tonightStart,
  tonightGainPercent,
  wins,
  losses,
  history,
  winRatePercent = 0,
  profitFactor = 1.0,
  maxDrawdown = 0,
  consecutiveLosses = 0,
  maxConsecutiveLosses = 0,
  simMode = 'REAL_MARKET',
  onToggleSimMode,
  isRuin = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isUnderWater = balance < tonightStart;
  const pnlDollar = balance - tonightStart;

  // Render high-end stepped equity curve
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

    const padTop = 18;
    const padBottom = 22;
    const padLeft = 44;
    const padRight = 16;
    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    if (history.length < 2) {
      const baselineY = padTop + plotHeight * 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, baselineY);
      ctx.lineTo(width - padRight, baselineY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`$${balance.toFixed(2)}`, padLeft - 6, baselineY + 3.5);

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(width - padRight - 8, baselineY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LIVE COMPOUND ACCUMULATOR ACTIVE', width / 2, baselineY - 10);
      return;
    }

    const historyBalances = history.map((h) => h.balance);
    const minBal = Math.max(0, Math.min(...historyBalances, tonightStart, balance) * 0.94);
    const maxBal = Math.max(...historyBalances, tonightStart, balance) * 1.06;

    const getY = (val: number) => {
      const denom = maxBal - minBal || 1;
      return padTop + plotHeight * (1 - (val - minBal) / denom);
    };

    // Benchmark Baseline ($15.00 Starting Capital)
    const baselineY = getY(tonightStart);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, baselineY);
    ctx.lineTo(width - padRight, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Y Axis Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    const ticks = [
      { val: maxBal * 0.96, label: `$${(maxBal * 0.96).toFixed(2)}` },
      { val: tonightStart, label: `$${tonightStart.toFixed(2)}` },
      { val: Math.max(0, minBal * 1.04), label: `$${Math.max(0, minBal * 1.04).toFixed(2)}` },
    ];

    ticks.forEach((t) => {
      const y = getY(t.val);
      ctx.fillText(t.label, padLeft - 6, y + 3);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    });

    // Volume Micro-Bars
    const stepW = plotWidth / (history.length - 1);
    history.forEach((h, i) => {
      const x = padLeft + i * stepW;
      const vH = Math.min(16, Math.max(3, ((h.balance * 8) % 16) + 4));
      ctx.fillStyle = h.isLoss ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)';
      ctx.fillRect(x - 1.5, height - padBottom - vH, 3, vH);
    });

    // Stepped Equity Line
    ctx.strokeStyle = isUnderWater ? '#f43f5e' : '#10b981';
    ctx.lineWidth = 2.2;
    ctx.beginPath();

    history.forEach((h, i) => {
      const x = padLeft + i * stepW;
      const y = getY(h.balance);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, getY(history[i - 1].balance));
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Dotted projection
    const lastX = padLeft + (history.length - 1) * stepW;
    const lastY = getY(history[history.length - 1].balance);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = isUnderWater ? 'rgba(244, 63, 94, 0.5)' : 'rgba(16, 185, 129, 0.5)';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(width - padRight, lastY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Milestone Nodes & Pills
    ctx.textAlign = 'center';
    history.forEach((h, i) => {
      if (!h.flag) return;
      const x = padLeft + i * stepW;
      const y = getY(h.balance);

      ctx.fillStyle = h.isLoss ? '#f43f5e' : '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 9px monospace';
      const textW = ctx.measureText(h.flag).width;
      const pillW = Math.max(textW + 16, 52);
      const pillH = 15;
      const pillY = y - 20;

      ctx.fillStyle = h.isLoss ? 'rgba(136, 19, 55, 0.95)' : 'rgba(6, 78, 59, 0.95)';
      ctx.strokeStyle = h.isLoss ? 'rgba(244, 63, 94, 0.6)' : 'rgba(16, 185, 129, 0.6)';
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
      ctx.fillText(h.flag, x, pillY + 11);
    });
  }, [history, balance, tonightStart, isUnderWater]);

  return (
    <div className="terminal-card h-full">
      <div className="terminal-card-inner p-4 sm:p-5 flex flex-col justify-between h-full">
        {/* Header: Title, Mode Toggles, and Real-Time Performance */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide uppercase font-sans flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              CAPITAL & PERFORMANCE MATRIX
            </span>

            {/* Mode Switcher */}
            {onToggleSimMode && (
              <div className="flex items-center rounded-lg bg-black/60 border border-white/10 p-0.5">
                <button
                  type="button"
                  onClick={() => onToggleSimMode('REAL_MARKET')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all cursor-pointer ${
                    simMode === 'REAL_MARKET'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  QUANT EDGE (3.33R)
                </button>
                <button
                  type="button"
                  onClick={() => onToggleSimMode('TIKTOK_DEMO')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all cursor-pointer ${
                    simMode === 'TIKTOK_DEMO'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  MARTINGALE (Demo)
                </button>
              </div>
            )}
          </div>

          {/* Win/Loss & Real-Time Performance */}
          <div className="flex items-center gap-3 text-right">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-emerald-400 font-bold">{wins}W</span>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400 font-bold">{losses}L</span>
              <span className="text-slate-400 text-[10px]">({winRatePercent}%)</span>
            </div>

            <div
              className={`font-mono font-bold text-xs flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                isUnderWater
                  ? 'bg-rose-950/60 border-rose-500/30 text-rose-300'
                  : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
              }`}
            >
              {isUnderWater ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              <span>{tonightGainPercent >= 0 ? `+${tonightGainPercent.toFixed(2)}%` : `${tonightGainPercent.toFixed(2)}%`}</span>
            </div>
          </div>
        </div>

        {/* Main Body: Chart + Capital Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-3 items-center flex-1">
          {/* Left: Stepped Canvas Curve */}
          <div className="sm:col-span-7 h-[135px] relative">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Right: Big Crisp Balance Display */}
          <div className="sm:col-span-5 flex flex-col justify-center text-left sm:text-right pr-0 sm:pr-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-medium flex items-center justify-start sm:justify-end gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isUnderWater ? 'bg-rose-400' : 'bg-emerald-400 animate-ping'}`} />
              {isRuin ? 'CAPITAL WIPED OUT (REKT)' : isUnderWater ? 'WALLET IN DRAWDOWN' : 'PORTFOLIO IN EXPANSION'}
            </div>

            <div
              className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight mt-1 ${
                isUnderWater
                  ? 'text-rose-400 drop-shadow-[0_0_16px_rgba(244,63,94,0.3)]'
                  : 'text-emerald-400 drop-shadow-[0_0_16px_rgba(16,185,129,0.3)]'
              }`}
            >
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className={`text-xs font-mono mt-1 ${isUnderWater ? 'text-rose-400' : 'text-slate-400'}`}>
              {pnlDollar >= 0 ? `+$${pnlDollar.toFixed(2)} net profit` : `-$${Math.abs(pnlDollar).toFixed(2)} net loss`}
            </div>

            {/* Consecutive Losses Warning */}
            {consecutiveLosses >= 2 && (
              <div className="mt-1.5 text-[10px] font-mono font-bold text-amber-400 flex items-center justify-start sm:justify-end gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{consecutiveLosses} CONSECUTIVE LOSSES (AUTO-ROTATING)</span>
              </div>
            )}
          </div>
        </div>

        {/* Telemetry Footer Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/10 text-[10px] font-mono">
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <div className="text-slate-400 uppercase text-[9px]">MAX DRAWDOWN / STREAK</div>
            <div className={`font-bold mt-0.5 ${maxDrawdown > 15 ? 'text-rose-400' : 'text-amber-400'}`}>
              -{maxDrawdown.toFixed(1)}% <span className="text-slate-500 text-[9px]">({maxConsecutiveLosses}L peak)</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <div className="text-slate-400 uppercase text-[9px]">TARGET ASYMMETRY</div>
            <div className="font-bold text-emerald-400 mt-0.5">
              3.33R (+1.50% TP)
            </div>
          </div>

          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <div className="text-slate-400 uppercase text-[9px]">PROFIT FACTOR</div>
            <div className={`font-bold mt-0.5 ${profitFactor >= 1.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {profitFactor.toFixed(2)}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <div className="text-slate-400 uppercase text-[9px]">TAKER FEES & SLIP</div>
            <div className="font-bold text-cyan-400 mt-0.5">
              0.11% fee + ≤5 bps slip
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
