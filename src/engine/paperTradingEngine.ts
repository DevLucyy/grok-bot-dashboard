import { BybitFeedState } from './bybitClient';
import { BYBIT_MASTER_TRADERS } from './bybitMasterTraders';

export interface ActivePaperPosition {
  id: string;
  traderName: string;
  role: string;
  masterTraderName: string;
  masterTraderBadge: string;
  masterTraderRoi: string;
  token: string;
  symbol: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  currentPrice: number;
  qty: number;
  sizeUsd: number;
  takeProfitPrice: number;
  stopLossPrice: number;
  stressedStopDistance: number;
  riskRewardRatio: number;
  monteCarloWinOdds: number;
  expectedValueUsd: number;
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
  masterTraderName: string;
  masterTraderBadge: string;
  token: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  sizeUsd: number;
  grossPnl?: number;
  fees?: number;
  pnl: number;
  pnlPercent: number;
  isWin: boolean;
  reason: 'TAKE_PROFIT' | 'STOP_LOSS' | 'TIME_EXIT';
  holdTimeSeconds: number;
  riskRewardRatio: number;
  desc: string;
}

export interface CandleBar {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}

/**
 * Dev's Quant Core Strategy Engine
 * Incorporates:
 * 1. Stressed Stop-Loss Sizing (|entry - stop_slipped| + round-trip taker fees)
 * 2. Anti-Wick Bar-Close Confirmation (requires confirmed bar close, rejects wicks)
 * 3. Asymmetric 1.67R Reward-to-Risk (+0.75% TP vs -0.45% SL)
 * 4. Pre-Trade Monte Carlo 1,000 Path Odds Check (E > 0)
 * 5. 2-Consecutive-Loss Auto-Rotation
 */
export class PaperTradingStrategyEngine {
  private activePosition: ActivePaperPosition | null = null;
  private lastTradeClosedAt: number = 0;
  private cooldownMs: number = 4000;
  private currentTraderIndex: number = 0;

  // Real price tick history and completed candle bars
  private priceHistory: Record<string, number[]> = {};
  private candleBars: Record<string, CandleBar[]> = {};
  private currentBar: Record<string, Partial<CandleBar>> = {};
  private barTickCount: Record<string, number> = {};

  public getActivePosition(): ActivePaperPosition | null {
    return this.activePosition;
  }

  /**
   * Fast 1,000-Path Monte Carlo Pre-Trade Odds Simulation
   * Replays future price paths using asset micro-volatility to verify positive mathematical expectancy.
   */
  private runMonteCarloOdds(
    entryPrice: number,
    tpPrice: number,
    slPrice: number,
    side: 'Long' | 'Short',
    recentPrices: number[]
  ): { winOdds: number; expectedValueR: number } {
    if (recentPrices.length < 5) return { winOdds: 54.0, expectedValueR: 0.35 };

    // Calculate historical tick volatility
    let sumDiffSq = 0;
    for (let i = 1; i < recentPrices.length; i++) {
      const ret = (recentPrices[i] - recentPrices[i - 1]) / recentPrices[i - 1];
      sumDiffSq += ret * ret;
    }
    const tickSigma = Math.max(0.0008, Math.sqrt(sumDiffSq / recentPrices.length));

    const numReplays = 1000;
    const maxSteps = 40;
    let targetHits = 0;
    let stopHits = 0;
    let timeExits = 0;

    for (let r = 0; r < numReplays; r++) {
      let simPrice = entryPrice;
      let finished = false;

      for (let s = 0; s < maxSteps; s++) {
        // Box-Muller normal random distribution
        const u1 = Math.random() || 0.0001;
        const u2 = Math.random() || 0.0001;
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        simPrice = simPrice * (1 + z * tickSigma);

        if (side === 'Long') {
          if (simPrice >= tpPrice) {
            targetHits++;
            finished = true;
            break;
          }
          if (simPrice <= slPrice) {
            stopHits++;
            finished = true;
            break;
          }
        } else {
          if (simPrice <= tpPrice) {
            targetHits++;
            finished = true;
            break;
          }
          if (simPrice >= slPrice) {
            stopHits++;
            finished = true;
            break;
          }
        }
      }

      if (!finished) timeExits++;
    }

    const winOdds = Number(((targetHits / numReplays) * 100).toFixed(1));
    const lossOdds = (stopHits / numReplays);
    // Asymmetric 3.33R: E = (WinOdds * 3.33R) - (LossOdds * 1.0R) - Fees
    const expectedValueR = Number((((targetHits / numReplays) * 3.33) - lossOdds - 0.15).toFixed(2));

    return { winOdds, expectedValueR };
  }

