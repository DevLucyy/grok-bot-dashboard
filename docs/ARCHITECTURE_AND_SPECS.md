# Grok Bot Trading Engine: Architecture, Data & Technical Specifications

> **Session ID**: `fbbefb03-c012-4cd6-882c-39f6295a6918`  
> **Target Project**: `grok-bot-dashboard`  
> **Live Production URL**: [https://grok-bot-dashboard.pages.dev](https://grok-bot-dashboard.pages.dev)  
> **Date**: October 18–20, 2026  

---

## 1. Executive Summary

This archive preserves the entire design, data, execution logic, and decision records for the **Grok Bot Trading System**. The project evolved through three distinct evolutionary phases:
1. **Phase 1: Multi-Agent AI Visual Trading Desk (MVP)**:
   - 7 specialized desk agents (Atlas, Lumen, Hydra, Sentinel, Hephaestus, Mnemosyne, Hermes).
   - Neural Evolution XP Core with rank progression (Novice -> Grandmaster Quant).
   - Cyberpunk glassmorphic UI matching the reference terminal aesthetics.
2. **Phase 2: Live Real-Market Connectivity (Bybit V5 Perps)**:
   - Replaced static feeds with live Bybit V5 Linear Perpetual WebSockets (`wss://stream.bybit.com`, `wss://stream-testnet.bybit.com`).
   - Real-time Order Book Level 2 depth streaming for BTCUSDT, ETHUSDT, and SOLUSDT.
   - Live Order Book Imbalance (OBI) metric calculation.
3. **Phase 3: $15 Real-Tick Forward Execution Engine (Agency Mode)**:
   - Elimination of synthetic `Math.random()` simulation ticks and dice rolls.
   - Initialized bankroll to exact user capital: **$15.00** with a **$45.00** (3x compound) milestone.
   - Real micro-contract math: 0.001 BTC on 10x leverage ($8.20 margin commitment per trade).
   - Physical price-touch SL (-0.25%, -$0.25) and TP (+0.60%, +$0.49) with 0.055% taker fees deducted.
   - Interactive Active Position HUD with live unrealized P&L, SL/TP progress slider, and manual market exit.

---

## 2. Quantitative & Mathematical Framework

### A. $15 Micro-Contract Sizing & Margin Math
For an account starting at **$15.00**:
- **Leverage**: $10\times$ isolated leverage.
- **Contract Size**: $0.001\text{ BTC}$ per position.
- **Notional Position Value**: $\approx \$81.90\text{ USD}$ (assuming BTC @ $\$81,900$).
- **Margin Required**:
  $$\text{Margin Used} = \frac{\text{Notional Value}}{\text{Leverage}} = \frac{\$81.90}{10} = \$8.19\text{ USD}$$
  *(Accounts for ~54% of total equity, leaving \$6.81 free buffer to avoid margin call).*
- **Taker Execution Fee**: $0.055\%$ entry + $0.055\%$ exit $\approx \$0.045\text{ USD}$ round-trip.

### B. Exit Criteria (Physical Price Touch)
- **Take Profit (TP)**: $+0.60\%$ price move from entry:
  $$\Delta P = P_{\text{entry}} \times 0.006 \approx +\$491.40 \implies \text{Net Gain} \approx +\$0.49\text{ USD}$$
- **Stop Loss (SL)**: $-0.25\%$ price move from entry:
  $$\Delta P = P_{\text{entry}} \times 0.0025 \approx -\$204.75 \implies \text{Net Loss} \approx -\$0.25\text{ USD}$$
- **Risk-to-Reward Ratio ($R:R$)**:
  $$\frac{\text{Reward}}{\text{Risk}} = \frac{0.60\%}{0.25\%} = 2.4:1$$
- **Liquidation Boundary**: $9.0\%$ adverse excursion from entry price (well beyond the 0.25% stop loss).

---

## 3. The 7-Agent Hermes Desk

1. **Atlas (Macro Order Flow)**: Analyzes order book bid/ask depth volume and delta imbalances to determine overall market bias (`BULLISH`, `BEARISH`, `NEUTRAL`).
2. **Lumen (Economic Calendar & Volatility Guard)**: Tracks economic news windows (CPI, FOMC, NFP). Locks the trading desk (`DESK_LOCKED`) when high-impact events occur within 15 minutes.
3. **Hydra (Setup Quality & Scoring)**: Evaluates structural confluence, order book skew, and risk-reward ratios. Scores setups from 0 to 100 and issues a strict veto for scores below 70.
4. **Sentinel (Capital Protection & Kelly Sizing)**: Enforces fractional Kelly sizing, daily loss caps, and automatic halts after consecutive losses.
5. **Hephaestus (Execution & Order Routing)**: Calculates exact entry, stop loss, take profit, and limit order parameters.
6. **Mnemosyne (Neural Memory & Win-Rate Auditor)**: Audits historical setups, tracks win rates per market regime, and adjusts model weights based on live feedback.
7. **Hermes (Desk Chief & Final Verdict)**: Synthesizes input from all desk specialists to emit the final execution approval (`APPROVE`, `STAND_ASIDE`, `PENDING_USER_APPROVAL`).

---

## 4. Security & Deployment

- **Hosting**: Cloudflare Pages (`grok-bot-dashboard.pages.dev`).
- **Security Audit**: Verified Grade **A (100/100)** with 0 Critical, High, Medium, or Low findings via `vibe-audit`.
- **Headers & CSP**: Explicitly configured `_headers` to authorize:
  `connect-src 'self' wss://stream.bybit.com wss://stream-testnet.bybit.com https://api.bybit.com https://api-testnet.bybit.com;`
