/**
 * Bybit V5 API Client & Live Public WebSocket Feed
 * Connects directly to Bybit V5 Public WebSocket for live real-time tickers and order book depth.
 * Zero API keys required for public live stream; optional keys stored strictly client-side.
 */

export interface BybitTicker {
  symbol: string;
  lastPrice: number;
  prevPrice24h: number;
  highPrice24h: number;
  lowPrice24h: number;
  volume24h: number;
  turnover24h: number;
  price24hPcnt: number;
}

export interface BybitOrderBookDepth {
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
  imbalance: number; // -1.0 (heavy sellers) to +1.0 (heavy buyers)
  spreadPercent: number;
}

export interface BybitKline {
  start: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  confirm: boolean;
}

export interface BybitFeedState {
  isConnected: boolean;
  isConnecting: boolean;
  latencyMs: number;
  lastUpdate: string;
  tickers: Record<string, BybitTicker>;
  depth: Record<string, BybitOrderBookDepth>;
  klines: Record<string, BybitKline[]>;
  error: string | null;
}

export interface BybitCredentials {
  apiKey: string;
  apiSecret: string;
  isConfigured: boolean;
}

const STORAGE_KEY_CREDS = 'bybit_testnet_credentials_v1';

export function loadBybitCredentials(): BybitCredentials {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CREDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        apiKey: (parsed.apiKey || '').trim().replace(/[\r\n\t\s]/g, ''),
        apiSecret: (parsed.apiSecret || '').trim().replace(/[\r\n\t\s]/g, ''),
        isConfigured: Boolean(parsed.apiKey && parsed.apiSecret)
      };
    }
  } catch {
    // fallback
  }
  return { apiKey: '', apiSecret: '', isConfigured: false };
}

export function saveBybitCredentials(creds: { apiKey: string; apiSecret: string }): BybitCredentials {
  const cleanKey = (creds.apiKey || '').trim().replace(/[\r\n\t\s]/g, '');
  const cleanSecret = (creds.apiSecret || '').trim().replace(/[\r\n\t\s]/g, '');
  const updated: BybitCredentials = {
    apiKey: cleanKey,
    apiSecret: cleanSecret,
    isConfigured: Boolean(cleanKey && cleanSecret)
  };
  try {
    localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function clearBybitCredentials(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CREDS);
  } catch {
    // ignore
  }
}

/**
 * Browser-native Web Crypto HMAC-SHA256 signature generator for Bybit V5
 */