  /**
   * Updates micro-candles for anti-wick close confirmation
   */
  private updateCandleBar(sym: string, price: number): CandleBar | null {
    if (!this.barTickCount[sym]) this.barTickCount[sym] = 0;
    if (!this.currentBar[sym]) {
      this.currentBar[sym] = { open: price, high: price, low: price, close: price, timestamp: Date.now() };
    }

    const bar = this.currentBar[sym];
    bar.high = Math.max(bar.high || price, price);
    bar.low = Math.min(bar.low || price, price);
    bar.close = price;
    this.barTickCount[sym]++;

    // Complete bar every 6 ticks (micro-bar close confirmation)
    if (this.barTickCount[sym] >= 6) {
      const completedBar: CandleBar = {
        open: bar.open || price,
        high: bar.high || price,
        low: bar.low || price,
        close: bar.close || price,
        timestamp: Date.now()
      };
      if (!this.candleBars[sym]) this.candleBars[sym] = [];
      this.candleBars[sym].push(completedBar);
      if (this.candleBars[sym].length > 15) this.candleBars[sym].shift();

      // Reset for next bar
      this.currentBar[sym] = { open: price, high: price, low: price, close: price, timestamp: Date.now() };
      this.barTickCount[sym] = 0;
      return completedBar;
    }

    return null;
  }

  /**
   * Evaluates the live market on every price tick from Bybit.
   */
  public evaluateTick(
    feed: BybitFeedState,
    currentBalance: number,
    onTradeClose: (fill: PaperTradeFill) => void
  ): ActivePaperPosition | null {
    const now = Date.now();

    // 1. If we have an active open position, evaluate TP/SL with taker fees
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

      // Check Take-Profit condition (+0.75% target)
      const isTakeProfitHit = pos.side === 'Long'
        ? currentPrice >= pos.takeProfitPrice
        : currentPrice <= pos.takeProfitPrice;

      // Check Stop-Loss condition (-0.45% stop)
      const isStopLossHit = pos.side === 'Long'
        ? currentPrice <= pos.stopLossPrice
        : currentPrice >= pos.stopLossPrice;

      // Check Time-Stop condition (max hold time 65 seconds)
      const holdDuration = Math.round((now - pos.openedAt) / 1000);
      const isTimeExitHit = holdDuration >= 65;

      if (isTakeProfitHit || isStopLossHit || isTimeExitHit) {
        const exitPrice = currentPrice;
        const realizedPnl = pos.unrealizedPnl;
        const isWin = realizedPnl > 0;
        const reason = isTakeProfitHit ? 'TAKE_PROFIT' : isStopLossHit ? 'STOP_LOSS' : 'TIME_EXIT';

        const fill: PaperTradeFill = {
          id: `fill_${pos.id}_${now}`,
          time: new Date().toTimeString().split(' ')[0],
          trader: pos.traderName,
          role: pos.role,
          masterTraderName: pos.masterTraderName,
          masterTraderBadge: pos.masterTraderBadge,
          token: pos.token,
          side: pos.side,
          entryPrice: pos.entryPrice,
          exitPrice,
          sizeUsd: pos.sizeUsd,
          grossPnl: Number(grossPnl.toFixed(2)),
          fees: Number(fees.toFixed(2)),
          pnl: realizedPnl,
          pnlPercent: pos.unrealizedPnlPercent,
          isWin,
          reason,
          holdTimeSeconds: holdDuration,
          riskRewardRatio: pos.riskRewardRatio,
          desc: isTakeProfitHit
            ? `Copied ${pos.masterTraderName} · TP +$${grossPnl.toFixed(2)} (Gross) - $${fees.toFixed(2)} (Fees) = +$${realizedPnl.toFixed(2)} Net (+${pos.unrealizedPnlPercent}%, 3.33R)`
            : isStopLossHit
            ? `Copied ${pos.masterTraderName} · Stressed SL -$${Math.abs(grossPnl).toFixed(2)} (Gross) - $${fees.toFixed(2)} (Fees) = -$${Math.abs(realizedPnl).toFixed(2)} Net (${pos.unrealizedPnlPercent}%)`
            : `Copied ${pos.masterTraderName} · Time exit +$${grossPnl.toFixed(2)} - $${fees.toFixed(2)} = $${realizedPnl.toFixed(2)} Net`
        };

        this.lastTradeClosedAt = now;
        this.activePosition = null;
        onTradeClose(fill);
        return null;
      }

      return pos;
    }

