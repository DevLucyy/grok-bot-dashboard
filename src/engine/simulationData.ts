import { Trader } from '../types';

export const INITIAL_TRADERS: Trader[] = [
  {
    id: 'trader_1',
    handle: '@kai_blitz',
    name: 'Kai Blitz',
    initials: 'KB',
    avatarColor: 'from-amber-500 to-orange-600',
    rank: 1,
    weeklyRank: '#1 weekly',
    sevenDayReturn: 412,
    winRate: 66,
    copyRatio: 0.25,
    status: 'FOLLOWING',
    pnlWithUs: 18.94,
    lastSix: ['W', 'W', 'W', 'W', 'W', 'L']
  },
  {
    id: 'trader_2',
    handle: '@0xnora',
    name: '0x Nora',
    initials: 'NO',
    avatarColor: 'from-emerald-400 to-teal-600',
    rank: 2,
    weeklyRank: '#2 weekly',
    sevenDayReturn: 318,
    winRate: 74,
    copyRatio: 0.25,
    status: 'BENCH',
    pnlWithUs: 0,
    lastSix: ['W', 'W', 'W', 'W', 'W', 'W']
  },
  {
    id: 'trader_3',
    handle: '@sol_dumpling',
    name: 'Sol Dumpling',
    initials: 'SD',
    avatarColor: 'from-sky-400 to-blue-600',
    rank: 3,
    weeklyRank: '#3 weekly',
    sevenDayReturn: 286,
    winRate: 71,
    copyRatio: 0.25,
    status: 'BENCH',
    pnlWithUs: 0,
    lastSix: ['W', 'W', 'W', 'L', 'W', 'W']
  },
  {
    id: 'trader_4',
    handle: '@mint_mara',
    name: 'Mint Mara',
    initials: 'MM',
    avatarColor: 'from-fuchsia-500 to-rose-600',
    rank: 4,
    weeklyRank: '#4 weekly',
    sevenDayReturn: 241,
    winRate: 69,
    copyRatio: 0.25,
    status: 'BENCH',
    pnlWithUs: 0,
    lastSix: ['W', 'W', 'L', 'W', 'W', 'W']
  },
  {
    id: 'trader_5',
    handle: '@tenbag_ted',
    name: 'Tenbag Ted',
    initials: 'TT',
    avatarColor: 'from-indigo-500 to-violet-600',
    rank: 5,
    weeklyRank: '#5 weekly',
    sevenDayReturn: 198,
    winRate: 64,
    copyRatio: 0.25,
    status: 'BENCH',
    pnlWithUs: 0,
    lastSix: ['W', 'L', 'W', 'W', 'W', 'W']
  },
  {
    id: 'trader_6',
    handle: '@rugless_rio',
    name: 'Rugless Rio',
    initials: 'RR',
    avatarColor: 'from-teal-400 to-cyan-600',
    rank: 6,
    weeklyRank: '#6 weekly',
    sevenDayReturn: 167,
    winRate: 70,
    copyRatio: 0.25,
    status: 'BENCH',
    pnlWithUs: 0,
    lastSix: ['W', 'W', 'W', 'W', 'L', 'W']
  }
];

export const TOKEN_LIST = [
  '$SOL', '$BTC', '$ETH', '$SNEK', '$ZOOM', '$FLUFF', '$MOCHA', '$PEPE', '$WIF', '$BONK', '$POPCAT'
];

export const FUTURES_LIST = [
  { symbol: 'NQ', name: 'E-mini Nasdaq 100', tickSize: 0.25, tickValue: 5, basePrice: 20420.00 },
  { symbol: 'ES', name: 'E-mini S&P 500', tickSize: 0.25, tickValue: 12.50, basePrice: 5865.00 },
  { symbol: 'GC', name: 'Gold Futures', tickSize: 0.10, tickValue: 10, basePrice: 2725.50 },
  { symbol: 'CL', name: 'Crude Oil', tickSize: 0.01, tickValue: 10, basePrice: 71.80 }
];

export const ECONOMIC_EVENTS = [
  { name: 'US Core CPI YoY', impact: 'RED' as const },
  { name: 'FOMC Rate Decision & Press Conference', impact: 'RED' as const },
  { name: 'Non-Farm Payrolls (NFP)', impact: 'RED' as const },
  { name: 'Fed Chair Powell Testimony', impact: 'RED' as const },
  { name: 'US ISM Manufacturing PMI', impact: 'ORANGE' as const }
];

export const CRYPTO_STARTING_BALANCE = 42.00;
export const PROP_FIRM_STARTING_BALANCE = 50000.00;
export const PROP_FIRM_PROFIT_TARGET = 53000.00; // +$3,000
export const PROP_FIRM_TRAILING_MAX_LOSS = 2000.00; // -$2,000

export const BYBIT_STARTING_BALANCE = 15.00;
export const BYBIT_PROFIT_TARGET = 45.00; // 3x compound milestone ($15 -> $45)
export const BYBIT_MAX_RISK_PER_TRADE = 1.20; // 8% max risk handbrake ($1.20)