export async function generateBybitSignature(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret.trim()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await window.crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface BybitOrderResult {
  ok: boolean;
  orderId?: string;
  orderLinkId?: string;
  error?: string;
  symbol?: string;
  side?: string;
  qty?: string;
}

export interface BybitWalletCheckResult {
  ok: boolean;
  totalEquity?: number;
  availableBalance?: number;
  coins?: { coin: string; walletBalance: string; availableToWithdraw: string }[];
  error?: string;
  accountType?: string;
}

const BYBIT_TESTNET_BASE = 'https://api-testnet.bybit.com';

interface BybitParsedResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

/**
 * Bulletproof parser for Bybit V5 REST responses.
 * Avoids uncaught "Failed to execute 'json' on 'Response'" when Bybit sends HTTP 401 with 0 bytes.
 */
async function parseBybitResponse<T = any>(res: Response): Promise<BybitParsedResponse<T>> {
  let text = '';
  try {
    text = await res.text();
  } catch (err: any) {
    return {
      ok: false,
      status: res.status,
      error: `Network error reading response: ${err?.message || 'unknown'}`
    };
  }

  // Bybit sends 0 bytes on HTTP 401/403 auth failures
  if (!text || text.trim().length === 0) {
    if (res.status === 401) {
      return {
        ok: false,
        status: 401,
        error: 'HTTP 401 Unauthorized: Invalid API Key or Secret. If you created this key on mainnet (bybit.com), please create it on testnet.bybit.com instead.'
      };
    }
    if (res.status === 403) {
      return {
        ok: false,
        status: 403,
        error: 'HTTP 403 Forbidden: Request blocked by Bybit gateway (check IP whitelist or permissions).'
      };
    }
    return {
      ok: false,
      status: res.status,
      error: `Bybit returned HTTP ${res.status} with empty response body.`
    };
  }

  try {
    const json = JSON.parse(text);
    if (json.retCode !== undefined && json.retCode !== 0) {
      let friendly = json.retMsg || `Bybit Error Code ${json.retCode}`;
      if (json.retCode === 10003) {
        friendly = 'Invalid API Key: Key does not exist on Bybit Testnet (make sure it was created on testnet.bybit.com).';
      } else if (json.retCode === 10004) {
        friendly = 'Invalid Signature: Secret mismatch or system clock out of sync.';
      } else if (json.retCode === 10005) {
        friendly = 'Permission Denied: Tick "Orders" & "Positions" under Unified/Contract in Bybit API settings.';
      } else if (json.retCode === 10002) {
        friendly = 'Request expired: Timestamp out of sync with Bybit server.';
      }
      return {
        ok: false,
        status: res.status,
        data: json,
        error: friendly
      };
    }
    return {
      ok: true,
      status: res.status,
      data: json
    };
  } catch {
    return {
      ok: false,
      status: res.status,
      error: `Invalid response format from Bybit (HTTP ${res.status})`
    };
  }
}

// Clock synchronization with Bybit server time
let serverTimeOffsetMs = 0;
let lastServerSyncTime = 0;

export async function getBybitServerTimestamp(): Promise<string> {
  const now = Date.now();
  if (lastServerSyncTime === 0 || now - lastServerSyncTime > 120000) {
    try {
      const res = await fetch(`${BYBIT_TESTNET_BASE}/v5/market/time`);
      const parsed = await parseBybitResponse<{ time?: number }>(res);
      if (parsed.ok && parsed.data?.time) {
        const sTime = Number(parsed.data.time);
        if (!isNaN(sTime) && sTime > 0) {
          serverTimeOffsetMs = sTime - Date.now();
          lastServerSyncTime = Date.now();
        }
      }
    } catch {
      // fallback to local clock
    }
  }
  return (Date.now() + serverTimeOffsetMs).toString();
}

/**
 * Check connection and retrieve real Bybit Testnet wallet balance
 */
export async function checkBybitTestnetWallet(creds: BybitCredentials): Promise<BybitWalletCheckResult> {
  const cleanKey = (creds.apiKey || '').trim().replace(/[\r\n\t\s]/g, '');
  const cleanSecret = (creds.apiSecret || '').trim().replace(/[\r\n\t\s]/g, '');

  if (!cleanKey || !cleanSecret) {
    return { ok: false, error: 'API Key or Secret missing' };
  }

  const sanitizedCreds = { ...creds, apiKey: cleanKey, apiSecret: cleanSecret };
  const timestamp = await getBybitServerTimestamp();
  const recvWindow = '20000'; // 20s window eliminates clock-drift errors
  const queryString = 'accountType=UNIFIED';
  const preSignString = timestamp + cleanKey + recvWindow + queryString;

  try {
    const signature = await generateBybitSignature(cleanSecret, preSignString);
    const res = await fetch(`${BYBIT_TESTNET_BASE}/v5/account/wallet-balance?${queryString}`, {
      method: 'GET',
      headers: {
        'X-BAPI-API-KEY': cleanKey,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': recvWindow,
        'X-BAPI-SIGN': signature,
        'Content-Type': 'application/json'
      }
    });

    const parsed = await parseBybitResponse(res);
    if (!parsed.ok) {
      // If UNIFIED fails, attempt check on legacy CONTRACT account
      const contractRes = await checkBybitContractWallet(sanitizedCreds);
      if (contractRes.ok) {
        return contractRes;
      }
      return { ok: false, error: parsed.error || contractRes.error };
    }

    const list = parsed.data?.result?.list?.[0];
    const totalEquity = list ? parseFloat(list.totalEquity || '0') : 0;
    const availableBalance = list ? parseFloat(list.totalAvailableBalance || '0') : 0;
    const coins = list?.coin || [];

    return {
      ok: true,
      totalEquity,
      availableBalance,
      coins,
      accountType: 'UNIFIED'
    };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Failed to fetch Bybit Testnet wallet balance' };
  }
}

async function checkBybitContractWallet(creds: BybitCredentials): Promise<BybitWalletCheckResult> {
  const timestamp = await getBybitServerTimestamp();
  const recvWindow = '20000';
  const queryString = 'accountType=CONTRACT';
  const preSignString = timestamp + creds.apiKey + recvWindow + queryString;

  try {
    const signature = await generateBybitSignature(creds.apiSecret, preSignString);
    const res = await fetch(`${BYBIT_TESTNET_BASE}/v5/account/wallet-balance?${queryString}`, {
      method: 'GET',
      headers: {
        'X-BAPI-API-KEY': creds.apiKey,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': recvWindow,
        'X-BAPI-SIGN': signature,
        'Content-Type': 'application/json'
      }
    });

    const parsed = await parseBybitResponse(res);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error || `Bybit Contract Wallet Error` };
    }

    const list = parsed.data?.result?.list?.[0];
    const totalEquity = list ? parseFloat(list.totalEquity || '0') : 0;
    const availableBalance = list ? parseFloat(list.totalAvailableBalance || '0') : 0;

    return {
      ok: true,
      totalEquity,
      availableBalance,
      coins: list?.coin || [],
      accountType: 'CONTRACT'
    };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Failed to fetch Contract wallet' };
  }
}

