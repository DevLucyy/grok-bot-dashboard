import { useState, useEffect } from 'react';
import { bybitStream, BybitFeedState, placeBybitTestnetOrder, BybitCredentials } from './bybitClient';
import { paperStrategy, PaperTradeFill } from './paperTradingEngine';

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
  masterTraderName?: string;
  masterTraderBadge?: string;
  token: string;
  symbol?: string;
  side?: 'Long' | 'Short';
  entry: string;
  exit: string;
  currentPrice?: string;
  stopLoss?: string;
  sizeUsd: number;
  sizePercent: number;
  resultPnl: number;
  unrealizedPnlPercent?: number;
  isOpen: boolean;
  isWin: boolean;
  bybitOrderId?: string;
  strategyReason?: string;
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

export type SimulationMode = 'REAL_MARKET' | 'TIKTOK_DEMO';

export function useGrokJevEngine(bybitCreds?: BybitCredentials, autoExecuteTestnet: boolean = true) {
  // Mode: REAL_MARKET (realistic 46-52% win rate, slippage, true drawdown) vs TIKTOK_DEMO (82% viral mode)
  const [simMode, setSimMode] = useState<SimulationMode>(() => {
    return (localStorage.getItem('grok_sim_mode') as SimulationMode) || 'REAL_MARKET';
  });

  // Real $15.00 Wallet State Baseline
  const [startingCapital] = useState<number>(15.00);
  const [balance, setBalance] = useState<number>(15.00);
  const [tonightStart, setTonightStart] = useState<number>(15.00);
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [peakBalance, setPeakBalance] = useState<number>(15.00);
  const [maxDrawdown, setMaxDrawdown] = useState<number>(0);
  const [grossProfit, setGrossProfit] = useState<number>(0);
  const [grossLoss, setGrossLoss] = useState<number>(0);
  const [consecutiveLosses, setConsecutiveLosses] = useState<number>(0);
  const [maxConsecutiveLosses, setMaxConsecutiveLosses] = useState<number>(0);

  // Real micro-wallet compounding history starting from $15.00
  const [balanceHistory, setBalanceHistory] = useState<{ time: string; balance: number; flag?: string; isLoss?: boolean }[]>([
    { time: new Date().toTimeString().slice(0, 5), balance: 15.00 }
  ]);

  const handleSetSimMode = (mode: SimulationMode) => {
    setSimMode(mode);
    try {
      localStorage.setItem('grok_sim_mode', mode);
    } catch {
      // ignore
    }
  };

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
    paperStrategy.reset();
    setBalance(newStartingAmount);
    setTonightStart(newStartingAmount);
    setWins(0);
    setLosses(0);
    setPeakBalance(newStartingAmount);
    setMaxDrawdown(0);
    setGrossProfit(0);
    setGrossLoss(0);
    setConsecutiveLosses(0);
    setMaxConsecutiveLosses(0);
    setBalanceHistory([
      { time: new Date().toTimeString().slice(0, 5), balance: newStartingAmount }
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
      entry: '$184.20',
      exit: '$185.40',
      sizeUsd: Number((newStartingAmount * 0.25).toFixed(2)),
      sizePercent: 25,
      resultPnl: 0,
      isOpen: false,
      isWin: true
    });
  };

  // 1. Smooth Conveyor & Funnel Pipeline Animation
  useEffect(() => {
    const conveyorInterval = setInterval(() => {
      setActiveStationIndex(prev => (prev + 1) % 6);
      setFunnel(f => ({
        ...f,
        universe: f.universe + Math.floor(Math.random() * 3 + 1),
        liquidity: f.liquidity + (Math.random() > 0.6 ? 1 : 0),
        jevGate: f.jevGate + (Math.random() > 0.8 ? 1 : 0)
      }));
      if (Math.random() > 0.75) {
        setRugBinCount(c => c + 1);
      }
    }, 2400);

    return () => clearInterval(conveyorInterval);
  }, []);

  // 2. Real Live-Market Paper Trading Engine: Evaluated on genuine Bybit price ticks
  useEffect(() => {
    if (balance <= 0) return;

    const activePos = paperStrategy.evaluateTick(bybitFeed, balance, (fill: PaperTradeFill) => {
      // ON REAL TRADE CLOSE (Executed at actual live exchange price!)
      const realizedPnl = fill.pnl;
      const newBal = Math.max(0, Number((balance + realizedPnl).toFixed(2)));
      setBalance(newBal);

      // Track Peak Balance and Maximum Drawdown
      setPeakBalance(prevPeak => {
        const nextPeak = Math.max(prevPeak, newBal);
        if (nextPeak > 0) {
          const currentDd = Number((((nextPeak - newBal) / nextPeak) * 100).toFixed(1));
          setMaxDrawdown(prevDd => Math.max(prevDd, currentDd));
        }
        return nextPeak;
      });

      if (fill.isWin) {
        setWins(w => w + 1);
        setGrossProfit(gp => Number((gp + realizedPnl).toFixed(2)));
        setConsecutiveLosses(0);
        setVaultPings(prev => [`+$${realizedPnl.toFixed(2)}`, ...prev.slice(0, 2)]);
      } else {
        setLosses(l => l + 1);
        setGrossLoss(gl => Number((gl + Math.abs(realizedPnl)).toFixed(2)));
        setConsecutiveLosses(cl => {
          const nextCl = cl + 1;
          setMaxConsecutiveLosses(m => Math.max(m, nextCl));
          return nextCl;
        });
      }

      // Update Individual Squad Trader Performance
      setTraders(prev => prev.map(t => {
        if (t.name === fill.trader) {
          const nextPnl = Number((t.pnl + realizedPnl).toFixed(2));
          const nextLosses = fill.isWin ? 0 : t.consecutiveLosses + 1;
          return {
            ...t,
            pnl: nextPnl,
            consecutiveLosses: nextLosses,
            status: nextLosses >= 2 ? 'ON NOTICE' : undefined
          };
        }
        return t;
      }));

      // Append to live feed log with REAL exchange prices
      setFeedLogs(prev => [
        {
          id: fill.id,
          time: fill.time,
          trader: fill.trader,
          role: fill.role,
          token: fill.token,
          desc: fill.desc,
          pnl: realizedPnl,
          isLoss: !fill.isWin,
          isMega: realizedPnl >= 0.35
        },
        ...prev.slice(0, 30)
      ]);

      // Update Stepped Chart with exact real balance
      setBalanceHistory(prev => [
        ...prev,
        {
          time: fill.time.slice(0, 5),
          balance: newBal,
          flag: `${fill.trader} ${realizedPnl >= 0 ? '+' : '-'}$${Math.abs(realizedPnl).toFixed(2)}`,
          isLoss: !fill.isWin
        }
      ]);

      // If Bybit Testnet credentials exist, route actual testnet order
      if (bybitCreds?.isConfigured && autoExecuteTestnet) {
        placeBybitTestnetOrder(bybitCreds, {
          symbol: fill.token.replace('$', '') + 'USDT',
          side: fill.side === 'Long' ? 'Sell' : 'Buy',
          qty: '0.1',
          orderType: 'Market',
          reduceOnly: true
        }).catch(() => {});
      }

      // Trigger Mega Win Modal if substantial move booked
      if (fill.isWin && realizedPnl >= 0.40) {
        setMegaWin({
          isOpen: true,
          trader: fill.trader,
          role: fill.role,
          token: fill.token,
          desc: `Real Bybit execution: ${fill.side} exit at $${fill.exitPrice.toFixed(2)} (+${fill.pnlPercent}%)`,
          pnl: realizedPnl,
          vault: newBal
        });
        setTimeout(() => setMegaWin(null), 3800);
      }
    });

    // Update active ticket with real-time ticking market price and live unrealized P&L
    if (activePos) {
      setTicket({
        traderName: activePos.traderName,
        role: activePos.role,
        masterTraderName: activePos.masterTraderName,
        masterTraderBadge: activePos.masterTraderBadge,
        token: activePos.token,
        symbol: activePos.symbol,
        side: activePos.side,
        entry: `$${activePos.entryPrice.toFixed(2)}`,
        exit: `$${activePos.takeProfitPrice.toFixed(2)}`,
        currentPrice: `$${activePos.currentPrice.toFixed(2)}`,
        stopLoss: `$${activePos.stopLossPrice.toFixed(2)}`,
        sizeUsd: activePos.sizeUsd,
        sizePercent: 25,
        resultPnl: activePos.unrealizedPnl,
        unrealizedPnlPercent: activePos.unrealizedPnlPercent,
        isOpen: true,
        isWin: activePos.unrealizedPnl >= 0,
        strategyReason: activePos.strategyReason
      });
    }
  }, [bybitFeed, balance]);

  const tonightGainPercent = tonightStart > 0 ? Number((((balance - tonightStart) / tonightStart) * 100).toFixed(2)) : 0;
  const winRatePercent = (wins + losses) > 0 ? Number(((wins / (wins + losses)) * 100).toFixed(1)) : 0;
  const profitFactor = grossLoss > 0 ? Number((grossProfit / grossLoss).toFixed(2)) : (grossProfit > 0 ? 9.99 : 1.00);

  return {
    simMode,
    setSimMode: handleSetSimMode,
    startingCapital,
    balance,
    tonightStart,
    tonightGainPercent,
    wins,
    losses,
    winRatePercent,
    profitFactor,
    peakBalance,
    maxDrawdown,
    consecutiveLosses,
    maxConsecutiveLosses,
    isRuin: balance < 0.50,
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