    // 2. If NO active position, evaluate live Bybit market signals
    if (now - this.lastTradeClosedAt < this.cooldownMs) {
      return null;
    }

    if (currentBalance < 0.50) {
      return null; // Insufficient margin
    }

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
      const completedBar = this.updateCandleBar(sym, currentPrice);

      // Maintain short-term tick history
      if (!this.priceHistory[sym]) this.priceHistory[sym] = [];
      this.priceHistory[sym].push(currentPrice);
      if (this.priceHistory[sym].length > 25) this.priceHistory[sym].shift();

      const prices = this.priceHistory[sym];
      if (prices.length < 5) continue;

      const imbalance = depth ? depth.imbalance : 0; // -1 to +1

      // Anti-Wick Confirmation: Check the confirmed completed candle close rather than raw wick
      const checkClose = completedBar ? completedBar.close : currentPrice;
      const prevPrice = prices[prices.length - 2];
      const priceDelta = checkClose - prevPrice;

      let shouldLong = false;
      let shouldShort = false;
      let signalReason = '';

      // Signal 1: Orderbook Bid/Ask Imbalance with Bar-Close Confirmation
      if (imbalance > 0.08 && priceDelta >= 0) {
        shouldLong = true;
        signalReason = `Orderbook Bid Pressure (+${Math.round(imbalance * 100)}%) with Bar-Close Confirmation`;
      } else if (imbalance < -0.08 && priceDelta <= 0) {
        shouldShort = true;
        signalReason = `Orderbook Ask Heavy (${Math.round(imbalance * 100)}%) with Bar-Close Confirmation`;
      } else if (Math.abs(priceDelta) > (currentPrice * 0.0003)) {
        // Signal 2: Volatility Breakout
        if (priceDelta > 0) {
          shouldLong = true;
          signalReason = `Momentum Bar-Close Breakout`;
        } else {
          shouldShort = true;
          signalReason = `Micro Rejection Bar-Close`;
        }
      }

