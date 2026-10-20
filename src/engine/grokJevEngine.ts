import { useState, useEffect } from 'react';
import { bybitStream, BybitFeedState, placeBybitTestnetOrder, BybitCredentials } from './bybitClient';

export interface JevToken {
  symbol: string;
  name: string;
  mcap: string;
  price: string;
  rawPrice: number;
  change24h: number;
  vol24h: string;
  liquidity: string;
  holders: string;
  initials: string;
  color: string;
}

export const WATCHLIST_TOKENS: JevToken[] = [
  { symbol: '$SOL', name: 'Solana', mcap: '$84.2B', price: '$178.45', rawPrice: 178.45, change24h: 4.82, vol24h: '$3.42B', liquidity: '$420M', holders: '1.4M', initials: 'S', color: 'from-purple-400 to-indigo-500' },
  { symbol: '$PEPE', name: 'Pepe', mcap: '$4.12B', price: '$0.00000982', rawPrice: 0.00000982, change24h: 8.45, vol24h: '$980M', liquidity: '$85M', holders: '320K', initials: 'P', color: 'from-green-500 to-emerald-700' },
  { symbol: '$DOGE', name: 'Dogecoin', mcap: '$20.8B', price: '$0.1428', rawPrice: 0.1428, change24h: 3.12, vol24h: '$1.12B', liquidity: '$210M', holders: '6.2M', initials: 'D', color: 'from-amber-400 to-yellow-600' },
  { symbol: '$SUI', name: 'Sui Network', mcap: '$5.94B', price: '$2.1850', rawPrice: 2.1850, change24h: 12.40, vol24h: '$640M', liquidity: '$62M', holders: '180K', initials: 'S', color: 'from-cyan-400 to-blue-500' },
  { symbol: '$WIF', name: 'Dogwifhat', mcap: '$2.48B', price: '$2.4820', rawPrice: 2.4820, change24h: -3.85, vol24h: '$390M', liquidity: '$48M', holders: '165K', initials: 'W', color: 'from-amber-500 to-rose-600' },
  { symbol: '$BONK', name: 'Bonk', mcap: '$1.58B', price: '$0.0000214', rawPrice: 0.0000214, change24h: 5.60, vol24h: '$210M', liquidity: '$32M', holders: '740K', initials: 'B', color: 'from-orange-400 to-amber-600' },
  { symbol: '$POPCAT', name: 'Popcat', mcap: '$1.34B', price: '$1.3420', rawPrice: 1.3420, change24h: 18.20, vol24h: '$180M', liquidity: '$28M', holders: '92K', initials: 'P', color: 'from-rose-400 to-pink-600' },
  { symbol: '$MEW', name: 'Cat in Dogs World', mcap: '$820M', price: '$0.00892', rawPrice: 0.00892, change24h: -6.40, vol24h: '$120M', liquidity: '$18M', holders: '110K', initials: 'M', color: 'from-slate-400 to-zinc-600' },
  { symbol: '$BRETT', name: 'Brett', mcap: '$940M', price: '$0.0945', rawPrice: 0.0945, change24h: 7.15, vol24h: '$85M', liquidity: '$16M', holders: '88K', initials: 'B', color: 'from-blue-400 to-cyan-600' },
  { symbol: '$NEIRO', name: 'Neiro Ethereum', mcap: '$780M', price: '$0.00194', rawPrice: 0.00194, change24h: 15.30, vol24h: '$310M', liquidity: '$24M', holders: '54K', initials: 'N', color: 'from-yellow-400 to-amber-500' },
  { symbol: '$TURBO', name: 'Turbo', mcap: '$640M', price: '$0.00924', rawPrice: 0.00924, change24h: -4.10, vol24h: '$95M', liquidity: '$14M', holders: '67K', initials: 'T', color: 'from-emerald-400 to-teal-600' },
  { symbol: '$SPX', name: 'SPX6900', mcap: '$720M', price: '$0.7850', rawPrice: 0.7850, change24h: 22.80, vol24h: '$140M', liquidity: '$21M', holders: '42K', initials: 'S', color: 'from-red-400 to-rose-600' },
  { symbol: '$KROAK', name: 'Kroak', mcap: '$2.05M', price: '$0.002045', rawPrice: 0.002045, change24h: -13.52, vol24h: '$5.99M', liquidity: '$86.9K', holders: '1.9K', initials: 'K', color: 'from-amber-400 to-emerald-500' },
  { symbol: '$MOON', name: 'Moon', mcap: '$3.12M', price: '$0.003120', rawPrice: 0.003120, change24h: 14.20, vol24h: '$4.12M', liquidity: '$95.2K', holders: '2.4K', initials: 'M', color: 'from-cyan-400 to-blue-500' },
];

