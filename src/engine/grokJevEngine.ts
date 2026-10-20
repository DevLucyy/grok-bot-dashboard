import { useState, useEffect } from 'react';
import { bybitStream, BybitFeedState } from './bybitClient';

export interface JevToken {
  symbol: string;
  name: string;
  mcap: string;
  price: string;
  change24h: number;
  vol24h: string;
  liquidity: string;
  holders: string;
  initials: string;
  color: string;
}

export const WATCHLIST_TOKENS: JevToken[] = [
  { symbol: '$KROAK', name: 'Kroak', mcap: '$2.05M', price: '$0.002045', change24h: -13.52, vol24h: '$5.99M', liquidity: '$86.9K', holders: '1.9K', initials: 'K', color: 'from-amber-400 to-emerald-500' },
  { symbol: '$PROKK', name: 'Prokk', mcap: '$1.51M', price: '$0.001606', change24h: -18.98, vol24h: '$7.37M', liquidity: '$40.8K', holders: '1.9K', initials: 'P', color: 'from-emerald-400 to-teal-500' },
  { symbol: '$SLIMO', name: 'Slimo', mcap: '$4.94M', price: '$0.004948', change24h: -13.55, vol24h: '$7.53M', liquidity: '$130.6K', holders: '5.4K', initials: 'S', color: 'from-purple-400 to-indigo-500' },
  { symbol: '$NERDO', name: 'Nerdo', mcap: '$2.36M', price: '$0.002330', change24h: -23.38, vol24h: '$2.77M', liquidity: '$101.9K', holders: '0.9K', initials: 'N', color: 'from-rose-400 to-pink-500' },
  { symbol: '$MOON', name: 'Moon', mcap: '$3.12M', price: '$0.003120', change24h: 14.20, vol24h: '$4.12M', liquidity: '$95.2K', holders: '2.4K', initials: 'M', color: 'from-cyan-400 to-blue-500' },
  { symbol: '$LONG', name: 'Long', mcap: '$1.88M', price: '$0.001880', change24h: -8.45, vol24h: '$2.15M', liquidity: '$62.1K', holders: '1.2K', initials: 'L', color: 'from-blue-400 to-cyan-500' },
  { symbol: '$GATO', name: 'Gato', mcap: '$5.20M', price: '$0.005200', change24h: 32.10, vol24h: '$8.40M', liquidity: '$150.0K', holders: '6.1K', initials: 'G', color: 'from-amber-400 to-orange-500' },
  { symbol: '$ZERO', name: 'Zero', mcap: '$0.95M', price: '$0.000950', change24h: -5.10, vol24h: '$1.10M', liquidity: '$35.0K', holders: '0.8K', initials: 'Z', color: 'from-slate-400 to-zinc-500' },
  { symbol: '$LOOP', name: 'Loop', mcap: '$2.45M', price: '$0.002450', change24h: 7.80, vol24h: '$3.50M', liquidity: '$80.0K', holders: '1.7K', initials: 'L', color: 'from-teal-400 to-emerald-500' },
  { symbol: '$ROKK', name: 'Rokk', mcap: '$3.80M', price: '$0.003800', change24h: -11.20, vol24h: '$4.90M', liquidity: '$110.0K', holders: '3.2K', initials: 'R', color: 'from-rose-500 to-red-600' },
  { symbol: '$LION', name: 'Lion', mcap: '$6.40M', price: '$0.006400', change24h: 19.50, vol24h: '$9.20M', liquidity: '$180.0K', holders: '7.5K', initials: 'L', color: 'from-yellow-400 to-amber-600' },
  { symbol: '$HAPPY', name: 'Happy', mcap: '$1.40M', price: '$0.001400', change24h: 4.30, vol24h: '$1.80M', liquidity: '$45.0K', holders: '1.1K', initials: 'H', color: 'from-emerald-400 to-green-600' },
  { symbol: '$PEPE', name: 'Pepe', mcap: '$8.90M', price: '$0.008900', change24h: -3.80, vol24h: '$14.20M', liquidity: '$260.0K', holders: '11.2K', initials: 'P', color: 'from-green-500 to-emerald-700' },
  { symbol: '$CLONE', name: 'Clone', mcap: '$2.10M', price: '$0.002100', change24h: -9.50, vol24h: '$2.90M', liquidity: '$72.0K', holders: '1.5K', initials: 'C', color: 'from-purple-500 to-violet-700' }
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

export function useGrokJevEngine() {
  // Balance trajectory
  const [balance, setBalance] = useState<number>(12718.36);
  const [tonightStart] = useState<number>(6104.90);
  const [wins, setWins] = useState<number>(73);
  const [losses, setLosses] = useState<number>(15);
  const [balanceHistory, setBalanceHistory] = useState<{ time: string; balance: number; flag?: string; isLoss?: boolean }[]>([
    { time: '03:00', balance: 6104.90 },
    { time: '03:03', balance: 6730.00, flag: 'BAZZ +$626' },
    { time: '03:05', balance: 7384.00, flag: 'FERRO +$654' },
    { time: '03:07', balance: 8286.00, flag: 'OKKO +$902' },
    { time: '03:09', balance: 9285.00, flag: 'QUILO +$999' },
    { time: '03:10', balance: 8603.00, flag: 'TOMI -$682', isLoss: true },
    { time: '03:12', balance: 9835.00, flag: 'BAZZ +$1,232' },
    { time: '03:14', balance: 11058.00 },
    { time: '03:14', balance: 12718.36, flag: 'LUX +$1,223' }
  ]);

  // Traders Leaderboard
  const [traders, setTraders] = useState<TraderStats[]>([
    { id: 'bazz', name: 'BAZZ', role: 'SNIPE', pnl: 2016.40, color: '#06b6d4', textColor: 'text-cyan-400', consecutiveLosses: 0 },
    { id: 'okko', name: 'OKKO', role: 'LADDER', pnl: 1525.91, color: '#a855f7', textColor: 'text-purple-400', consecutiveLosses: 0 },
    { id: 'lux', name: 'LUX', role: 'BOOK', pnl: 1462.29, color: '#f8fafc', textColor: 'text-white', consecutiveLosses: 0 },
    { id: 'quilo', name: 'QUILO', role: 'ARB', pnl: 1044.84, color: '#f43f5e', textColor: 'text-pink-400', consecutiveLosses: 0 },
    { id: 'ferro', name: 'FERRO', role: 'TRACK', pnl: 896.26, color: '#38bdf8', textColor: 'text-blue-400', consecutiveLosses: 0 },
    { id: 'tomi', name: 'TOMI', role: 'EXIT', pnl: -332.24, color: '#fb7185', textColor: 'text-rose-400', status: 'ON NOTICE', consecutiveLosses: 2 }
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

  // Active Ticket
  const [ticket, setTicket] = useState<TicketState>({
    traderName: 'LUX',
    role: 'BOOK',
    token: '$KROAK',
    entry: '$1.75M',
    exit: '$2.45M',
    sizeUsd: 3047.52,
    sizePercent: 27,
    resultPnl: 1223.44,
    isOpen: true,
    isWin: true
  });

  // The Line Pipeline state
  const [rugBinCount, setRugBinCount] = useState<number>(33);
  const [vaultPings, setVaultPings] = useState<string[]>(['+$41.01', '+$63.24']);
  const [activeStationIndex, setActiveStationIndex] = useState<number>(4); // LUX active
  const [conveyorTokens] = useState<string[]>([
    '$KROAK', '$SKRUB', '$GLORB', '$CHONK', '$DERPO', '$POTTS', '$WUBBA', '$JIBBO', '$BIBI'
  ]);

  // Line Feed Logs
  const [feedLogs, setFeedLogs] = useState<FeedFill[]>([
    { id: 'f1', time: '03:14:39', trader: 'BAZZ', role: 'SNIPE', token: '$JIBBO', desc: '$JIBBO fresh mint', pnl: -76.66, isLoss: true },
    { id: 'f2', time: '03:14:34', trader: 'OKKO', role: 'LADDER', token: '$BIBI', desc: '$BIBI step 2/4', pnl: 83.50, isLoss: false },
    { id: 'f3', time: '03:14:25', trader: 'TOMI', role: 'EXIT', token: '$GLORB', desc: '$GLORB clean exit', pnl: -51.11, isLoss: true },
    { id: 'f4', time: '03:14:14', trader: 'OKKO', role: 'LADDER', token: '$DERPO', desc: '$DERPO trim 25%', pnl: 75.46, isLoss: false },
    { id: 'f5', time: '03:14:08', trader: 'LUX', role: 'BOOK', token: '$KROAK', desc: '$KROAK · booked the full bag, $1.75M → $2.45M', pnl: 1223.44, isLoss: false, isMega: true },
    { id: 'f6', time: '03:13:59', trader: 'OKKO', role: 'LADDER', token: '$GLORB', desc: '$GLORB step 3/4', pnl: 59.94, isLoss: false },
    { id: 'f7', time: '03:13:50', trader: 'FERRO', role: 'TRACK', token: '$CHONK', desc: '$CHONK wallet in', pnl: 16.86, isLoss: false }
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

  // Autonomous Copy-Trading Cycle
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Advance conveyor station
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

      // 4. Trade Execution (80% Win rate matching Grok Bot video)
      if (Math.random() > 0.55) {
        const traderOrder = ['BAZZ', 'OKKO', 'LUX', 'FERRO', 'QUILO', 'TOMI'];
        const chosenTrader = traderOrder[Math.floor(Math.random() * traderOrder.length)];
        const tokenObj = WATCHLIST_TOKENS[Math.floor(Math.random() * WATCHLIST_TOKENS.length)];
        const isWin = Math.random() < 0.82; // 82% win rate

        let pnl = 0;
        let isMega = false;
        if (isWin) {
          if (Math.random() > 0.85) {
            // Mega Win!
            pnl = Number((Math.random() * 800 + 550).toFixed(2)); // +$550 to +$1,350
            isMega = true;
          } else {
            pnl = Number((Math.random() * 95 + 22).toFixed(2)); // +$22 to +$117
          }
        } else {
          pnl = -Number((Math.random() * 80 + 35).toFixed(2)); // -$35 to -$115
        }

        const nowTime = new Date().toTimeString().split(' ')[0];
        const newBal = Number((balance + pnl).toFixed(2));
        setBalance(newBal);

        if (isWin) {
          setWins(w => w + 1);
          setVaultPings(prev => [`+$${pnl.toFixed(2)}`, ...prev.slice(0, 2)]);
        } else {
          setLosses(l => l + 1);
        }

        // Update active ticket
        setTicket({
          traderName: chosenTrader,
          role: chosenTrader === 'BAZZ' ? 'SNIPE' : chosenTrader === 'OKKO' ? 'LADDER' : chosenTrader === 'LUX' ? 'BOOK' : chosenTrader === 'FERRO' ? 'TRACK' : chosenTrader === 'QUILO' ? 'ARB' : 'EXIT',
          token: tokenObj.symbol,
          entry: `$${(Math.random() * 1.5 + 1.2).toFixed(2)}M`,
          exit: isWin ? `$${(Math.random() * 1.5 + 2.0).toFixed(2)}M` : '-',
          sizeUsd: Number((newBal * 0.27).toFixed(2)),
          sizePercent: 27,
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

        // Feed log
        const fillDesc = isMega
          ? `${tokenObj.symbol} · booked the full bag, $1.75M → $2.45M`
          : `${tokenObj.symbol} ${isWin ? 'clean profit target' : 'cut before dump'}`;

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
        if (isMega || Math.random() > 0.5) {
          setBalanceHistory(prev => [
            ...prev,
            {
              time: nowTime.slice(3, 8),
              balance: newBal,
              flag: isMega ? `${chosenTrader} +$${Math.round(pnl)}` : undefined,
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
            desc: `first buyer at $1.39M, gone at $2.45M`,
            pnl,
            vault: newBal
          });
          setTimeout(() => setMegaWin(null), 4000);
        }
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [balance]);

  const tonightGainPercent = Number((((balance - tonightStart) / tonightStart) * 100).toFixed(2));

  return {
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
    bybitFeed
  };
}
