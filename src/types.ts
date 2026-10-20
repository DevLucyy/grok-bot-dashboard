export type TraderStatus = 'FOLLOWING' | 'FIRED' | 'BENCH';

export interface Trader {
  id: string;
  handle: string;
  name: string;
  initials: string;
  avatarColor: string;
  rank: number;
  weeklyRank: string;
  sevenDayReturn: number;
  winRate: number;
  copyRatio: number;
  status: TraderStatus;
  pnlWithUs: number;
  lastSix: ('W' | 'L')[];
}

export type LogType = 'COPY' | 'EXIT' | 'FIRE' | 'SCAN' | 'PICK' | 'SYSTEM' | 'QUANT' | 'HERMES' | 'EVOLUTION';

export interface TradeLog {
  id: string;
  timestamp: string;
  type: LogType;
  traderHandle?: string;
  token?: string;
  action?: 'bought' | 'sold' | 'fired' | 'picked' | 'scanned' | 'approved' | 'vetoed' | 'evolved';
  amountUsd?: number;
  pnlUsd?: number;
  pnlPercent?: number;
  copyRatio?: string;
  message: string;
  isLoss?: boolean;
}

export interface ChartPoint {
  timeIndex: number;
  timeLabel: string;
  balance: number;
  traderHandle: string;
  traderColor: string;
  isFiredPoint?: boolean;
  isHandoverPoint?: boolean;
}

export type MarketRegime = 'TRENDING' | 'MEAN_REVERTING' | 'HIGH_VOL' | 'CRISIS';

export interface QuantState {
  regime: MarketRegime;
  midPrice: number;
  spreadPercent: number;
  orderBookImbalance: number; // -1.0 to +1.0
  realizedVolatility: number; // e.g. 18.4%
  currentDrawdown: number; // e.g. 2.1%
  maxDrawdownLimit: number; // 15.0%
  armedKillSwitch: boolean;
  fractionalKelly: number; // 0.25 (Quarter-Kelly)
  confidence: number; // 0.0 to 1.0
  setupQuality: number; // 0 to 3
  reflexLatencyMs: number; // ~81ms
  deepBrainEscalations: number;
}

export type EngineMode = 'COPY_TRADING' | 'QUANT_REGIME' | 'HERMES_DESK';
export type MarketCategory = 'CRYPTO' | 'PROP_FIRM' | 'BYBIT_TESTNET';
export type ExecutionMode = 'AUTOPILOT' | 'SEMI_AUTO';

// 7-Agent Committee Types
export interface AtlasAgent {
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  macroSummary: string;
  keyLevel: number;
  confidence: number;
}

export interface LumenAgent {
  newsStatus: 'CLEAR' | 'CAUTION' | 'DESK_LOCKED';
  nextEvent: string;
  minutesUntil: number;
  isLocked: boolean;
}

export interface HydraAgent {
  setupGrade: 'A+' | 'A' | 'B' | 'C' | 'VETOED';
  score: number; // 0 - 100
  reasons: string[];
  isVetoed: boolean;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  confirm?: boolean;
}

export interface SentinelAgent {
  riskUsd: number;
  riskPercent: number; // e.g. 0.75%
  consecutiveLosses: number;
  maxLosses: number; // 2
  isHalted: boolean;
  isDefensiveMode?: boolean;
  defensiveCyclesLeft?: number;
}

export interface HephaestusAgent {
  instrument: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  riskRewardRatio: number;
}

export interface MnemosyneAgent {
  totalReviewed: number;
  totalApproved: number;
  totalVetoed: number;
  winRate: number;
  recentLearnings: string[];
}

export interface HermesAgent {
  verdict: 'APPROVE' | 'VETO' | 'STAND_ASIDE' | 'PENDING_USER_APPROVAL';
  confidence: number;
  summary: string;
}

export interface HermesCommittee {
  atlas: AtlasAgent;
  lumen: LumenAgent;
  hydra: HydraAgent;
  sentinel: SentinelAgent;
  hephaestus: HephaestusAgent;
  mnemosyne: MnemosyneAgent;
  hermes: HermesAgent;
}

// Self-Evolving Learning State
export interface AdaptiveWeights {
  regimePrecision: number; // bonus %
  falseBreakoutFilter: number; // bonus %
  sentimentCalibration: number; // bonus %
  dynamicSizingEdge: number; // bonus %
}

export interface EvolutionEvent {
  id: string;
  timestamp: string;
  text: string;
  type: 'XP' | 'LEVEL_UP' | 'WEIGHT_UPDATE';
}

export interface EvolutionState {
  level: number;
  title: string;
  xp: number;
  nextLevelXp: number;
  currentLevelMinXp?: number;
  winStreak: number;
  totalTrades: number;
  totalWins: number;
  adaptiveWeights: AdaptiveWeights;
  recentEvolutions: EvolutionEvent[];
}

export interface PendingOrder {
  id: string;
  instrument: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  riskUsd: number;
  riskPercent: number;
  setupGrade: string;
  gradeScore: number;
  rationale: string;
  timeRemainingSec: number;
  potentialProfitUsd: number;
}

export interface LivePosition {
  id: string;
  instrument: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  sizeContracts: number;
  notionalUsd: number;
  marginUsedUsd: number;
  leverage: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  liquidationPrice: number;
  unrealizedPnlUsd: number;
  unrealizedPnlPercent: number;
  openedAt: string;
  elapsedSec: number;
  takerFeeUsd: number;
}

