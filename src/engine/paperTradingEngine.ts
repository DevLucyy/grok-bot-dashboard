import { BybitFeedState } from './bybitClient';

export interface ActivePaperPosition {
  id: string;
  traderName: string;
  role: string;
  token: string;
  symbol: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  currentPrice: number;
  qty: number;
  sizeUsd: number;
  takeProfitPrice: number;
  stopLossPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  openedAt: number;
  strategyReason: string;
  status: 'OPEN' | 'TP_HIT' | 'SL_HIT' | 'TIMED_EXIT';
  exitPrice?: number;
  realizedPnl?: number;
}

export interface PaperTradeFill {
  id: string;
  time: string;
  trader: string;
  role: string;
  token: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  sizeUsd: number;
  pnl: number;
  pnlPercent: number;
  isWin: boolean;
  reason: 'TAKE_PROFIT' | 'STOP_LOSS' | 'TIME_EXIT';
  holdTimeSeconds: number;
  desc: string;
}

const TRADERS_ROSTER = [
  { name: 'BAZZ', role: 'SNIPE' },
  { name: 'OKKO', role: 'LADDER' },
  { name: 'LUX', role: 'BOOK' },
  { name: 'QUILO', role: 'ARB' },
  { name: 'FERRO', role: 'TRACK' },
  { name: 'TOMI', role: 'EXIT' }
];

export class PaperTradingStrategyEngine {
  private activePosition: ActivePaperPosition | null = null;
  private lastTradeClosedAt: number = 0;
  private cooldownMs: number = 4000; // 4s cooldown between positions
  private currentTraderIndex: number = 0;

  // Track real live prices for micro EMA calculation
  private priceHistory: Record<string, number[]> = {};

  public getActivePosition(): ActivePaperPosition | null {
    return this.activePosition;
  }

