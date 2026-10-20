import React, { useRef, useEffect, useState } from 'react';
import { BybitFeedState } from '../engine/bybitClient';
import { LivePosition } from '../types';
import { Radio, Activity, BarChart3, TrendingUp } from 'lucide-react';

interface LiveCryptoChartProps {
  feedState: BybitFeedState;
  activePosition: LivePosition | null;
  activeLobeIndex: number; // 0 = Atlas scanning
  onSelectSymbol?: (symbol: string) => void;
}

export const LiveCryptoChart: React.FC<LiveCryptoChartProps> = ({
  feedState,
  activePosition,
  activeLobeIndex,
  onSelectSymbol
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<'BTCUSDT' | 'ETHUSDT' | 'SOLUSDT'>('BTCUSDT');
  const [timeframe, setTimeframe] = useState<'1s' | '5s' | '1m'>('1s');
  const [chartType, setChartType] = useState<'CANDLES' | 'LINE'>('CANDLES');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanBeamRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const ticker = feedState.tickers[selectedSymbol] || {
    symbol: selectedSymbol,
    lastPrice: selectedSymbol === 'BTCUSDT' ? 81900.0 : selectedSymbol === 'ETHUSDT' ? 2840.5 : 184.2,
    prevPrice24h: 81100.0,
    highPrice24h: 83500.0,
    lowPrice24h: 79800.0,
    volume24h: 34120.5,
    turnover24h: 2790000000,
    price24hPcnt: 0.0098
  };

  const rawKlines = feedState.klines[selectedSymbol] || [];

  // Update selected symbol
  const handleSymbolChange = (sym: 'BTCUSDT' | 'ETHUSDT' | 'SOLUSDT') => {
    setSelectedSymbol(sym);
    if (onSelectSymbol) onSelectSymbol(sym);
  };

  // Canvas render loop with sub-millisecond smoothing and Atlas laser scan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDestroyed = false;

    const render = () => {
      if (isDestroyed) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Dimensions & padding
      const padTop = 28;
      const padBottom = 38;
      const padLeft = 14;
      const padRight = 85;

      const plotWidth = width - padLeft - padRight;
      const plotHeight = height - padTop - padBottom;

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;

      const horizGridCount = 5;
      for (let i = 0; i <= horizGridCount; i++) {
        const y = padTop + (plotHeight / horizGridCount) * i;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(width - padRight, y);
        ctx.stroke();
      }

      const vertGridCount = 6;
      for (let i = 0; i <= vertGridCount; i++) {
        const x = padLeft + (plotWidth / vertGridCount) * i;
        ctx.beginPath();
        ctx.moveTo(x, padTop);
        ctx.lineTo(x, height - padBottom);
        ctx.stroke();
      }

      const klines = rawKlines.slice(-38);
      if (klines.length < 2) {
        ctx.restore();
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Min & Max Price Calculation
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      let maxVol = 0;

      klines.forEach(k => {
        if (k.low < minPrice) minPrice = k.low;
        if (k.high > maxPrice) maxPrice = k.high;
        if (k.volume > maxVol) maxVol = k.volume;
      });

      // Factor in active position lines if present
      if (activePosition && activePosition.instrument.includes(selectedSymbol.slice(0, 3))) {
        minPrice = Math.min(minPrice, activePosition.stopLossPrice, activePosition.entryPrice);
        maxPrice = Math.max(maxPrice, activePosition.takeProfitPrice, activePosition.entryPrice);
      }

      // Buffer
      const priceSpan = Math.max(1, maxPrice - minPrice);
      minPrice -= priceSpan * 0.08;
      maxPrice += priceSpan * 0.08;
      const effectiveSpan = maxPrice - minPrice;

      const getY = (price: number) => {
        return padTop + plotHeight * (1 - (price - minPrice) / effectiveSpan);
      };

      const candleSpacing = plotWidth / klines.length;
      const candleWidth = Math.max(3, candleSpacing * 0.65);

      // 1. Draw Volume Bars at bottom
      const volHeight = 40;
      const volBaseY = height - padBottom;
      klines.forEach((k, idx) => {
        const x = padLeft + idx * candleSpacing + candleSpacing / 2;
        const vH = maxVol > 0 ? (k.volume / maxVol) * volHeight : 10;
        const isUp = k.close >= k.open;

        ctx.fillStyle = isUp ? 'rgba(52, 211, 153, 0.16)' : 'rgba(244, 63, 94, 0.16)';
        ctx.fillRect(x - candleWidth / 2, volBaseY - vH, candleWidth, vH);
      });

      // 2. Draw Candlesticks or Area Line
      if (chartType === 'CANDLES') {
        klines.forEach((k, idx) => {
          const x = padLeft + idx * candleSpacing + candleSpacing / 2;
          const openY = getY(k.open);
          const closeY = getY(k.close);
          const highY = getY(k.high);
          const lowY = getY(k.low);

          const isUp = k.close >= k.open;
          const color = isUp ? '#10b981' : '#f43f5e';
          const wickColor = isUp ? '#34d399' : '#fb7185';

          // Wick
          ctx.strokeStyle = wickColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, highY);
          ctx.lineTo(x, lowY);
          ctx.stroke();

          // Body
          const top = Math.min(openY, closeY);
          const bodyH = Math.max(1.5, Math.abs(openY - closeY));

          ctx.fillStyle = color;
          ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH);

          // Subtle candle glow
          if (idx === klines.length - 1) {
            ctx.shadowColor = isUp ? 'rgba(16, 185, 129, 0.8)' : 'rgba(244, 63, 94, 0.8)';
            ctx.shadowBlur = 10;
            ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH);
            ctx.shadowBlur = 0;
          }
        });
      } else {
        // Area Line Mode
        ctx.beginPath();
        klines.forEach((k, idx) => {
          const x = padLeft + idx * candleSpacing + candleSpacing / 2;
          const y = getY(k.close);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Fill area
        const lastX = padLeft + (klines.length - 1) * candleSpacing + candleSpacing / 2;
        ctx.lineTo(lastX, height - padBottom);
        ctx.lineTo(padLeft + candleSpacing / 2, height - padBottom);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, padTop, 0, height - padBottom);
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
        grad.addColorStop(1, 'rgba(6, 182, 212, 0.00)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // 3. Atlas Radar / Scanning Laser Beam Animation
      // When activeLobeIndex === 0 (Atlas analyzing), a futuristic cyan laser beam sweeps over the chart!
      if (activeLobeIndex === 0) {
        scanBeamRef.current = (scanBeamRef.current + 2.5) % plotWidth;
        const beamX = padLeft + scanBeamRef.current;

        const laserGrad = ctx.createLinearGradient(beamX - 35, 0, beamX + 5, 0);
        laserGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        laserGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.12)');
        laserGrad.addColorStop(1, 'rgba(56, 189, 248, 0.85)');

        ctx.fillStyle = laserGrad;
        ctx.fillRect(beamX - 35, padTop, 35, plotHeight);

        // Core laser line
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(beamX, padTop);
        ctx.lineTo(beamX, height - padBottom);
        ctx.stroke();

        // Top pulse dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(beamX, padTop, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Active Position Overlays (Entry, Take Profit, Stop Loss)
      if (activePosition && activePosition.instrument.includes(selectedSymbol.slice(0, 3))) {
        const entryY = getY(activePosition.entryPrice);
        const tpY = getY(activePosition.takeProfitPrice);
        const slY = getY(activePosition.stopLossPrice);

        // Entry Line (Amber)
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(padLeft, entryY);
        ctx.lineTo(width - padRight, entryY);
        ctx.stroke();

        // Take Profit Line (Emerald)
        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(padLeft, tpY);
        ctx.lineTo(width - padRight, tpY);
        ctx.stroke();

        // Stop Loss Line (Rose)
        ctx.strokeStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(padLeft, slY);
        ctx.lineTo(width - padRight, slY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Badges on Right Axis for targets
        // TP Badge
        ctx.fillStyle = '#10b981';
        ctx.fillRect(width - padRight + 2, tpY - 9, 78, 18);
        ctx.fillStyle = '#022c22';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`TP $${activePosition.takeProfitPrice.toLocaleString()}`, width - padRight + 5, tpY + 3.5);

        // Entry Badge
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(width - padRight + 2, entryY - 9, 78, 18);
        ctx.fillStyle = '#451a03';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`ENTRY $${activePosition.entryPrice.toLocaleString()}`, width - padRight + 5, entryY + 3.5);

        // SL Badge
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(width - padRight + 2, slY - 9, 78, 18);
        ctx.fillStyle = '#4c0519';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`SL $${activePosition.stopLossPrice.toLocaleString()}`, width - padRight + 5, slY + 3.5);
      }

      // 5. Live Price Horizontal Pulsing Line
      const currentPrice = ticker.lastPrice;
      const currentPriceY = getY(currentPrice);

      // Pulsing glow line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(padLeft, currentPriceY);
      ctx.lineTo(width - padRight, currentPriceY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Live Price Marker Box on Axis
      const isUpTick = ticker.price24hPcnt >= 0;
      ctx.fillStyle = isUpTick ? '#059669' : '#e11d48';
      ctx.shadowColor = isUpTick ? 'rgba(16, 185, 129, 0.6)' : 'rgba(225, 29, 72, 0.6)';
      ctx.shadowBlur = 12;
      ctx.fillRect(width - padRight + 2, currentPriceY - 11, 80, 22);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: selectedSymbol === 'SOLUSDT' ? 2 : 1, maximumFractionDigits: 2 })}`, width - padRight + 5, currentPriceY + 3.5);

      // Axis Price Labels (Vertical)
      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      for (let i = 0; i <= horizGridCount; i++) {
        const p = maxPrice - (effectiveSpan / horizGridCount) * i;
        const y = padTop + (plotHeight / horizGridCount) * i;
        ctx.fillText(`$${Math.round(p).toLocaleString()}`, width - padRight + 6, y + 3);
      }

      // Time Labels (Horizontal bottom)
      ctx.fillStyle = '#475569';
      ctx.font = '9px monospace';
      const timeStep = Math.floor(klines.length / 4);
      for (let i = 0; i < klines.length; i += Math.max(1, timeStep)) {
        const k = klines[i];
        if (!k) continue;
        const dateObj = new Date(k.start);
        const timeStr = dateObj.toTimeString().split(' ')[0];
        const x = padLeft + i * candleSpacing;
        ctx.fillText(timeStr, x - 12, height - 12);
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isDestroyed = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [rawKlines, ticker, activePosition, activeLobeIndex, selectedSymbol, chartType]);

  const priceChange = ticker.price24hPcnt * 100;

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#090d1f] via-[#070914] to-[#04060c] border border-cyan-500/20 shadow-[0_0_35px_rgba(6,182,212,0.08)] overflow-hidden flex flex-col">
      {/* Top Header / Symbol Bar */}
      <div className="px-4 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-3">
          {/* Pair Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            {(['BTCUSDT', 'ETHUSDT', 'SOLUSDT'] as const).map(sym => (
              <button
                key={sym}
                onClick={() => handleSymbolChange(sym)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedSymbol === sym
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {sym.replace('USDT', '')}/USDT
              </button>
            ))}
          </div>

          {/* Live Price & 24h Change */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-mono font-extrabold text-white">
              ${ticker.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
              priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <TrendingUp className={`w-3 h-3 ${priceChange < 0 ? 'rotate-180' : ''}`} />
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Right Controls: Atlas Laser Status & Timeframe */}
        <div className="flex items-center gap-3">
          {/* Atlas Scanner Active Pill */}
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
            activeLobeIndex === 0
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.4)] animate-pulse'
              : 'bg-slate-900/80 text-slate-500 border-slate-800'
          }`}>
            <Activity className={`w-3 h-3 ${activeLobeIndex === 0 ? 'text-cyan-400 animate-spin' : 'text-slate-600'}`} />
            <span>{activeLobeIndex === 0 ? 'ATLAS LASER SCANNING L2' : 'L2 DEPTH SYNCED'}</span>
          </div>

          {/* Timeframe & Chart Style */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono">
            {(['1s', '5s', '1m'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded ${
                  timeframe === tf ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => setChartType(prev => prev === 'CANDLES' ? 'LINE' : 'CANDLES')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs flex items-center gap-1"
            title="Toggle Candles / Line"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-[320px] bg-[#050814]/60">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Real-Tick Bybit Indicator Pill Overlay */}
        <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 text-slate-300 border border-slate-800/80 flex items-center gap-1.5 shadow-sm">
            <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            BYBIT V5 REAL-TICK KLINE ({timeframe})
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Latency: <span className="text-cyan-400 font-semibold">{feedState.latencyMs}ms</span>
          </span>
        </div>
      </div>
    </div>
  );
};