/**
 * Place a real paper order on Bybit Testnet V5 Orderbook
 */
export async function placeBybitTestnetOrder(
  creds: BybitCredentials,
  params: {
    symbol: string;
    side: 'Buy' | 'Sell';
    qty: string;
    orderType?: 'Market' | 'Limit';
    price?: string;
    reduceOnly?: boolean;
  }
): Promise<BybitOrderResult> {
  const cleanKey = (creds.apiKey || '').trim().replace(/[\r\n\t\s]/g, '');
  const cleanSecret = (creds.apiSecret || '').trim().replace(/[\r\n\t\s]/g, '');

  if (!cleanKey || !cleanSecret) {
    return { ok: false, error: 'API credentials not configured' };
  }

  const timestamp = await getBybitServerTimestamp();
  const recvWindow = '20000';

  const bodyObj: any = {
    category: 'linear',
    symbol: params.symbol,
    side: params.side,
    orderType: params.orderType || 'Market',
    qty: params.qty,
    timeInForce: 'IOC',
    reduceOnly: Boolean(params.reduceOnly)
  };

  if (params.orderType === 'Limit' && params.price) {
    bodyObj.price = params.price;
  }

  const bodyJson = JSON.stringify(bodyObj);
  const preSignString = timestamp + cleanKey + recvWindow + bodyJson;

  try {
    const signature = await generateBybitSignature(cleanSecret, preSignString);
    const res = await fetch(`${BYBIT_TESTNET_BASE}/v5/order/create`, {
      method: 'POST',
      headers: {
        'X-BAPI-API-KEY': cleanKey,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': recvWindow,
        'X-BAPI-SIGN': signature,
        'Content-Type': 'application/json'
      },
      body: bodyJson
    });

    const parsed = await parseBybitResponse(res);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error || `Failed to execute order on Bybit Testnet` };
    }

    return {
      ok: true,
      orderId: parsed.data?.result?.orderId,
      orderLinkId: parsed.data?.result?.orderLinkId,
      symbol: params.symbol,
      side: params.side,
      qty: params.qty
    };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Failed to execute order on Bybit Testnet' };
  }
}

function generateInitialKlines(basePrice: number, count = 40): BybitKline[] {
  const klines: BybitKline[] = [];
  const now = Date.now();
  let price = basePrice * 0.985;
  for (let i = count; i >= 0; i--) {
    const time = now - i * 60000;
    const change = (Math.random() - 0.48) * (basePrice * 0.0035);
    const open = Number(price.toFixed(2));
    price += change;
    const close = Number(price.toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * (basePrice * 0.002)).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * (basePrice * 0.002)).toFixed(2));
    const volume = Number((Math.random() * 8 + 2).toFixed(2));
    klines.push({ start: time, open, high, low, close, volume, confirm: true });
  }
  return klines;
}

/**
 * Singleton WebSocket Manager for Bybit V5 Public Stream
 */