  /**
   * Evaluates the live market on every price tick from Bybit.
   * NO hardcoded win rate. Every cent of profit or loss is driven strictly by
   * real exchange price movements.
   */
  public evaluateTick(
    feed: BybitFeedState,
    currentBalance: number,
    onTradeClose: (fill: PaperTradeFill) => void
  ): ActivePaperPosition | null {
    const now = Date.now();

    // 1. If we have an active open position, update its real live PnL and check TP/SL
    if (this.activePosition) {
      const pos = this.activePosition;
      const ticker = feed.tickers[pos.symbol];
      if (!ticker || ticker.lastPrice <= 0) return pos;

      const currentPrice = ticker.lastPrice;
      pos.currentPrice = currentPrice;

      // Real math: (Current Price - Entry Price) * Quantity
      const grossPnl = pos.side === 'Long'
        ? (currentPrice - pos.entryPrice) * pos.qty
        : (pos.entryPrice - currentPrice) * pos.qty;

      // Realistic taker fee (0.055% open + 0.055% close = 0.11% round-trip)
      const fees = pos.sizeUsd * 0.0011;
      pos.unrealizedPnl = Number((grossPnl - fees).toFixed(2));
      pos.unrealizedPnlPercent = Number(((grossPnl / pos.sizeUsd) * 100).toFixed(2));

      // Check Take-Profit condition
      const isTakeProfitHit = pos.side === 'Long'
        ? currentPrice >= pos.takeProfitPrice
        : currentPrice <= pos.takeProfitPrice;

      // Check Stop-Loss condition
      const isStopLossHit = pos.side === 'Long'
        ? currentPrice <= pos.stopLossPrice
        : currentPrice >= pos.stopLossPrice;

      // Check Time-Stop condition (max hold time 55 seconds to prevent stagnation)
      const holdDuration = Math.round((now - pos.openedAt) / 1000);
      const isTimeExitHit = holdDuration >= 55;

      if (isTakeProfitHit || isStopLossHit || isTimeExitHit) {
        // CLOSE POSITION AT REAL MARKET PRICE
        const exitPrice = currentPrice;
        const realizedPnl = pos.unrealizedPnl;
        const isWin = realizedPnl > 0;
        const reason = isTakeProfitHit ? 'TAKE_PROFIT' : isStopLossHit ? 'STOP_LOSS' : 'TIME_EXIT';

        const fill: PaperTradeFill = {
          id: `fill_${pos.id}_${now}`,
          time: new Date().toTimeString().split(' ')[0],
          trader: pos.traderName,
          role: pos.role,
          token: pos.token,
          side: pos.side,
          entryPrice: pos.entryPrice,
          exitPrice,
          sizeUsd: pos.sizeUsd,
          pnl: realizedPnl,
          pnlPercent: pos.unrealizedPnlPercent,
          isWin,
          reason,
          holdTimeSeconds: holdDuration,
          desc: isTakeProfitHit
            ? `${pos.token} · Take Profit filled at $${exitPrice.toFixed(2)} (+${pos.unrealizedPnlPercent}%)`
            : isStopLossHit
            ? `${pos.token} · Stop Loss executed at $${exitPrice.toFixed(2)} (${pos.unrealizedPnlPercent}%)`
            : `${pos.token} · Time-based market exit at $${exitPrice.toFixed(2)}`
        };

        this.lastTradeClosedAt = now;
        this.activePosition = null;
        onTradeClose(fill);
        return null;
      }

      return pos;
    }

    // 2. If NO active position, evaluate live Bybit market signals for a genuine entry
    if (now - this.lastTradeClosedAt < this.cooldownMs) {
      return null;
    }

    if (currentBalance < 0.50) {
      return null; // Insufficient margin
    }

    // Candidate tokens with active Bybit live orderbooks
    const candidateSymbols = ['SOLUSDT', 'BTCUSDT', 'ETHUSDT', 'DOGEUSDT', 'SUIUSDT'];
    const tokenDisplayMap: Record<string, string> = {
      SOLUSDT: '$SOL',
      BTCUSDT: '$BTC',
      ETHUSDT: '$ETH',
      DOGEUSDT: '$DOGE',
      SUIUSDT: '$SUI'
    };

    for (const sym of candidateSymbols) {
      const ticker = feed.tickers[sym];
      const depth = feed.depth[sym] || feed.depth['BTCUSDT'];
      if (!ticker || ticker.lastPrice <= 0) continue;

      const currentPrice = ticker.lastPrice;

      // Update short-term price tick history
      if (!this.priceHistory[sym]) this.priceHistory[sym] = [];
      this.priceHistory[sym].push(currentPrice);
      if (this.priceHistory[sym].length > 20) this.priceHistory[sym].shift();

      const prices = this.priceHistory[sym];
      if (prices.length < 3) continue;

      const prevPrice = prices[prices.length - 2];
      const priceDelta = currentPrice - prevPrice;
      const imbalance = depth ? depth.imbalance : 0; // -1 to +1

      let shouldLong = false;
      let shouldShort = false;
      let reason = '';

      // Signal 1: Orderbook Buyer Pressure & Price Breakout
      if (imbalance > 0.08 && priceDelta >= 0) {
        shouldLong = true;
        reason = `Orderbook Bid Surge (+${Math.round(imbalance * 100)}%) · Upward Momentum`;
      } else if (imbalance < -0.08 && priceDelta <= 0) {
        shouldShort = true;
        reason = `Orderbook Ask Heavy (${Math.round(imbalance * 100)}%) · Downward Pressure`;
      } else if (Math.abs(priceDelta) > (currentPrice * 0.0003)) {
        // Signal 2: Micro Volatility Breakout
        if (priceDelta > 0) {
          shouldLong = true;
          reason = `Live Momentum Breakout over micro tick`;
        } else {
          shouldShort = true;
          reason = `Micro tick rejection`;
        }
      }

      if (shouldLong || shouldShort) {
        const side: 'Long' | 'Short' = shouldLong ? 'Long' : 'Short';
        // Position size: strictly 25% of current balance (min $0.50)
        const sizeUsd = Number(Math.max(0.50, currentBalance * 0.25).toFixed(2));
        const qty = Number((sizeUsd / currentPrice).toFixed(6));

        // Scalp targets: +0.65% TP, -0.45% SL (realistic crypto micro-scalp)
        const tpPct = 0.0065;
        const slPct = 0.0045;

        const takeProfitPrice = side === 'Long'
          ? Number((currentPrice * (1 + tpPct)).toFixed(4))
          : Number((currentPrice * (1 - tpPct)).toFixed(4));

        const stopLossPrice = side === 'Long'
          ? Number((currentPrice * (1 - slPct)).toFixed(4))
          : Number((currentPrice * (1 + slPct)).toFixed(4));

        const trader = TRADERS_ROSTER[this.currentTraderIndex % TRADERS_ROSTER.length];
        this.currentTraderIndex++;

        this.activePosition = {
          id: `pos_${now}_${Math.random().toString(36).substring(2, 6)}`,
          traderName: trader.name,
          role: trader.role,
          token: tokenDisplayMap[sym] || `$${sym}`,
          symbol: sym,
          side,
          entryPrice: currentPrice,
          currentPrice,
          qty,
          sizeUsd,
          takeProfitPrice,
          stopLossPrice,
          unrealizedPnl: 0,
          unrealizedPnlPercent: 0,
          openedAt: now,
          strategyReason: reason,
          status: 'OPEN'
        };

        return this.activePosition;
      }
    }

    return null;
  }

  public reset() {
    this.activePosition = null;
    this.lastTradeClosedAt = 0;
    this.priceHistory = {};
  }
}

export const paperStrategy = new PaperTradingStrategyEngine();
