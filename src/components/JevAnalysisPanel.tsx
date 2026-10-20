import React, { useRef, useEffect } from 'react';
import { CyberCornerBrackets } from './GrokJevAvatars';
import { JevToken, WATCHLIST_TOKENS } from '../engine/grokJevEngine';

interface JevAnalysisPanelProps {
  token: JevToken;
  selectedIndex: number;
  onSelectToken: (index: number) => void;
  scannedCount: number;
}

export const JevAnalysisPanel: React.FC<JevAnalysisPanelProps> = ({
  token,
  selectedIndex,
  onSelectToken,
  scannedCount
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

    const padTop = 26;
    const padBottom = 30;
    const padLeft = 10;
    const padRight = 60;
    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    // Background subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (plotHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }

    // Dynamic price scale based on selected token
    const baseP = token.rawPrice;
    const candleCount = 28;
    const candleSpacing = plotWidth / candleCount;
    const candleWidth = Math.max(3, candleSpacing * 0.55);

    // Deterministic realistic candlestick series
    const seed = token.symbol.charCodeAt(1) || 75;
    const candles = Array.from({ length: candleCount }, (_, i) => {
      const cycle = Math.sin((i + seed) * 0.35);
      const trend = (i / candleCount) * 0.12 - 0.04;
      const noise = Math.sin((i * 1.7) + seed) * 0.05;
      const pct = cycle * 0.08 + trend + noise;

      const cOpen = baseP * (1 + pct);
      const cClose = baseP * (1 + pct + (Math.sin(i * 3 + seed) * 0.03));
      const cHigh = Math.max(cOpen, cClose) + baseP * 0.025;
      const cLow = Math.min(cOpen, cClose) - baseP * 0.022;

      return { o: cOpen, c: cClose, h: cHigh, l: cLow };
    });

    const allPrices = candles.flatMap(c => [c.h, c.l]);
    const minP = Math.min(...allPrices) * 0.985;
    const maxP = Math.max(...allPrices) * 1.015;

    const getY = (price: number) => {
      const denom = maxP - minP || 1;
      return padTop + plotHeight * (1 - (price - minP) / denom);
    };

    // Draw Candlesticks
    candles.forEach((c, i) => {
      const x = padLeft + i * candleSpacing + candleSpacing / 2;
      const isUp = c.c >= c.o;
      const color = isUp ? '#10b981' : '#f43f5e';

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, getY(c.h));
      ctx.lineTo(x, getY(c.l));
      ctx.stroke();

      // Body
      const top = Math.min(getY(c.o), getY(c.c));
      const bodyH = Math.max(2, Math.abs(getY(c.o) - getY(c.c)));
      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH);
    });

    // Format helper for real prices
    const formatAxisP = (p: number) => {
      if (p < 0.0001) return `$${p.toFixed(7)}`;
      if (p < 1) return `$${p.toFixed(4)}`;
      if (p > 1000) return `$${Math.round(p).toLocaleString()}`;
      return `$${p.toFixed(2)}`;
    };

    // BUY Overlay Tag at Dip (around index 9)
    const buyIdx = 9;
    const buyX = padLeft + buyIdx * candleSpacing + candleSpacing / 2;
    const buyY = getY(candles[buyIdx].l) + 14;

    ctx.fillStyle = '#065f46';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(buyX - 44, buyY, 88, 15, 4);
    } else {
      ctx.rect(buyX - 44, buyY, 88, 15);
    }
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'bold 8.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`BUY ${formatAxisP(candles[buyIdx].l)} · LUX`, buyX, buyY + 10.5);

    // SELL Overlay Tag at Peak (around index 22)
    const sellIdx = 22;
    const sellX = padLeft + sellIdx * candleSpacing + candleSpacing / 2;
    const sellY = getY(candles[sellIdx].h) - 20;

    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(sellX - 58, sellY, 116, 15, 4);
    } else {
      ctx.rect(sellX - 58, sellY, 116, 15);
    }
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 8.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`SELL ${formatAxisP(candles[sellIdx].h)} · +$4.80`, sellX, sellY + 10.5);

    // Current Price Dotted Line & Yellow Tag
    const curP = candles[candles.length - 1].c;
    const curY = getY(curP);

    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, curY);
    ctx.lineTo(width - padRight, curY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Yellow Price Tag on right axis
    ctx.fillStyle = '#eab308';
    ctx.fillRect(width - padRight + 2, curY - 7, 56, 14);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(formatAxisP(curP).replace('$', ''), width - padRight + 5, curY + 3.5);

    // Right Axis Price Ticks
    const axisTicks = [maxP * 0.98, (maxP + minP) / 2, minP * 1.02];
    ctx.fillStyle = '#64748b';
    ctx.font = '8px monospace';
    axisTicks.forEach(p => {
      const y = getY(p);
      ctx.fillText(formatAxisP(p), width - padRight + 4, y + 2.5);
    });
  }, [token]);

  return (
    <div className="jev-panel p-3.5 flex flex-col justify-between h-full relative overflow-hidden">
      <CyberCornerBrackets />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-yellow-400/20 pb-2 text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-black text-yellow-400 tracking-wider">JEV · ANALYSIS</span>
        </div>
        <span className="text-[9px] text-slate-400 font-semibold">{scannedCount.toLocaleString()} scanned</span>
      </div>

      {/* Active Token Stats Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-2 pb-2 border-b border-yellow-400/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-white text-xs font-mono shadow-inner bot-bob">
            {token.initials}
          </div>
          <div>
            <div className="text-sm font-black text-white font-mono leading-none flex items-center gap-2">
              {token.symbol}
            </div>
            <div className="text-[8px] font-mono text-slate-400 mt-0.5">
              1s · live feed · desk position
            </div>
          </div>
        </div>

        {/* Stats Grid with Real Token Figures */}
        <div className="flex items-center gap-3 sm:gap-4 text-[9px] font-mono flex-wrap">
          <div>
            <div className="text-slate-500 uppercase">Market cap</div>
            <div className="font-bold text-white">{token.mcap}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase">Price</div>
            <div className="font-bold text-white">{token.price}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase">24h change</div>
            <div className={`font-bold ${token.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {token.change24h >= 0 ? '▲' : '▼'} {Math.abs(token.change24h).toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-slate-500 uppercase">24h Vol</div>
            <div className="font-bold text-white">{token.vol24h}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase">Liquidity</div>
            <div className="font-bold text-white">{token.liquidity}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase">Holders</div>
            <div className="font-bold text-white">{token.holders}</div>
          </div>
        </div>
      </div>

      {/* Candlestick Chart Area with Scanning Laser Sweep */}
      <div className="relative h-[180px] w-full my-1 overflow-hidden">
        {/* Animated Vertical Laser Sweep Line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-75 shadow-[0_0_10px_rgba(6,182,212,0.8)] pointer-events-none z-20 animate-[scanLaserH_4s_ease-in-out_infinite]" />
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* 14 Sparkline Watchlist Carousel below chart */}
      <div className="mt-2 pt-2 border-t border-yellow-400/20">
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 overflow-x-auto">
          {WATCHLIST_TOKENS.map((tk, idx) => {
            const isSelected = selectedIndex === idx;
            const isUp = tk.change24h >= 0;
            return (
              <button
                key={tk.symbol}
                onClick={() => onSelectToken(idx)}
                className={`p-1 rounded flex flex-col items-center justify-between text-center transition-all ${
                  isSelected
                    ? 'border-2 border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(250,204,21,0.3)] scale-105'
                    : 'border border-slate-800/80 bg-slate-950/60 hover:border-slate-600'
                }`}
              >
                <span className={`text-[8px] font-mono font-bold truncate max-w-full ${isSelected ? 'text-yellow-400' : 'text-slate-400'}`}>
                  {tk.symbol}
                </span>
                <svg width="28" height="12" viewBox="0 0 28 12" className="my-0.5">
                  <path
                    d={isUp ? 'M2 10 L8 7 L14 8 L20 4 L26 2' : 'M2 2 L8 5 L14 4 L20 8 L26 10'}
                    fill="none"
                    stroke={isUp ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.2"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
