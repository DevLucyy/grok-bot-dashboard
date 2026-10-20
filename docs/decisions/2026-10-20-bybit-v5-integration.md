# Decision: Bybit V5 Testnet Integration Architecture

- **Date**: 2026-10-20
- **Status**: APPROVED
- **Context**: User has $5–$10 in personal capital, wants to test the Autonomous Mastermind for ~1 month on Bybit Testnet with zero risk to personal capital before committing real funds.

## Consensus & Architecture
1. **Public Market Data (Zero Keys Required)**:
   - Bybit V5 Public REST + WebSocket (`https://api-testnet.bybit.com/v5/market/tickers`, `https://api.bybit.com/v5/market/tickers`, `wss://stream-testnet.bybit.com/v5/public/linear`).
   - Fetches real-time BTCUSDT, ETHUSDT, SOLUSDT bid/ask, 24h volume, and L2 order book depth to feed Atlas and Hydra.
2. **Private Testnet Execution (Client-Side Only)**:
   - Modal/drawer to enter Bybit Testnet API Key & Secret (optional).
   - Saved exclusively in browser `localStorage` (`bybit_testnet_credentials`), never transmitted to external servers.
   - Signs requests via HMAC-SHA256 (`crypto.subtle` standard library, zero external dependencies).
3. **Seamless Fallback**:
   - If keys are not provided, runs on live Bybit public market ticks with simulated paper execution.
   - If keys are provided, places real demo orders on Bybit Testnet (`api-testnet.bybit.com/v5/order/create`).
