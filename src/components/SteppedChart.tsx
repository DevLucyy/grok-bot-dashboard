import { useRef, useEffect } from 'react';
import { ChartPoint } from '../types';

interface SteppedChartProps {
  history: ChartPoint[];
  currentBalance: number;
}

export const SteppedChart = ({ history, currentBalance }: SteppedChartProps) => {
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

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Padding
    const padTop = 20;
    const padBottom = 35;
    const padLeft = 15;
    const padRight = 75;

    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    // Min and Max scale
    const minVal = 35;
    const maxVal = Math.max(60, currentBalance * 1.15);

    // Grid lines (horizontal)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padTop + (plotHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }

    if (history.length < 2) {
      // Just one point
      const y = padTop + plotHeight * (1 - (history[0].balance - minVal) / (maxVal - minVal));
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(padLeft + 10, y, 4, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // Map history points to coordinates
    const points = history.map((pt: ChartPoint, idx: number) => {
      const x = padLeft + (idx / Math.max(1, history.length - 1)) * plotWidth;
      const normalized = Math.min(1, Math.max(0, (pt.balance - minVal) / (maxVal - minVal)));
      const y = padTop + plotHeight * (1 - normalized);
      return { x, y, pt };
    });

    // Draw stepped line
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'miter';

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      ctx.strokeStyle = p2.pt.traderColor || '#22c55e';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      // Stepped interpolation: horizontal first, then vertical
      ctx.lineTo(p2.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Check if handover/fire point
      if (p2.pt.isHandoverPoint) {
        // Draw vertical dashed handover flag
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p2.x, padTop);
        ctx.lineTo(p2.x, padTop + plotHeight);
        ctx.stroke();

        // Marker pill
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText('FIRED', p2.x + 3, padTop + 25);
        ctx.fillStyle = p2.pt.traderColor || '#38bdf8';
        ctx.fillText(p2.pt.traderHandle, p2.x + 3, padTop + 12);
        ctx.restore();
      }
    }

    // Glow effect at latest point
    const latest = points[points.length - 1];
    ctx.save();
    ctx.shadowColor = latest.pt.traderColor || '#22c55e';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(latest.x, latest.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Floating Balance Bubble at latest point
    const bubbleX = latest.x + 10;
    const bubbleY = Math.max(padTop + 14, Math.min(height - padBottom - 10, latest.y));

    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY - 14, 68, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    const balFormatted = `$${currentBalance.toFixed(0)}`;
    ctx.fillText(balFormatted, bubbleX + 8, bubbleY + 2);
    ctx.restore();

    // Bottom labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('$38', padLeft, height - 12);

  }, [history, currentBalance]);

  // Aggregate phase stats for bottom bands
  const phaseStats = [
    { name: '@kai_blitz', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', pnl: '+$19' },
    { name: '@sol_dumpling', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40', pnl: '+$347' },
    { name: '@0xnora', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', pnl: '+$5,332' }
  ];

  return (
    <div className="cyber-card p-4 rounded-2xl flex flex-col justify-between h-[360px]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="text-[11px] font-mono-numbers text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-2">
          <span>Balance History</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>
        <div className="text-[11px] font-mono-numbers text-slate-500">
          23:15:13 / 24H
        </div>
      </div>

      {/* Main Canvas Graph */}
      <div className="relative flex-1 w-full my-2 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </div>

      {/* Bottom Timeline Band */}
      <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {phaseStats.map((p, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono-numbers font-semibold border ${p.color}`}
            >
              <span>{p.name}</span>
              <span className="font-bold">{p.pnl}</span>
            </div>
          ))}
        </div>
        <span className="text-[10px] font-mono-numbers text-slate-500 shrink-0">
          23:15
        </span>
      </div>
    </div>
  );
};
