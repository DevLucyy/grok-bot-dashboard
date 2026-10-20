# Squad Conclave & Architectural Decision: $15 Real-Tick Bybit Engine

- **Date**: 2026-10-20
- **Participants**: Blueprint (Architect), Pixel (UI/UX), Forge (Core Builder), Patch (Profiler), Shield (AppSec)
- **Complexity Score**: 4/5 (Architectural refactor from synthetic dice-roll generator to live tick-driven order lifecycle)

## 1. Executive Consensus
The synthetic `Math.random()` simulation tick is eliminated. The engine is re-architected into a **100% Real-Tick Forward Execution Engine**:
- **Bankroll**: Starts at **$15.00 USDT** (mirroring user's actual $5–$15 capital).
- **Position Sizing**: Micro-contracts (e.g. 0.001 BTC on 10x leverage, ~$8.20 margin; 0.1 SOL on 5x leverage, ~$3.60 margin).
- **Signal Triggers**: Derived strictly from live Bybit order book imbalance (best bid vs best ask) + EMA/momentum trend.
- **Position Lifecycle**:
  1. **Idle/Scanning**: Mastermind scans live Bybit ticks and order book depth.
  2. **Active Position**: Position opens at exact live Bybit market price. Ticks live every 50ms via WebSocket.
  3. **Live P&L**: Calculated as `(current_bybit_price - entry_price) * position_size - bybit_taker_fee`.
  4. **Exit on Real Touch**: Closes ONLY when Bybit's physical price touches Stop Loss or Take Profit.
  5. **Compounding Bankroll**: Realized gain or loss directly adjusts the $15.00 account balance.

## 2. Friction Points & Resolutions
- *Friction*: If the market is calm, an open position might take minutes or hours to hit TP/SL.
  - *Resolution*: Include realistic micro-scalp targets (e.g., 0.25% - 0.5% take profit, 0.2% stop loss) tuned for 1m - 5m volatility, plus an active position HUD displaying live trailing stop and breakeven adjustment.
- *Friction*: Liquidation risk on $15.00 account.
  - *Resolution*: Hard Sentinel handbrake locks maximum risk to $1.20 (8% of $15 bankroll) per trade, preventing account blow-out.

## 3. Owned Action Items
1. **Forge**: Implement `LivePosition` model and real-tick evaluation loop in `useTradingSimulation.ts`.
2. **Pixel**: Build `ActivePositionHUD.tsx` showing live tick-by-tick P&L ($ and %), entry, live price, SL, TP, and liquidation price.
3. **Patch**: Verify zero memory leaks on high-frequency WebSocket tick updates.
4. **Shield**: Enforce strict client-side validation and run `vibe-audit`.
