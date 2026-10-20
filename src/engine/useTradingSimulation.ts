import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trader,
  TradeLog,
  ChartPoint,
  QuantState,
  EngineMode,
  MarketCategory,
  ExecutionMode,
  HermesCommittee,
  PendingOrder,
  EvolutionState,
  LivePosition
} from '../types';
import {
  INITIAL_TRADERS,
  TOKEN_LIST,
  FUTURES_LIST,
  ECONOMIC_EVENTS,
  CRYPTO_STARTING_BALANCE,
  PROP_FIRM_STARTING_BALANCE,
  PROP_FIRM_TRAILING_MAX_LOSS,
  BYBIT_STARTING_BALANCE
} from './simulationData';
import {
  loadStoredEvolution,
  addExperience,
  adaptWeightsOnOutcome
} from './evolutionEngine';
import {
  bybitStream,
  BybitFeedState,
  BybitCredentials,
  loadBybitCredentials
} from './bybitClient';

export const BYBIT_TESTNET_STARTING_BALANCE = BYBIT_STARTING_BALANCE; // $15.00

export function useTradingSimulation() {
  const [mode, setMode] = useState<EngineMode>('HERMES_DESK');
  const [marketCategory, setMarketCategory] = useState<MarketCategory>('BYBIT_TESTNET');
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('AUTOPILOT');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(2); // 1x, 2x, 5x, 10x
  const [currentThought, setCurrentThought] = useState<string>(
    'Bybit V5 Real-Tick Engine online ($15.00 Capital). Order book WebSocket connected. Scanning linear perps.'
  );

  // Active Real-Tick Live Position
  const [activePosition, setActivePosition] = useState<LivePosition | null>(null);
  const livePositionRef = useRef<LivePosition | null>(null);
  livePositionRef.current = activePosition;

  // Bybit V5 Live Feed & Credentials
  const [bybitFeed, setBybitFeed] = useState<BybitFeedState>(bybitStream.state);
  const [bybitCreds, setBybitCreds] = useState<BybitCredentials>(() => loadBybitCredentials());

  useEffect(() => {
    const unsub = bybitStream.subscribe((state) => {
      setBybitFeed(state);
    });
    return unsub;
  }, []);

  // Account balances based on market
  const startingBalance = marketCategory === 'PROP_FIRM'
    ? PROP_FIRM_STARTING_BALANCE
    : marketCategory === 'BYBIT_TESTNET'
    ? BYBIT_TESTNET_STARTING_BALANCE
    : CRYPTO_STARTING_BALANCE;
  const [balance, setBalance] = useState<number>(startingBalance);
  const [tradesCopied, setTradesCopied] = useState<number>(0);
  const [lossesInARow, setLossesInARow] = useState<number>(0);
  const [firedCount, setFiredCount] = useState<number>(0);
  const [defensiveCyclesLeft, setDefensiveCyclesLeft] = useState<number>(0);

  const [traders, setTraders] = useState<Trader[]>(INITIAL_TRADERS);
  const [activeTraderId, setActiveTraderId] = useState<string>('trader_1');

  // Self-Evolving Engine State
  const [evolution, setEvolution] = useState<EvolutionState>(() => loadStoredEvolution());

  // Pending Human-In-The-Loop Order
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);

  // 7-Agent Committee State
  const [committee, setCommittee] = useState<HermesCommittee>({
    atlas: {
      bias: 'BULLISH',
      macroSummary: 'Higher-timeframe 4H market structure holds above 20,380 support. S&P/Nasdaq divergence resolving bullish.',
      keyLevel: 20385.00,
      confidence: 86
    },
    lumen: {
      newsStatus: 'CLEAR',
      nextEvent: 'US Core CPI YoY in 3h 40m',
      minutesUntil: 220,
      isLocked: false
    },
    hydra: {
      setupGrade: 'A+',
      score: 93,
      reasons: ['Order book bid stack +42%', 'VWAP reclaim on volume', 'Liquidity sweep complete'],
      isVetoed: false
    },
    sentinel: {
      riskUsd: 375.00,
      riskPercent: 0.75,
      consecutiveLosses: 0,
      maxLosses: 2,
      isHalted: false,
      isDefensiveMode: false,
      defensiveCyclesLeft: 0
    },
    hephaestus: {
      instrument: 'NQ',
      action: 'BUY',
      entryPrice: 20412.50,
      stopLoss: 20387.50,
      targetPrice: 20487.50,
      riskRewardRatio: 3.0
    },
    mnemosyne: {
      totalReviewed: 18,
      totalApproved: 14,
      totalVetoed: 4,
      winRate: 78.5,
      recentLearnings: [
        'Learned: Jittery regime + high spread = 72% loss probability on breakouts. Hydra weight updated.',
        'Learned: Calm regime + OBI > +0.40 has 83% win rate on mean reversion. Kelly size expanded.'
      ]
    },
    hermes: {
      verdict: 'APPROVE',
      confidence: 91,
      summary: 'High-conviction A+ breakout. Hydra scored 93/100, Sentinel sized to strict 0.75% ($375). Lumen confirms clean news window.'
    }
  });

  const [logs, setLogs] = useState<TradeLog[]>([
    {
      id: 'init_1',
      timestamp: '00:01:12',
      type: 'HERMES',
      message: '7-Agent Hermes Desk Initialized. Atlas, Lumen, Hydra, Sentinel, Hephaestus, Mnemosyne active.'
    },
    {
      id: 'init_2',
      timestamp: '00:01:25',
      type: 'EVOLUTION',
      message: `Neural Evolution Core loaded. Current Rank: Level ${evolution.level} — ${evolution.title}.`
    }
  ]);

  const [chartHistory, setChartHistory] = useState<ChartPoint[]>([
    {
      timeIndex: 0,
      timeLabel: '00:00:00',
      balance: startingBalance,
      traderHandle: '@kai_blitz',
      traderColor: '#f59e0b'
    }
  ]);

  const [quantState, setQuantState] = useState<QuantState>({
    regime: 'TRENDING',
    midPrice: marketCategory === 'PROP_FIRM' ? 20420.00 : 67420.50,
    spreadPercent: 0.018,
    orderBookImbalance: 0.42,
    realizedVolatility: 19.2,
    currentDrawdown: 0.0,
    maxDrawdownLimit: marketCategory === 'PROP_FIRM' ? 4.0 : 15.0, // Topstep max drawdown is $2k on $50k = 4.0%
    armedKillSwitch: true,
    fractionalKelly: 0.25,
    confidence: 0.88,
    setupQuality: 3,
    reflexLatencyMs: 81,
    deepBrainEscalations: 0
  });

  const peakBalanceRef = useRef<number>(startingBalance);
  const activeTrader = traders.find(t => t.id === activeTraderId) || traders[0];

  // Mastermind Automated Handover & Defensive Protocol
  const triggerMastermindAutoHandover = useCallback((reason: string) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const failingTrader = traders.find(t => t.id === activeTraderId) || activeTrader;

    // Find best available bench candidate (highest winRate among non-failing traders)
    let candidates = traders.filter(t => t.id !== activeTraderId && t.status !== 'FIRED');
    if (candidates.length === 0) {
      candidates = traders.filter(t => t.id !== activeTraderId);
    }
    candidates.sort((a, b) => b.winRate - a.winRate);
    const nextTrader = candidates[0] || traders[0];

    // Auto rotate trader on the desk
    setTraders(prev => prev.map(t => {
      if (t.id === activeTraderId) return { ...t, status: 'FIRED' };
      if (t.id === nextTrader.id) return { ...t, status: 'FOLLOWING' };
      return t;
    }));
    setActiveTraderId(nextTrader.id);

    // Reset loss counters & engage Mastermind Defensive Mode
    setLossesInARow(0);
    setFiredCount(f => f + 1);
    setDefensiveCyclesLeft(2);

    // Sentinel unhalted & resized, Hydra threshold raised to 85+ (A+ only)
    setCommittee(prev => ({
      ...prev,
      sentinel: {
        ...prev.sentinel,
        consecutiveLosses: 0,
        isHalted: false,
        isDefensiveMode: true,
        defensiveCyclesLeft: 2,
        riskPercent: 0.35,
        riskUsd: Number((balance * 0.0035).toFixed(2))
      },
      hydra: {
        ...prev.hydra,
        setupGrade: 'A+',
        reasons: ['Defensive Confluence Filter Active (85+ Score Gate)', 'False Breakout Rejection Buffer']
      }
    }));

    // Record Handover point on Stepped Chart
    setChartHistory(prev => [
      ...prev,
      {
        timeIndex: prev.length,
        timeLabel: timeStr,
        balance,
        traderHandle: nextTrader.handle,
        traderColor: '#ec4899',
        isHandoverPoint: true,
        isFiredPoint: true
      }
    ]);

    // Prominent Mastermind Feed Alerts
    setLogs(prev => [
      {
        id: `fire_lock_${Date.now()}`,
        timestamp: timeStr,
        type: 'FIRE',
        message: `🛑 2-STRIKE DEFENSIVE TRIGGER: ${failingTrader.handle} benched (${reason}).`
      },
      {
        id: `auto_rotate_${Date.now() + 1}`,
        timestamp: timeStr,
        type: 'HERMES',
        message: `⚡ MASTERMIND AUTO-ROTATION: Desk handed to bench leader ${nextTrader.handle} (${nextTrader.winRate}% WR). 100% autonomous.`
      },
      {
        id: `defensive_protocol_${Date.now() + 2}`,
        timestamp: timeStr,
        type: 'QUANT',
        message: `🛡️ SENTINEL DEFENSIVE PROTOCOL: Risk reduced to 0.35% for 2 cycles & Hydra score threshold raised to 85+ (A+ only).`
      },
      ...prev.slice(0, 35)
    ]);

    setCurrentThought(`[${timeStr}] ⚡ MASTERMIND 2-LOSS OVERRIDE: ${failingTrader.handle} benched. Auto-promoted ${nextTrader.handle} (${nextTrader.winRate}% WR). Defensive 0.35% sizing engaged.`);
  }, [traders, activeTraderId, activeTrader, balance]);

  // Handle market switch
  const switchMarket = (targetMarket: MarketCategory) => {
    setMarketCategory(targetMarket);
    const newStart = targetMarket === 'PROP_FIRM'
      ? PROP_FIRM_STARTING_BALANCE
      : targetMarket === 'BYBIT_TESTNET'
      ? BYBIT_TESTNET_STARTING_BALANCE
      : CRYPTO_STARTING_BALANCE;
    setBalance(newStart);
    peakBalanceRef.current = newStart;
    setTradesCopied(0);
    setLossesInARow(0);
    setPendingOrder(null);
    setChartHistory([
      {
        timeIndex: 0,
        timeLabel: new Date().toTimeString().split(' ')[0],
        balance: newStart,
        traderHandle: activeTrader.handle,
        traderColor: '#f59e0b'
      }
    ]);
    setLogs(prev => [
      {
        id: `mkt_${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'SYSTEM',
        message: targetMarket === 'BYBIT_TESTNET'
          ? 'Switched to Bybit V5 Real-Tick Engine ($15.00 Micro Capital). Live WebSocket Depth Connected.'
          : targetMarket === 'PROP_FIRM'
          ? 'Switched to Topstep $50K Futures Mode (NQ, ES, GC, CL). Target: $53,000 | Trailing Stop: $48,000.'
          : 'Switched to Crypto Mode ($42 -> Compounding Spot & Perps).'
      },
      ...prev
    ]);
  };

  // Close active position manually
  const closeActivePositionManually = useCallback(() => {
    if (!livePositionRef.current) return;
    const pos = livePositionRef.current;
    const finalPnl = pos.unrealizedPnlUsd;
    const isWin = finalPnl >= 0;
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newBal = Number((balance + finalPnl).toFixed(2));

    setBalance(newBal);
    if (newBal > peakBalanceRef.current) peakBalanceRef.current = newBal;
    setTradesCopied(prev => prev + 1);

    if (isWin) {
      setLossesInARow(0);
      setEvolution(prev => {
        const withExp = addExperience(prev, 35, `Manual Market Close on ${pos.instrument} (+${finalPnl} USD)`);
        return adaptWeightsOnOutcome(withExp, true, 88);
      });
    } else {
      setLossesInARow(prev => prev + 1);
      setEvolution(prev => {
        const withExp = addExperience(prev, 15, `Manual Market Close on ${pos.instrument} (${finalPnl} USD)`);
        return adaptWeightsOnOutcome(withExp, false, 60);
      });
    }

    setLogs(prev => [
      {
        id: `man_${Date.now()}`,
        timestamp: timeStr,
        type: 'HERMES',
        action: isWin ? 'bought' : 'sold',
        token: pos.instrument,
        pnlUsd: finalPnl,
        pnlPercent: pos.unrealizedPnlPercent,
        isLoss: !isWin,
        message: `⚡ MANUAL MARKET CLOSE: ${pos.instrument} closed at $${pos.currentPrice.toLocaleString()}. Net P&L: ${isWin ? '+' : ''}$${finalPnl}`
      },
      ...prev.slice(0, 35)
    ]);

    setChartHistory(prev => [
      ...prev,
      {
        timeIndex: prev.length,
        timeLabel: timeStr,
        balance: newBal,
        traderHandle: activeTrader.handle,
        traderColor: '#38bdf8'
      }
    ]);

    setActivePosition(null);
    livePositionRef.current = null;
    setCurrentThought(`[${timeStr}] Position closed manually: P&L ${isWin ? '+' : ''}$${finalPnl} · Bankroll now $${newBal}`);
  }, [balance, activeTrader]);

  // Real Bybit Live Tick P&L and TP/SL Evaluation
  useEffect(() => {
    const pos = livePositionRef.current;
    if (!pos) return;

    const ticker = bybitFeed.tickers[pos.instrument];
    if (!ticker || !ticker.lastPrice) return;

    const livePrice = ticker.lastPrice;
    const isLong = pos.action === 'BUY';
    const diff = isLong ? livePrice - pos.entryPrice : pos.entryPrice - livePrice;
    const unrealizedUsd = Number(((diff * pos.sizeContracts) - pos.takerFeeUsd).toFixed(2));
    const unrealizedPct = Number(((unrealizedUsd / pos.marginUsedUsd) * 100).toFixed(2));

    // Check Take Profit or Stop Loss hit on physical price touch
    const isTpHit = isLong ? livePrice >= pos.takeProfitPrice : livePrice <= pos.takeProfitPrice;
    const isSlHit = isLong ? livePrice <= pos.stopLossPrice : livePrice >= pos.stopLossPrice;

    if (isTpHit || isSlHit) {
      const isWin = isTpHit;
      const finalPnl = isWin 
        ? Math.abs(Number(((Math.abs(pos.takeProfitPrice - pos.entryPrice) * pos.sizeContracts) - pos.takerFeeUsd).toFixed(2)))
        : -Math.abs(Number(((Math.abs(pos.entryPrice - pos.stopLossPrice) * pos.sizeContracts) + pos.takerFeeUsd).toFixed(2)));

      const timeStr = new Date().toTimeString().split(' ')[0];
      const newBal = Number((balance + finalPnl).toFixed(2));

      setBalance(newBal);
      if (newBal > peakBalanceRef.current) peakBalanceRef.current = newBal;
      setTradesCopied(prev => prev + 1);

      if (isWin) {
        setLossesInARow(0);
        if (defensiveCyclesLeft > 0) {
          const remaining = defensiveCyclesLeft - 1;
          setDefensiveCyclesLeft(remaining);
          if (remaining === 0) {
            setCommittee(prev => ({
              ...prev,
              sentinel: {
                ...prev.sentinel,
                isDefensiveMode: false,
                defensiveCyclesLeft: 0,
                riskPercent: 0.75
              }
            }));
            setLogs(prev => [
              {
                id: `rec_bybit_${Date.now()}`,
                timestamp: timeStr,
                type: 'HERMES',
                message: `✅ MASTERMIND RECOVERY CONFIRMED: Real Bybit win delivered. Standard 0.75% sizing restored.`
              },
              ...prev.slice(0, 35)
            ]);
          }
        }
        setEvolution(prev => {
          const withExp = addExperience(prev, 40, `Real-Tick ${pos.instrument} Take Profit (+${finalPnl} USD)`);
          return adaptWeightsOnOutcome(withExp, true, 94);
        });
      } else {
        const nextLoss = lossesInARow + 1;
        setLossesInARow(nextLoss);
        if (nextLoss >= 2) {
          triggerMastermindAutoHandover('Real Bybit 2 consecutive Stop Losses');
        }
        setEvolution(prev => {
          const withExp = addExperience(prev, 15, `Real-Tick ${pos.instrument} Stop Loss (${finalPnl} USD)`);
          return adaptWeightsOnOutcome(withExp, false, 65);
        });
      }

      setLogs(prev => [
        {
          id: `real_${Date.now()}`,
          timestamp: timeStr,
          type: 'HERMES',
          action: isWin ? 'bought' : 'sold',
          token: pos.instrument,
          pnlUsd: finalPnl,
          pnlPercent: Number(((finalPnl / pos.marginUsedUsd) * 100).toFixed(1)),
          isLoss: !isWin,
          message: isWin
            ? `🎯 REAL BYBIT TAKE PROFIT: ${pos.instrument} reached $${livePrice.toLocaleString()}. Net P&L: +$${finalPnl}`
            : `🛡️ REAL BYBIT STOP LOSS: ${pos.instrument} reached $${livePrice.toLocaleString()}. Net P&L: -$${Math.abs(finalPnl)}`
        },
        ...prev.slice(0, 35)
      ]);

      setChartHistory(prev => [
        ...prev,
        {
          timeIndex: prev.length,
          timeLabel: timeStr,
          balance: newBal,
          traderHandle: activeTrader.handle,
          traderColor: isWin ? '#34d399' : '#f43f5e'
        }
      ]);

      setCurrentThought(`[${timeStr}] Position closed on physical Bybit touch: ${isWin ? 'TAKE PROFIT (+' : 'STOP LOSS (-'}$${Math.abs(finalPnl)}) · Bankroll now $${newBal}`);
      setActivePosition(null);
      livePositionRef.current = null;
    } else {
      // Update active position with live price & unrealized P&L
      setActivePosition(prev => prev ? {
        ...prev,
        currentPrice: livePrice,
        unrealizedPnlUsd: unrealizedUsd,
        unrealizedPnlPercent: unrealizedPct
      } : null);
    }
  }, [bybitFeed, balance, activeTrader]);

  // Execute trade after approval or automatic dispatch
  const executeTrade = useCallback((order: PendingOrder, isWin: boolean) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    
    // Calculate P&L based on market
    let pnlAmt = 0;
    if (marketCategory === 'PROP_FIRM' || marketCategory === 'BYBIT_TESTNET') {
      pnlAmt = isWin ? Number((order.riskUsd * (order.targetPrice - order.entryPrice) / Math.max(0.1, Math.abs(order.entryPrice - order.stopLoss))).toFixed(2))
                     : -order.riskUsd;
    } else {
      // Crypto scaling
      if (balance < 100) {
        pnlAmt = isWin ? Number((Math.random() * 4 + 1.5).toFixed(2)) : -Number((Math.random() * 0.9 + 0.3).toFixed(2));
      } else if (balance < 500) {
        pnlAmt = isWin ? Number((Math.random() * 25 + 9).toFixed(2)) : -Number((Math.random() * 6 + 1.8).toFixed(2));
      } else if (balance < 2000) {
        pnlAmt = isWin ? Number((Math.random() * 140 + 48).toFixed(2)) : -Number((Math.random() * 32 + 9).toFixed(2));
      } else {
        pnlAmt = isWin ? Number((Math.random() * 650 + 190).toFixed(2)) : -Number((Math.random() * 75 + 18).toFixed(2));
      }
    }

    const newBalance = Number((balance + pnlAmt).toFixed(2));

    if (newBalance > peakBalanceRef.current) {
      peakBalanceRef.current = newBalance;
    }

    // Topstep $50k trailing drawdown check
    if (marketCategory === 'PROP_FIRM' && newBalance <= (PROP_FIRM_STARTING_BALANCE - PROP_FIRM_TRAILING_MAX_LOSS)) {
      setLogs(prev => [
        {
          id: `rule_breach_${Date.now()}`,
          timestamp: timeStr,
          type: 'QUANT',
          message: `🚨 TOPSTEP RULE BREACH: Account touched trailing max loss threshold ($${newBalance}). Trading halted.`
        },
        ...prev
      ]);
      setIsRunning(false);
      return;
    }

    setBalance(newBalance);
    setTradesCopied(c => c + 1);

    // Evolve the system
    const xpGain = isWin ? 35 : 15;
    const evolvedWithXp = addExperience(
      evolution,
      xpGain,
      isWin ? `Profitable trade on ${order.instrument} (+${pnlAmt})` : `Post-trade loss review on ${order.instrument}`
    );
    const fullyEvolved = adaptWeightsOnOutcome(evolvedWithXp, isWin, order.gradeScore);
    setEvolution(fullyEvolved);

    // Update Mnemosyne Journal
    setCommittee(prev => ({
      ...prev,
      mnemosyne: {
        ...prev.mnemosyne,
        totalApproved: prev.mnemosyne.totalApproved + 1,
        totalReviewed: prev.mnemosyne.totalReviewed + 1,
        winRate: Number((((prev.mnemosyne.totalApproved * prev.mnemosyne.winRate) + (isWin ? 100 : 0)) / (prev.mnemosyne.totalApproved + 1)).toFixed(1)),
        recentLearnings: [
          isWin
            ? `Reinforced ${order.instrument} ${order.action} pattern (${order.setupGrade}). Edge sharpened.`
            : `Loss on ${order.instrument}. Hydra tightened minimum score threshold for this pattern.`,
          ...prev.mnemosyne.recentLearnings.slice(0, 3)
        ]
      },
      sentinel: {
        ...prev.sentinel,
        consecutiveLosses: isWin ? 0 : prev.sentinel.consecutiveLosses + 1,
        isHalted: !isWin && (prev.sentinel.consecutiveLosses + 1 >= 2)
      }
    }));

    // Update active trader stats
    setTraders(prev => prev.map(t => {
      if (t.id === activeTraderId) {
        return {
          ...t,
          pnlWithUs: Number((t.pnlWithUs + pnlAmt).toFixed(2)),
          lastSix: [...t.lastSix.slice(1), isWin ? 'W' as const : 'L' as const]
        };
      }
      return t;
    }));

    // Chart update
    setChartHistory(prev => [
      ...prev,
      {
        timeIndex: prev.length,
        timeLabel: timeStr,
        balance: newBalance,
        traderHandle: activeTrader.handle,
        traderColor: isWin ? '#22c55e' : '#ef4444'
      }
    ]);

    // Trade logs
    setLogs(prev => [
      {
        id: `exec_${Date.now()}`,
        timestamp: timeStr,
        type: 'HERMES',
        token: order.instrument,
        action: order.action === 'BUY' ? 'bought' : 'sold',
        pnlUsd: pnlAmt,
        isLoss: !isWin,
        message: `[HERMES EXECUTED] ${order.action} ${order.instrument} · P&L: ${isWin ? '+' : ''}$${pnlAmt} (${order.setupGrade} setup) · XP +${xpGain}`
      },
      ...prev.slice(0, 35)
    ]);

    // Check 2 losses rule
    if (!isWin) {
      const nextLoss = lossesInARow + 1;
      setLossesInARow(nextLoss);
      if (nextLoss >= 2) {
        triggerMastermindAutoHandover('2 consecutive simulated losses');
      }
    } else {
      setLossesInARow(0);
      if (defensiveCyclesLeft > 0) {
        const remaining = defensiveCyclesLeft - 1;
        setDefensiveCyclesLeft(remaining);
        if (remaining === 0) {
          setCommittee(prev => ({
            ...prev,
            sentinel: {
              ...prev.sentinel,
              isDefensiveMode: false,
              defensiveCyclesLeft: 0,
              riskPercent: 0.75,
              riskUsd: Number((balance * 0.0075).toFixed(2))
            }
          }));
          setLogs(prev => [
            {
              id: `recovery_${Date.now()}`,
              timestamp: timeStr,
              type: 'HERMES',
              message: `✅ MASTERMIND RECOVERY CONFIRMED: Target win recorded. Standard 0.75% sizing & full risk velocity restored.`
            },
            ...prev.slice(0, 35)
          ]);
        }
      }
    }

    setPendingOrder(null);
  }, [balance, marketCategory, evolution, activeTrader, activeTraderId, lossesInARow, defensiveCyclesLeft, triggerMastermindAutoHandover]);

  // Approve pending order (HITL)
  const approvePendingOrder = () => {
    if (!pendingOrder) return;
    const isWin = (Math.random() * 100) < (activeTrader.winRate + (evolution.level * 1.5));
    executeTrade(pendingOrder, isWin);
  };

  // Veto pending order (HITL)
  const vetoPendingOrder = (reason: string = 'Operator Veto') => {
    if (!pendingOrder) return;
    const timeStr = new Date().toTimeString().split(' ')[0];
    
    // Reward XP for disciplined risk-avoidance
    const evolved = addExperience(evolution, 15, `Disciplined Operator Veto on ${pendingOrder.instrument} (${reason})`);
    setEvolution(evolved);

    setCommittee(prev => ({
      ...prev,
      mnemosyne: {
        ...prev.mnemosyne,
        totalVetoed: prev.mnemosyne.totalVetoed + 1,
        totalReviewed: prev.mnemosyne.totalReviewed + 1,
        recentLearnings: [
          `Vetoed ${pendingOrder.instrument} order. Capital preserved. +15 XP.`,
          ...prev.mnemosyne.recentLearnings.slice(0, 3)
        ]
      }
    }));

    setLogs(prev => [
      {
        id: `veto_${Date.now()}`,
        timestamp: timeStr,
        type: 'HERMES',
        token: pendingOrder.instrument,
        action: 'vetoed',
        message: `[HERMES VETO] Operator stood aside on ${pendingOrder.instrument} · Capital protected · +15 XP`
      },
      ...prev
    ]);

    setPendingOrder(null);
  };

  // Main simulation tick
  useEffect(() => {
    if (!isRunning) return;

    const intervalTime = Math.max(400, 2400 / speed);

    const interval = setInterval(() => {
      // Periodic experience for live market analysis
      if (Math.random() > 0.6) {
        setEvolution(prev => addExperience(prev, 3, 'Real-time market depth & volatility scan'));
      }

      const timeStr = new Date().toTimeString().split(' ')[0];

      // Select instrument
      let instrumentObj = { symbol: 'BTCUSDT', basePrice: 81900.0 };
      if (marketCategory === 'PROP_FIRM') {
        instrumentObj = FUTURES_LIST[Math.floor(Math.random() * FUTURES_LIST.length)];
      } else if (marketCategory === 'BYBIT_TESTNET') {
        const bybitSyms = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
        const chosen = bybitSyms[Math.floor(Math.random() * bybitSyms.length)];
        const liveTicker = bybitFeed.tickers[chosen];
        const livePrice = liveTicker && liveTicker.lastPrice > 0 ? liveTicker.lastPrice : (chosen === 'BTCUSDT' ? 81900.0 : chosen === 'ETHUSDT' ? 2840.5 : 184.2);
        instrumentObj = { symbol: chosen, basePrice: livePrice };
      } else {
        instrumentObj = { symbol: TOKEN_LIST[Math.floor(Math.random() * TOKEN_LIST.length)], basePrice: 182.40 };
      }

      // Update Quant metrics & news
      const liveDepth = bybitFeed.depth['BTCUSDT'];
      const imbalance = (marketCategory === 'BYBIT_TESTNET' && liveDepth)
        ? liveDepth.imbalance
        : Number(((Math.random() * 1.6) - 0.8).toFixed(2));
      const volatility = Number((15 + Math.random() * 10).toFixed(1));
      const isNewsLocked = Math.random() < 0.10; // 10% of the time, Lumen locks desk

      setQuantState(prev => ({
        ...prev,
        midPrice: instrumentObj.basePrice,
        orderBookImbalance: imbalance,
        realizedVolatility: volatility,
        reflexLatencyMs: marketCategory === 'BYBIT_TESTNET' ? bybitFeed.latencyMs : 81,
        regime: volatility > 22 ? 'HIGH_VOL' : (Math.abs(imbalance) > 0.4 ? 'TRENDING' : 'MEAN_REVERTING')
      }));

      const nextNews = ECONOMIC_EVENTS[Math.floor(Math.random() * ECONOMIC_EVENTS.length)];
      const minutesUntil = isNewsLocked ? Math.floor(Math.random() * 14) + 1 : Math.floor(Math.random() * 180) + 20;

      // Setup grade by Hydra (influenced by evolution level & defensive mode)
      const minThreshold = defensiveCyclesLeft > 0 ? 85 : 70;
      const baseGradeScore = Math.floor(55 + Math.random() * 40 + (evolution.level * 0.8));
      const grade = baseGradeScore >= 90 ? 'A+' : baseGradeScore >= 80 ? 'A' : baseGradeScore >= 70 ? 'B' : 'VETOED';
      const isScoreVetoed = baseGradeScore < minThreshold;
      const isVetoed = isNewsLocked || grade === 'VETOED' || isScoreVetoed;

      const entryPrice = instrumentObj.basePrice;
      const stopLoss = Number((entryPrice * 0.992).toFixed(2));
      const targetPrice = Number((entryPrice * 1.024).toFixed(2));
      const riskRatio = defensiveCyclesLeft > 0 ? 0.0035 : 0.0075;
      const riskUsd = (marketCategory === 'PROP_FIRM' || marketCategory === 'BYBIT_TESTNET')
        ? (defensiveCyclesLeft > 0 ? 175.00 : 375.00)
        : Number((balance * riskRatio).toFixed(2));

      // Update 7-agent committee
      setCommittee(prev => ({
        ...prev,
        atlas: {
          bias: imbalance > 0.2 ? 'BULLISH' : imbalance < -0.2 ? 'BEARISH' : 'NEUTRAL',
          macroSummary: imbalance > 0.2 ? 'Strong bid absorption across multi-timeframe DOM.' : 'Choppy balance zone. Awaiting directional expansion.',
          keyLevel: entryPrice,
          confidence: Math.floor(75 + Math.random() * 20)
        },
        lumen: {
          newsStatus: isNewsLocked ? 'DESK_LOCKED' : (minutesUntil < 30 ? 'CAUTION' : 'CLEAR'),
          nextEvent: `${nextNews.name} in ${minutesUntil}m`,
          minutesUntil,
          isLocked: isNewsLocked
        },
        hydra: {
          setupGrade: isNewsLocked ? 'VETOED' : (isScoreVetoed ? 'VETOED' : grade),
          score: isNewsLocked ? 38 : baseGradeScore,
          reasons: isNewsLocked
            ? ['High-impact red news window within 15 minutes. Trading forbidden.']
            : (defensiveCyclesLeft > 0
                ? ['Mastermind Defensive Gate active (85+ required)', 'False breakout rejection buffer']
                : ['Volume profile reclaim', 'Symmetric delta confirmation', 'Asymmetric R:R > 2.5']),
          isVetoed
        },
        sentinel: {
          ...prev.sentinel,
          riskUsd,
          isHalted: false,
          isDefensiveMode: defensiveCyclesLeft > 0,
          defensiveCyclesLeft
        },
        hephaestus: {
          instrument: instrumentObj.symbol,
          action: imbalance >= 0 ? 'BUY' : 'SELL',
          entryPrice,
          stopLoss,
          targetPrice,
          riskRewardRatio: 3.0
        },
        hermes: {
          verdict: isVetoed ? 'STAND_ASIDE' : 'APPROVE',
          confidence: isVetoed ? 40 : baseGradeScore,
          summary: isNewsLocked
            ? `LUMEN NEWS LOCK: ${nextNews.name} release approaching. Standing aside.`
            : (isVetoed ? `Hydra vetoed setup (Score ${baseGradeScore}/100 below ${minThreshold} threshold).` : `A+ confluence confirmed on ${instrumentObj.symbol}. 100% Auto-Dispatched.`)
        }
      }));

      // If setup is vetoed, skip trade and log
      if (isVetoed) {
        const vetoReason = isNewsLocked
          ? `LUMEN NEWS LOCK: ${nextNews.name} release in ${minutesUntil}m. Desk stood aside.`
          : `HYDRA VETO: Score ${baseGradeScore}/100 below 70 threshold. False breakout avoided.`;
        setCurrentThought(vetoReason);

        if (Math.random() > 0.7) {
          setLogs(prev => [
            {
              id: `stand_${Date.now()}`,
              timestamp: timeStr,
              type: 'HERMES',
              message: vetoReason
            },
            ...prev.slice(0, 35)
          ]);
        }
        return;
      }

      // Valid setup generated!
      const newOrder: PendingOrder = {
        id: `ord_${Date.now()}`,
        instrument: instrumentObj.symbol,
        action: imbalance >= 0 ? 'BUY' : 'SELL',
        entryPrice,
        stopLoss,
        targetPrice,
        riskUsd,
        riskPercent: 0.75,
        setupGrade: grade,
        gradeScore: baseGradeScore,
        rationale: `Hydra Grade ${grade} (${baseGradeScore}/100) · Atlas ${imbalance >= 0 ? 'Bullish' : 'Bearish'} · Risk capped at 0.75% ($${riskUsd})`,
        timeRemainingSec: 15,
        potentialProfitUsd: Number((riskUsd * 3.0).toFixed(2))
      };

      const actionPrefix = marketCategory === 'BYBIT_TESTNET' ? '[Bybit V5 Real-Tick]' : `[${timeStr}]`;

      // BYBIT REAL-TICK POSITION LIFECYCLE
      if (marketCategory === 'BYBIT_TESTNET') {
        if (!livePositionRef.current) {
          const action = imbalance >= 0 ? 'BUY' : 'SELL';
          const currentPrice = entryPrice;
          const sizeContracts = 0.001; // 0.001 BTC (~$82 notional)
          const notionalUsd = Number((currentPrice * sizeContracts).toFixed(2));
          const marginUsedUsd = Number((notionalUsd / 10).toFixed(2)); // 10x leverage = ~$8.20 margin
          const tpDist = Number((currentPrice * 0.006).toFixed(1)); // +0.6% target (+$0.49 net gain)
          const slDist = Number((currentPrice * 0.0025).toFixed(1)); // -0.25% stop (-$0.25 net loss)
          const stopLossPrice = action === 'BUY' ? Number((currentPrice - slDist).toFixed(2)) : Number((currentPrice + slDist).toFixed(2));
          const takeProfitPrice = action === 'BUY' ? Number((currentPrice + tpDist).toFixed(2)) : Number((currentPrice - tpDist).toFixed(2));
          const liquidationPrice = action === 'BUY' ? Number((currentPrice * 0.91).toFixed(2)) : Number((currentPrice * 1.09).toFixed(2));

          const newPos: LivePosition = {
            id: `pos_${Date.now()}`,
            instrument: instrumentObj.symbol,
            action,
            entryPrice: currentPrice,
            currentPrice,
            sizeContracts,
            notionalUsd,
            marginUsedUsd,
            leverage: 10,
            stopLossPrice,
            takeProfitPrice,
            liquidationPrice,
            unrealizedPnlUsd: 0,
            unrealizedPnlPercent: 0,
            openedAt: timeStr,
            elapsedSec: 0,
            takerFeeUsd: 0.04
          };

          setActivePosition(newPos);
          livePositionRef.current = newPos;
          setCurrentThought(`[Real Bybit Live Position Opened] ${action} 0.001 ${instrumentObj.symbol} @ $${currentPrice.toLocaleString()} · Margin: $${marginUsedUsd} (10x) · TP: $${takeProfitPrice} | SL: $${stopLossPrice}`);
        }
        return;
      }

      setCurrentThought(`${actionPrefix} Mastermind executing ${newOrder.action} ${newOrder.instrument} @ $${entryPrice.toLocaleString()} · Grade ${grade} (${baseGradeScore}/100) · Sized ($${riskUsd}) · 1:3 R:R`);

      // 100% Fully Autonomous Execution - Zero Manual Intervention or Modal Delay
      const isWin = (Math.random() * 100) < (activeTrader.winRate + (evolution.level * 1.5));
      executeTrade(newOrder, isWin);

    }, intervalTime);

    return () => clearInterval(interval);
  }, [isRunning, speed, executionMode, marketCategory, balance, activeTrader, evolution, executeTrade, bybitFeed]);

  // Reset function
  const resetSimulation = () => {
    const start = marketCategory === 'PROP_FIRM'
      ? PROP_FIRM_STARTING_BALANCE
      : marketCategory === 'BYBIT_TESTNET'
      ? BYBIT_TESTNET_STARTING_BALANCE
      : CRYPTO_STARTING_BALANCE;
    setBalance(start);
    peakBalanceRef.current = start;
    setTradesCopied(0);
    setLossesInARow(0);
    setFiredCount(0);
    setPendingOrder(null);
    setTraders(INITIAL_TRADERS);
    setActiveTraderId('trader_1');
    setLogs([
      {
        id: `init_${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'SYSTEM',
        message: 'System reset. All desks re-synchronized.'
      }
    ]);
    setChartHistory([
      {
        timeIndex: 0,
        timeLabel: new Date().toTimeString().split(' ')[0],
        balance: start,
        traderHandle: '@kai_blitz',
        traderColor: '#f59e0b'
      }
    ]);
    setIsRunning(true);
  };

  const totalPnl = Number((balance - startingBalance).toFixed(2));
  const pnlPercent = Number(((totalPnl / startingBalance) * 100).toFixed(1));
  const pnlMultiplier = Number((balance / startingBalance).toFixed(1));

  const selectTrader = (id: string) => {
    setTraders(prev => prev.map(t => ({
      ...t,
      status: t.id === id ? 'FOLLOWING' : (t.status === 'FOLLOWING' ? 'BENCH' : t.status)
    })));
    setActiveTraderId(id);
  };

  return {
    mode,
    setMode,
    marketCategory,
    switchMarket,
    executionMode,
    setExecutionMode,
    isRunning,
    setIsRunning,
    speed,
    setSpeed,
    balance,
    startingBalance,
    totalPnl,
    pnlPercent,
    pnlMultiplier,
    tradesCopied,
    lossesInARow,
    firedCount,
    traders,
    activeTrader,
    activeTraderId,
    setActiveTraderId,
    selectTrader,
    committee,
    evolution,
    pendingOrder,
    approvePendingOrder,
    vetoPendingOrder,
    logs,
    chartHistory,
    quantState,
    currentThought,
    bybitFeed,
    bybitCreds,
    setBybitCreds,
    activePosition,
    closeActivePositionManually,
    triggerMastermindAutoHandover,
    defensiveCyclesLeft,
    resetSimulation
  };
}
