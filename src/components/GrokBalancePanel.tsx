import React, { useRef, useEffect } from 'react';
import { CyberCornerBrackets } from './GrokJevAvatars';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { SimulationMode } from '../engine/grokJevEngine';

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
  winRatePercent?: number;
  profitFactor?: number;
  maxDrawdown?: number;
  consecutiveLosses?: number;
  maxConsecutiveLosses?: number;
  simMode?: SimulationMode;
  onToggleSimMode?: (mode: SimulationMode) => void;
  isRuin?: boolean;
}

export const GrokBalancePanel: React.FC<GrokBalancePanelProps> = ({
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
  isRuin = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isUnderWater = balance < tonightStart;
  const pnlDollar = balance - tonightStart;

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

    const padTop = 22;
    const padBottom = 24;
    const padLeft = 44;
    const padRight = 16;
    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    if (history.length < 2) {
      const baselineY = padTop + plotHeight * 0.5;
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, baselineY);
      ctx.lineTo(width - padRight, baselineY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`$${balance.toFixed(2)}`, padLeft - 6, baselineY + 3);

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(width - padRight - 8, baselineY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LIVE COMPOUND ACCUMULATOR ACTIVE', width / 2, baselineY - 10);
      return;
    }

    // Dynamic scale for realistic micro-wallet ($15 baseline, can dip down to $0 or up to $30+)
    const historyBalances = history.map(h => h.balance);
    const minBal = Math.max(0, Math.min(...historyBalances, tonightStart, balance) * 0.92);
    const maxBal = Math.max(...historyBalances, tonightStart, balance) * 1.08;

    const getY = (val: number) => {
      const denom = maxBal - minBal || 1;
      return padTop + plotHeight * (1 - (val - minBal) / denom);
    };

    // Draw Starting Capital Benchmark Line ($15.00)
    const baselineY = getY(tonightStart);
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
    ctx.setLineDash([4, 4]);
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
      { val: Math.max(0, minBal * 1.04), label: `$${Math.max(0, minBal * 1.04).toFixed(2)}` }
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
    ctx.strokeStyle = isUnderWater ? '#f43f5e' : '#10b981';
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
    ctx.strokeStyle = isUnderWater ? 'rgba(244, 63, 94, 0.6)' : 'rgba(52, 211, 153, 0.6)';
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
  }, [history, balance, tonightStart, isUnderWater]);

  return (
    <div className="jev-panel p-3.5 flex flex-col justify-between h-full relative">
      <CyberCornerBrackets />

      {/* Top Header: Controls & Real Probability Mode Indicator */}
      <div className="flex flex-wrap items-center justify-between border-b border-yellow-400/20 pb-2 text-[10px] font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="font-black text-yellow-400 tracking-wider flex items-center gap-1.5">
            DEV'S QUANT EQUITY · $15 WALLET
          </span>

          {/* Mode Switcher */}
          {onToggleSimMode && (
            <div className="flex items-center rounded-lg bg-black/60 border border-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => onToggleSimMode('REAL_MARKET')}
                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                  simMode === 'REAL_MARKET'
                    ? 'bg-yellow-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                QUANT EDGE (Stressed Sizing)
              </button>
              <button
                type="button"
                onClick={() => onToggleSimMode('TIKTOK_DEMO')}
                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                  simMode === 'TIKTOK_DEMO'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MARTINGALE TRAP (82% Demo)
              </button>
            </div>
          )}
        </div>

        {/* Win/Loss & Real-Time Performance */}
        <div className="flex items-center gap-3 text-right">
          <div className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold">{wins}W</span>
            <span className="text-slate-600">/</span>
            <span className="text-rose-400 font-bold">{losses}L</span>
            <span className="text-slate-400 text-[9px]">({winRatePercent}%)</span>
          </div>

          <div className={`font-bold flex items-center gap-1 ${isUnderWater ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isUnderWater ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
            <span>{tonightGainPercent >= 0 ? `+${tonightGainPercent.toFixed(2)}%` : `${tonightGainPercent.toFixed(2)}%`}</span>
          </div>
        </div>
      </div>

      {/* Main Body: Left Chart + Right Real Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 my-2 items-center flex-1">
        {/* Left: Stepped Canvas Chart */}
        <div className="sm:col-span-7 h-[115px] relative">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Right: Big Balance Display & Capital Health */}
        <div className="sm:col-span-5 flex flex-col justify-center text-right pr-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-end gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isUnderWater ? 'bg-rose-400' : 'bg-emerald-400 animate-ping'}`} />
            {isRuin ? 'CAPITAL WIPED OUT (REKT)' : isUnderWater ? 'WALLET IN DRAWDOWN' : 'WALLET IN PROFIT'}
          </div>

          <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
            isUnderWater
              ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.35)]'
              : 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]'
          }`}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <div className={`text-[10px] font-mono mt-0.5 ${isUnderWater ? 'text-rose-400' : 'text-slate-400'}`}>
            {pnlDollar >= 0 ? `+$${pnlDollar.toFixed(2)} net profit` : `-$${Math.abs(pnlDollar).toFixed(2)} net loss`}
          </div>

          {/* Consecutive Losses Warning */}
          {consecutiveLosses >= 2 && (
            <div className="mt-1 text-[9px] font-bold text-amber-400 flex items-center justify-end gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>{consecutiveLosses} CONSECUTIVE LOSSES</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-World Risk & Telemetry Footer Strip */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-yellow-500/10 text-[9px] font-mono">
        <div className="p-1.5 rounded bg-black/40 border border-slate-800/80">
          <div className="text-slate-500 uppercase">MAX DRAWDOWN</div>
          <div className={`font-bold ${maxDrawdown > 15 ? 'text-rose-400' : 'text-yellow-400'}`}>
            -{maxDrawdown.toFixed(1)}%
          </div>
        </div>

        <div className="p-1.5 rounded bg-black/40 border border-slate-800/80">
          <div className="text-slate-500 uppercase">PROFIT FACTOR</div>
          <div className={`font-bold ${profitFactor >= 1.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {profitFactor.toFixed(2)}
          </div>
        </div>

        <div className="p-1.5 rounded bg-black/40 border border-slate-800/80">
          <div className="text-slate-500 uppercase">WORST STREAK</div>
          <div className={`font-bold ${maxConsecutiveLosses >= 3 ? 'text-rose-400' : 'text-slate-300'}`}>
            {maxConsecutiveLosses} Loss{maxConsecutiveLosses !== 1 ? 'es' : ''}
          </div>
        </div>

        <div className="p-1.5 rounded bg-black/40 border border-slate-800/80">
          <div className="text-slate-500 uppercase">SLIPPAGE & FEES</div>
          <div className="font-bold text-cyan-400">
            0.11% taker + slip
          </div>
        </div>
      </div>
    </div>
  );
};