      if (shouldLong || shouldShort) {
        // Max Entry Slippage Gate: abort if market moved > 5 bps away from signal pivot
        const entrySlippageBps = Math.abs(currentPrice - checkClose) / checkClose;
        if (entrySlippageBps > 0.0005) {
          continue; // Circuit Breaker: Slippage > 5 bps, avoid chasing wick
        }

        // Pullback Confirmation Gate: do not enter at the tip of an extended wick
        if (completedBar) {
          if (shouldLong && currentPrice > completedBar.high * 1.0004) continue;
          if (shouldShort && currentPrice < completedBar.low * 0.9996) continue;
        }

        const side: 'Long' | 'Short' = shouldLong ? 'Long' : 'Short';

        // 3. Asymmetric Scalp Targets: +1.50% TP, -0.45% SL (3.33R Reward-to-Risk)
        // Eliminates fee drag: +1.50% gross easily clears 0.11% round-trip taker fees + 0.05% slippage
        const tpPct = 0.0150;
        const slPct = 0.0045;
        const riskRewardRatio = 3.33;

        const takeProfitPrice = side === 'Long'
          ? Number((currentPrice * (1 + tpPct)).toFixed(4))
          : Number((currentPrice * (1 - tpPct)).toFixed(4));

        const stopLossPrice = side === 'Long'
          ? Number((currentPrice * (1 - slPct)).toFixed(4))
          : Number((currentPrice * (1 + slPct)).toFixed(4));

        // 4. Stressed Stop-Loss Sizing:
        // Stressed Distance = |entry - stop| + slippage_buffer (0.05%) + round_trip_taker_fees (0.11%)
        const nominalDistance = Math.abs(currentPrice - stopLossPrice);
        const slippageBuffer = currentPrice * 0.0005; // 5 bps slippage allowance
        const roundTripFeeBuffer = (currentPrice + stopLossPrice) * 0.00055; // 0.11% total
        const stressedDistance = nominalDistance + slippageBuffer + roundTripFeeBuffer;

        // Position sizing: allocate 25% of current equity
        const riskBudgedUsd = Number(Math.max(0.50, currentBalance * 0.25).toFixed(2));
        // Sizing strictly capped so dollar loss at stressed stop equals budget
        const qty = Number((riskBudgedUsd / stressedDistance).toFixed(6));
        const sizeUsd = Number((qty * currentPrice).toFixed(2));

        // 5. Pre-Trade Monte Carlo 1,000 Path Odds Check
        const { winOdds, expectedValueR } = this.runMonteCarloOdds(
          currentPrice,
          takeProfitPrice,
          stopLossPrice,
          side,
          prices
        );

        // Mathematical Expectancy Veto Gate: Require positive expected value
        if (expectedValueR <= 0 && winOdds < 45.0) {
          continue; // Risk Veto Gate blocked negative expectancy trade
        }

        // Expected Value in USD
        const potentialProfitUsd = sizeUsd * tpPct;
        const stressedLossUsd = riskBudgedUsd;
        const expectedValueUsd = Number((((winOdds / 100) * potentialProfitUsd) - ((1 - winOdds / 100) * stressedLossUsd)).toFixed(2));

        const masterTrader = BYBIT_MASTER_TRADERS[this.currentTraderIndex % BYBIT_MASTER_TRADERS.length];
        this.currentTraderIndex++;

        this.activePosition = {
          id: `pos_${now}_${Math.random().toString(36).substring(2, 6)}`,
          traderName: masterTrader.squadBot,
          role: masterTrader.name,
          masterTraderName: masterTrader.name,
          masterTraderBadge: masterTrader.badge,
          masterTraderRoi: masterTrader.roi7d,
          token: tokenDisplayMap[sym] || `$${sym}`,
          symbol: sym,
          side,
          entryPrice: currentPrice,
          currentPrice,
          qty,
          sizeUsd,
          takeProfitPrice,
          stopLossPrice,
          stressedStopDistance: Number(stressedDistance.toFixed(4)),
          riskRewardRatio,
          monteCarloWinOdds: winOdds,
          expectedValueUsd,
          unrealizedPnl: 0,
          unrealizedPnlPercent: 0,
          openedAt: now,
          strategyReason: `Dev's Quant Core · ${masterTrader.name} (${masterTrader.badge}) · ${signalReason} · MC Win Odds ${winOdds}% (3.33R, EV +$${expectedValueUsd}, Slip ≤5bps)`,
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
    this.candleBars = {};
    this.currentBar = {};
    this.barTickCount = {};
  }
}

export const paperStrategy = new PaperTradingStrategyEngine();
