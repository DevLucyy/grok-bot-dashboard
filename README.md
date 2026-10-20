# Grok Bot Trading Dashboard & $15 Real-Tick Execution Engine

Real-time multi-agent algorithmic trading terminal and forward execution engine connecting directly to Bybit V5 Linear Perpetual WebSockets.

- **Production URL**: [https://grok-bot-dashboard.pages.dev](https://grok-bot-dashboard.pages.dev)
- **Starting Bankroll**: $15.00 Micro Live Account
- **Target Milestone**: $45.00 (3x compound)
- **Live WebSocket Feeds**: `wss://stream.bybit.com`, `wss://stream-testnet.bybit.com`

---

## Architecture & Desk Agents

1. **Atlas**: Order flow imbalances, bid/ask depth skew, delta absorption.
2. **Lumen**: Economic calendar events (CPI, FOMC, NFP) and volatility lockouts.
3. **Hydra**: Structural confluence scoring (0–100) and strict trade vetting (<70).
4. **Sentinel**: Capital preservation, fractional Kelly sizing, consecutive loss breaker.
5. **Hephaestus**: Micro-contract sizing (0.001 BTC @ 10x leverage, ~$8.20 margin).
6. **Mnemosyne**: Neural memory, regime performance, win-rate tracking.
7. **Hermes**: Desk chief, final consensus approval.

---

## Documentation & Chat Archive

All session history, specifications, ADRs, and transcripts are stored in [`docs/`](./docs/):

- [`docs/FULL_CHAT_HISTORY.md`](./docs/FULL_CHAT_HISTORY.md): Full transcript of all user requests and agent interactions.
- [`docs/ARCHITECTURE_AND_SPECS.md`](./docs/ARCHITECTURE_AND_SPECS.md): Financial math, Bybit V5 WebSocket API specs, risk sizing.
- [`docs/decisions/`](./docs/decisions/): Architectural Decision Records (ADRs).
- [`docs/media/`](./docs/media/): Uploaded reference visuals and mockups.
- [`docs/raw_logs/`](./docs/raw_logs/): Raw machine-readable JSONL logs.