class BybitStreamManager {
  private ws: WebSocket | null = null;
  private pingInterval: any = null;
  private listeners = new Set<(state: BybitFeedState) => void>();
  private pingStartTime = 0;

  public state: BybitFeedState = {
    isConnected: false,
    isConnecting: false,
    latencyMs: 38,
    lastUpdate: 'Awaiting connection...',
    tickers: {
      BTCUSDT: {
        symbol: 'BTCUSDT',
        lastPrice: 81900.0,
        prevPrice24h: 81100.0,
        highPrice24h: 83500.0,
        lowPrice24h: 79800.0,
        volume24h: 34120.5,
        turnover24h: 2790000000,
        price24hPcnt: 0.0098
      },
      ETHUSDT: {
        symbol: 'ETHUSDT',
        lastPrice: 2840.5,
        prevPrice24h: 2790.0,
        highPrice24h: 2910.0,
        lowPrice24h: 2740.0,
        volume24h: 182300.0,
        turnover24h: 518000000,
        price24hPcnt: 0.0181
      },
      SOLUSDT: {
        symbol: 'SOLUSDT',
        lastPrice: 184.2,
        prevPrice24h: 178.5,
        highPrice24h: 191.0,
        lowPrice24h: 175.2,
        volume24h: 890400.0,
        turnover24h: 164000000,
        price24hPcnt: 0.0319
      }
    },
    depth: {
      BTCUSDT: {
        bidPrice: 81898.0,
        bidSize: 14.8,
        askPrice: 81902.0,
        askSize: 9.2,
        imbalance: 0.23,
        spreadPercent: 0.005
      }
    },
    klines: {
      BTCUSDT: generateInitialKlines(81900.0),
      ETHUSDT: generateInitialKlines(2840.5),
      SOLUSDT: generateInitialKlines(184.2)
    },
    error: null
  };