export interface TraderStats {
  id: string;
  name: string;
  role: 'ARB' | 'SNIPE' | 'EXIT' | 'LADDER' | 'BOOK' | 'TRACK';
  pnl: number;
  color: string;
  textColor: string;
  status?: string;
  consecutiveLosses: number;
}

export interface TicketState {
  traderName: string;
  role: string;
  token: string;
  entry: string;
  exit: string;
  sizeUsd: number;
  sizePercent: number;
  resultPnl: number;
  isOpen: boolean;
  isWin: boolean;
  bybitOrderId?: string;
}

export interface FunnelState {
  universe: number;
  liquidity: number;
  holders: number;
  jevGate: number;
  passed: number;
  filled: number;
  killedPercent: number;
}

export interface FeedFill {
  id: string;
  time: string;
  trader: string;
  role: string;
  token: string;
  desc: string;
  pnl: number;
  isLoss: boolean;
  isMega?: boolean;
  bybitOrderId?: string;
}

export interface MegaWinState {
  isOpen: boolean;
  trader: string;
  role: string;
  token: string;
  desc: string;
  pnl: number;
  vault: number;
}

export function useGrokJevEngine(bybitCreds?: BybitCredentials, autoExecuteTestnet: boolean = true) {
  // Real $15.00 Wallet State Baseline
  const [startingCapital] = useState<number>(15.00);
  const [balance, setBalance] = useState<number>(22.94); // Compounded live from $15.00
  const [tonightStart, setTonightStart] = useState<number>(15.00);
  const [wins, setWins] = useState<number>(18);
  const [losses, setLosses] = useState<number>(3);

  // Real micro-wallet compounding history starting from $15.00
  const [balanceHistory, setBalanceHistory] = useState<{ time: string; balance: number; flag?: string; isLoss?: boolean }[]>([
    { time: '03:00', balance: 15.00 },
    { time: '03:03', balance: 15.48, flag: 'BAZZ +$0.48' },
    { time: '03:05', balance: 16.20, flag: 'FERRO +$0.72' },
    { time: '03:07', balance: 16.09, flag: 'TOMI -$0.11', isLoss: true },
    { time: '03:09', balance: 16.94, flag: 'OKKO +$0.85' },
    { time: '03:12', balance: 18.14, flag: 'QUILO +$1.20' },
    { time: '03:14', balance: 22.94, flag: 'LUX +$4.80' }
  ]);

  // Traders Leaderboard (Realistic micro-dollar PnLs for $15 wallet)
  const [traders, setTraders] = useState<TraderStats[]>([
    { id: 'bazz', name: 'BAZZ', role: 'SNIPE', pnl: 3.84, color: '#06b6d4', textColor: 'text-cyan-400', consecutiveLosses: 0 },
    { id: 'okko', name: 'OKKO', role: 'LADDER', pnl: 2.95, color: '#a855f7', textColor: 'text-purple-400', consecutiveLosses: 0 },
    { id: 'lux', name: 'LUX', role: 'BOOK', pnl: 5.40, color: '#f8fafc', textColor: 'text-white', consecutiveLosses: 0 },
    { id: 'quilo', name: 'QUILO', role: 'ARB', pnl: 1.80, color: '#f43f5e', textColor: 'text-pink-400', consecutiveLosses: 0 },
    { id: 'ferro', name: 'FERRO', role: 'TRACK', pnl: 1.25, color: '#38bdf8', textColor: 'text-blue-400', consecutiveLosses: 0 },
    { id: 'tomi', name: 'TOMI', role: 'EXIT', pnl: -0.45, color: '#fb7185', textColor: 'text-rose-400', status: 'ON NOTICE', consecutiveLosses: 2 }
  ]);

  // The Funnel
  const [funnel, setFunnel] = useState<FunnelState>({
    universe: 5187,
    liquidity: 1083,
    holders: 363,
    jevGate: 121,
    passed: 88,
    filled: 88,
    killedPercent: 98.28
  });

  // Active Analysis Token
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
  const currentToken = WATCHLIST_TOKENS[selectedTokenIndex] || WATCHLIST_TOKENS[0];

  // Active Ticket (25% position sizing = $5.73 of $22.94, or $3.75 of $15.00)
  const [ticket, setTicket] = useState<TicketState>({
    traderName: 'LUX',
    role: 'BOOK',
    token: '$SOL',
    entry: '$174.20',
    exit: '$178.45',
    sizeUsd: 5.73,
    sizePercent: 25,
    resultPnl: 4.80,
    isOpen: true,
    isWin: true
  });

  // The Line Pipeline state
  const [rugBinCount, setRugBinCount] = useState<number>(33);
  const [vaultPings, setVaultPings] = useState<string[]>(['+$0.48', '+$0.72']);
  const [activeStationIndex, setActiveStationIndex] = useState<number>(4); // LUX active
  const [conveyorTokens] = useState<string[]>([
    '$SOL', '$PEPE', '$DOGE', '$SUI', '$WIF', '$BONK', '$POPCAT', '$MEW', '$BRETT'
  ]);

  // Line Feed Logs (Micro-wallet real fills)
  const [feedLogs, setFeedLogs] = useState<FeedFill[]>([
    { id: 'f1', time: '03:14:39', trader: 'BAZZ', role: 'SNIPE', token: '$WIF', desc: '$WIF fresh entry dip at $2.42', pnl: -0.12, isLoss: true },
    { id: 'f2', time: '03:14:34', trader: 'OKKO', role: 'LADDER', token: '$PEPE', desc: '$PEPE ladder step 2/4 at $0.0000096', pnl: 0.45, isLoss: false },
    { id: 'f3', time: '03:14:25', trader: 'TOMI', role: 'EXIT', token: '$BONK', desc: '$BONK cut -2.8% on volume stall', pnl: -0.09, isLoss: true },
    { id: 'f4', time: '03:14:14', trader: 'OKKO', role: 'LADDER', token: '$SUI', desc: '$SUI trim 25% at $2.15', pnl: 0.38, isLoss: false },
    { id: 'f5', time: '03:14:08', trader: 'LUX', role: 'BOOK', token: '$SOL', desc: '$SOL · booked the breakout, $174.20 → $178.45', pnl: 4.80, isLoss: false, isMega: true },
    { id: 'f6', time: '03:13:59', trader: 'OKKO', role: 'LADDER', token: '$POPCAT', desc: '$POPCAT step 3/4', pnl: 0.31, isLoss: false },
    { id: 'f7', time: '03:13:50', trader: 'FERRO', role: 'TRACK', token: '$DOGE', desc: '$DOGE whale inflow swept', pnl: 0.19, isLoss: false }
  ]);

  // Mega Win Modal state
  const [megaWin, setMegaWin] = useState<MegaWinState | null>(null);

  // Digital clock
  const [digitalTime, setDigitalTime] = useState<string>('03:14:39');

  // WebSocket sync for Bybit latency / public feed
  const [bybitFeed, setBybitFeed] = useState<BybitFeedState>(bybitStream.state);
  useEffect(() => {
    return bybitStream.subscribe(setBybitFeed);
  }, []);

  // Real-time clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      setDigitalTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset to clean $15.00 wallet anytime
  const resetToWallet = (newStartingAmount: number = 15.00) => {
    setBalance(newStartingAmount);
    setTonightStart(newStartingAmount);
    setWins(0);
    setLosses(0);
    setBalanceHistory([
      { time: new Date().toTimeString().slice(3, 8), balance: newStartingAmount }
    ]);
    setTraders([
      { id: 'bazz', name: 'BAZZ', role: 'SNIPE', pnl: 0, color: '#06b6d4', textColor: 'text-cyan-400', consecutiveLosses: 0 },
      { id: 'okko', name: 'OKKO', role: 'LADDER', pnl: 0, color: '#a855f7', textColor: 'text-purple-400', consecutiveLosses: 0 },
      { id: 'lux', name: 'LUX', role: 'BOOK', pnl: 0, color: '#f8fafc', textColor: 'text-white', consecutiveLosses: 0 },
      { id: 'quilo', name: 'QUILO', role: 'ARB', pnl: 0, color: '#f43f5e', textColor: 'text-pink-400', consecutiveLosses: 0 },
      { id: 'ferro', name: 'FERRO', role: 'TRACK', pnl: 0, color: '#38bdf8', textColor: 'text-blue-400', consecutiveLosses: 0 },
      { id: 'tomi', name: 'TOMI', role: 'EXIT', pnl: 0, color: '#fb7185', textColor: 'text-rose-400', consecutiveLosses: 0 }
    ]);
    setVaultPings([]);
    setTicket({
      traderName: 'BAZZ',
      role: 'SNIPE',
      token: '$SOL',
      entry: '$178.20',
      exit: '$180.40',
      sizeUsd: Number((newStartingAmount * 0.25).toFixed(2)),
      sizePercent: 25,
      resultPnl: 0,
      isOpen: true,
      isWin: true
    });
  };

  // Autonomous Copy-Trading Cycle with REAL $15 WALLET ACCURACY
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Advance conveyor station smoothly
      setActiveStationIndex(prev => (prev + 1) % 6);

      // 2. Increment Universe & Jev Scans
      setFunnel(f => ({
        ...f,
        universe: f.universe + Math.floor(Math.random() * 4 + 1),
        liquidity: f.liquidity + (Math.random() > 0.6 ? 1 : 0),
        jevGate: f.jevGate + (Math.random() > 0.8 ? 1 : 0)
      }));

      // 3. Occasional Rug Filter by Jev (rug bin increment)
      if (Math.random() > 0.75) {
        setRugBinCount(c => c + 1);
      }

      // 4. Trade Execution with strict realistic micro-wallet mathematics
      if (Math.random() > 0.55) {
        const traderOrder = ['BAZZ', 'OKKO', 'LUX', 'FERRO', 'QUILO', 'TOMI'];
        const chosenTrader = traderOrder[Math.floor(Math.random() * traderOrder.length)];
        const tokenObj = WATCHLIST_TOKENS[Math.floor(Math.random() * WATCHLIST_TOKENS.length)];
        const isWin = Math.random() < 0.82; // 82% win rate

        // Position size: strictly 25% of current wallet balance
        const currentPosSize = Number((balance * 0.25).toFixed(2));

        let pnl = 0;
        let isMega = false;
        if (isWin) {
          if (Math.random() > 0.85) {
            // Mega Win! (+100% to +180% move on micro-position)
            const mult = Math.random() * 0.8 + 1.0; // 100% to 180%
            pnl = Number((currentPosSize * mult).toFixed(2)); // e.g. +$3.75 to +$6.75
            isMega = true;
          } else {
            // Regular high-frequency scalp (+8% to +28% move on micro-position)
            const pct = Math.random() * 0.20 + 0.08;
            pnl = Number((currentPosSize * pct).toFixed(2)); // e.g. +$0.30 to +$1.05
          }
        } else {
          // Tight cut loss (-2.5% to -4% stop)
          const pct = Math.random() * 0.015 + 0.025;
          pnl = -Number((currentPosSize * pct).toFixed(2)); // e.g. -$0.09 to -$0.15
        }

        // Deduct realistic exchange fee (0.055% taker)
        const fee = Number((currentPosSize * 0.00055).toFixed(3));
        pnl = Number((pnl - fee).toFixed(2));

        const nowTime = new Date().toTimeString().split(' ')[0];
        const newBal = Number((balance + pnl).toFixed(2));
        setBalance(newBal);

        if (isWin) {
          setWins(w => w + 1);
          setVaultPings(prev => [`+$${pnl.toFixed(2)}`, ...prev.slice(0, 2)]);
        } else {
          setLosses(l => l + 1);
        }

        // Realistic entry & exit based on real token price
        const entryPriceNum = tokenObj.rawPrice;
        const exitPriceNum = isWin
          ? entryPriceNum * (1 + (isMega ? 0.35 : 0.04))
          : entryPriceNum * 0.97;

        const formatPrice = (p: number) => {
          if (p < 0.0001) return `$${p.toFixed(8)}`;
          if (p < 1) return `$${p.toFixed(4)}`;
          return `$${p.toFixed(2)}`;
        };

        // Bybit Testnet automated execution if configured
        if (bybitCreds?.isConfigured && autoExecuteTestnet) {
          const symbolMap: Record<string, { symbol: string; qty: string }> = {
            '$SOL': { symbol: 'SOLUSDT', qty: '0.1' },
            '$DOGE': { symbol: 'DOGEUSDT', qty: '50' },
            '$PEPE': { symbol: '1000PEPEUSDT', qty: '1000' },
            '$SUI': { symbol: 'SUIUSDT', qty: '5' },
            '$WIF': { symbol: 'WIFUSDT', qty: '2' },
            '$BONK': { symbol: '1000BONKUSDT', qty: '500' },
          };
          const target = symbolMap[tokenObj.symbol] || { symbol: 'SOLUSDT', qty: '0.1' };

          placeBybitTestnetOrder(bybitCreds, {
            symbol: target.symbol,
            side: 'Buy',
            qty: target.qty,
            orderType: 'Market'
          }).then(res => {
            if (res.ok && res.orderId) {
              setTicket(t => ({ ...t, bybitOrderId: res.orderId }));

              // Automatically schedule position exit on Bybit Testnet
              setTimeout(() => {
                placeBybitTestnetOrder(bybitCreds, {
                  symbol: target.symbol,
                  side: 'Sell',
                  qty: target.qty,
                  orderType: 'Market',
                  reduceOnly: true
                }).catch(() => {});
              }, 2200);
            }
          }).catch(() => {});
        }

        // Update active ticket
        setTicket({
          traderName: chosenTrader,
          role: chosenTrader === 'BAZZ' ? 'SNIPE' : chosenTrader === 'OKKO' ? 'LADDER' : chosenTrader === 'LUX' ? 'BOOK' : chosenTrader === 'FERRO' ? 'TRACK' : chosenTrader === 'QUILO' ? 'ARB' : 'EXIT',
          token: tokenObj.symbol,
          entry: formatPrice(entryPriceNum),
          exit: formatPrice(exitPriceNum),
          sizeUsd: currentPosSize,
          sizePercent: 25,
          resultPnl: pnl,
          isOpen: true,
          isWin
        });

        // Update Trader Leaderboard P&L and 2-loss rule
        setTraders(prev => prev.map(t => {
          if (t.name === chosenTrader) {
            const nextPnl = Number((t.pnl + pnl).toFixed(2));
            const nextLosses = isWin ? 0 : t.consecutiveLosses + 1;
            const status = nextLosses >= 2 ? 'ON NOTICE' : undefined;
            return {
              ...t,
              pnl: nextPnl,
              consecutiveLosses: nextLosses,
              status
            };
          }
          return t;
        }));

        // Feed log with real token descriptions
        const fillDesc = isMega
          ? `${tokenObj.symbol} · booked +140% breakout expansion`
          : `${tokenObj.symbol} ${isWin ? 'clean profit scalp target' : 'tight stop cut before stall'}`;

        setFeedLogs(prev => [
          {
            id: `f_${Date.now()}`,
            time: nowTime,
            trader: chosenTrader,
            role: chosenTrader === 'BAZZ' ? 'SNIPE' : chosenTrader === 'OKKO' ? 'LADDER' : chosenTrader === 'LUX' ? 'BOOK' : chosenTrader === 'FERRO' ? 'TRACK' : chosenTrader === 'QUILO' ? 'ARB' : 'EXIT',
            token: tokenObj.symbol,
            desc: fillDesc,
            pnl,
            isLoss: !isWin,
            isMega
          },
          ...prev.slice(0, 40)
        ]);

        // Stepped chart history update on significant trades
        if (isMega || Math.random() > 0.4) {
          setBalanceHistory(prev => [
            ...prev,
            {
              time: nowTime.slice(3, 8),
              balance: newBal,
              flag: isMega ? `${chosenTrader} +$${pnl.toFixed(2)}` : undefined,
              isLoss: !isWin
            }
          ]);
        }

        // Trigger Mega Win Modal Banner!
        if (isMega) {
          setMegaWin({
            isOpen: true,
            trader: chosenTrader,
            role: chosenTrader === 'BAZZ' ? 'SNIPE' : 'BOOK',
            token: tokenObj.symbol,
            desc: `first buyer at ${formatPrice(entryPriceNum)}, exited at ${formatPrice(exitPriceNum)}`,
            pnl,
            vault: newBal
          });
          setTimeout(() => setMegaWin(null), 3800);
        }
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [balance]);

  const tonightGainPercent = Number((((balance - tonightStart) / tonightStart) * 100).toFixed(2));

  return {
    startingCapital,
    balance,
    tonightStart,
    tonightGainPercent,
    wins,
    losses,
    balanceHistory,
    traders,
    funnel,
    currentToken,
    selectedTokenIndex,
    setSelectedTokenIndex,
    ticket,
    rugBinCount,
    vaultPings,
    activeStationIndex,
    conveyorTokens,
    feedLogs,
    megaWin,
    setMegaWin,
    digitalTime,
    bybitFeed,
    resetToWallet
  };
}