  public subscribe(listener: (state: BybitFeedState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    if (!this.ws && typeof window !== 'undefined') {
      this.connect();
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this.listeners.forEach(cb => cb({ ...this.state }));
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.state.isConnecting = true;
    this.emit();

    // Connect directly to Bybit Mainnet Public Stream for 100% real-world crypto price ticks
    const url = 'wss://stream.bybit.com/v5/public/linear';

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.state.isConnected = true;
        this.state.isConnecting = false;
        this.state.error = null;
        this.state.lastUpdate = new Date().toTimeString().split(' ')[0];
        this.emit();

        // Subscribe to tickers, L1 orderbooks, and 1m klines across active pairs
        const subMsg = {
          op: 'subscribe',
          args: [
            'tickers.BTCUSDT',
            'tickers.ETHUSDT',
            'tickers.SOLUSDT',
            'tickers.DOGEUSDT',
            'tickers.SUIUSDT',
            'orderbook.1.BTCUSDT',
            'orderbook.1.SOLUSDT',
            'orderbook.1.ETHUSDT',
            'kline.1.BTCUSDT',
            'kline.1.ETHUSDT',
            'kline.1.SOLUSDT'
          ]
        };
        this.ws?.send(JSON.stringify(subMsg));

        // Start ping loop (Bybit requires ping every 20s)
        this.pingInterval = setInterval(() => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            this.pingStartTime = performance.now();
            this.ws.send(JSON.stringify({ op: 'ping' }));
          }
        }, 15000);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle Pong
          if (data.op === 'pong' || data.ret_msg === 'pong') {
            if (this.pingStartTime > 0) {
              this.state.latencyMs = Math.round(performance.now() - this.pingStartTime);
              this.emit();
            }
            return;
          }

          // Handle Kline updates
          if (data.topic && data.topic.startsWith('kline.')) {
            const parts = data.topic.split('.');
            const sym = parts[2];
            const rawKlines = Array.isArray(data.data) ? data.data : [data.data];
            if (sym && rawKlines.length > 0) {
              const currentList = this.state.klines[sym] || [];
              const updatedList = [...currentList];
              for (const k of rawKlines) {
                if (!k) continue;
                const candle: BybitKline = {
                  start: Number(k.start),
                  open: parseFloat(k.open),
                  high: parseFloat(k.high),
                  low: parseFloat(k.low),
                  close: parseFloat(k.close),
                  volume: parseFloat(k.volume || '0'),
                  confirm: Boolean(k.confirm)
                };
                const lastIdx = updatedList.length - 1;
                if (lastIdx >= 0 && updatedList[lastIdx].start === candle.start) {
                  updatedList[lastIdx] = candle;
                } else {
                  updatedList.push(candle);
                  if (updatedList.length > 80) updatedList.shift();
                }
              }
              this.state.klines[sym] = updatedList;
              this.emit();
            }
            return;
          }

          // Handle Ticker updates
          if (data.topic && data.topic.startsWith('tickers.')) {
            const sym = data.topic.replace('tickers.', '');
            const raw = data.data;
            if (raw) {
              const current = this.state.tickers[sym] || {
                symbol: sym,
                lastPrice: 0,
                prevPrice24h: 0,
                highPrice24h: 0,
                lowPrice24h: 0,
                volume24h: 0,
                turnover24h: 0,
                price24hPcnt: 0
              };

              const newPrice = raw.lastPrice ? parseFloat(raw.lastPrice) : current.lastPrice;

              this.state.tickers[sym] = {
                symbol: sym,
                lastPrice: newPrice,
                prevPrice24h: raw.prevPrice24h ? parseFloat(raw.prevPrice24h) : current.prevPrice24h,
                highPrice24h: raw.highPrice24h ? parseFloat(raw.highPrice24h) : current.highPrice24h,
                lowPrice24h: raw.lowPrice24h ? parseFloat(raw.lowPrice24h) : current.lowPrice24h,
                volume24h: raw.volume24h ? parseFloat(raw.volume24h) : current.volume24h,
                turnover24h: raw.turnover24h ? parseFloat(raw.turnover24h) : current.turnover24h,
                price24hPcnt: raw.price24hPcnt ? parseFloat(raw.price24hPcnt) : current.price24hPcnt
              };

              // Update active candle with new price in real-time
              const klist = this.state.klines[sym];
              if (klist && klist.length > 0 && newPrice > 0) {
                const latest = klist[klist.length - 1];
                latest.close = newPrice;
                if (newPrice > latest.high) latest.high = newPrice;
                if (newPrice < latest.low) latest.low = newPrice;
              }
              this.state.lastUpdate = new Date().toTimeString().split(' ')[0];
              this.emit();
            }
          }

          // Handle Orderbook Depth updates
          if (data.topic && data.topic.startsWith('orderbook.1.')) {
            const sym = data.topic.replace('orderbook.1.', '');
            const book = data.data;
            if (book && book.b && book.b[0] && book.a && book.a[0]) {
              const bidPrice = parseFloat(book.b[0][0]);
              const bidSize = parseFloat(book.b[0][1]);
              const askPrice = parseFloat(book.a[0][0]);
              const askSize = parseFloat(book.a[0][1]);

              const totalSize = bidSize + askSize;
              const imbalance = totalSize > 0 ? Number(((bidSize - askSize) / totalSize).toFixed(2)) : 0;
              const mid = (bidPrice + askPrice) / 2;
              const spreadPercent = mid > 0 ? Number((((askPrice - bidPrice) / mid) * 100).toFixed(4)) : 0.005;

              this.state.depth[sym] = {
                bidPrice,
                bidSize,
                askPrice,
                askSize,
                imbalance,
                spreadPercent
              };
              this.emit();
            }
          }
        } catch {
          // ignore parsing error
        }
      };

      this.ws.onerror = () => {
        this.state.error = 'Bybit Testnet WS Stream disconnected. Reconnecting...';
        this.state.isConnected = false;
        this.emit();
      };

      this.ws.onclose = () => {
        this.state.isConnected = false;
        this.state.isConnecting = false;
        clearInterval(this.pingInterval);
        this.emit();
        // Auto-reconnect after 3 seconds
        setTimeout(() => this.connect(), 3000);
      };
    } catch (e: any) {
      this.state.error = e.message || 'Failed to initialize WebSocket';
      this.state.isConnected = false;
      this.state.isConnecting = false;
      this.emit();
    }
  }
}

export const bybitStream = new BybitStreamManager();
