import { EvolutionState, AdaptiveWeights, EvolutionEvent } from '../types';

export interface LevelTier {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  perk: string;
}

export const BASE_LEVEL_TIERS: LevelTier[] = [
  { level: 1, title: 'Novice Algorithmic Desk', minXp: 0, maxXp: 150, perk: 'Basic regime detection' },
  { level: 2, title: 'Pattern Recognition Engine', minXp: 150, maxXp: 350, perk: '+5% False Breakout Veto' },
  { level: 3, title: 'Microstructure Analyst', minXp: 350, maxXp: 650, perk: '+8% Order Book Calibration' },
  { level: 4, title: 'Adaptive Regime Specialist', minXp: 650, maxXp: 1100, perk: '+12% Dynamic Kelly Precision' },
  { level: 5, title: 'Asymmetric Risk Architect', minXp: 1100, maxXp: 1750, perk: '+15% Drawdown Shielding' },
  { level: 6, title: 'High-Convexity Quant', minXp: 1750, maxXp: 2600, perk: '+18% Regime Matching Accuracy' },
  { level: 7, title: 'Bayesian Inference Engine', minXp: 2600, maxXp: 3700, perk: '+22% Noise Filtering' },
  { level: 8, title: 'Alpha Protocol Desk', minXp: 3700, maxXp: 5200, perk: '+26% Asymmetric Payoff Targeting' },
  { level: 9, title: 'Autonomous Capital Master', minXp: 5200, maxXp: 7200, perk: '+30% Multi-Timeframe Synthesis' },
];

export function computeLevelTier(xp: number): LevelTier {
  for (const tier of BASE_LEVEL_TIERS) {
    if (xp < tier.maxXp) {
      return tier;
    }
  }

  // Infinite procedural tiers starting at Level 10
  let lvl = 10;
  let minXp = 7200;
  let span = 2600;

  while (true) {
    const maxXp = minXp + span;
    if (xp < maxXp) {
      let title = `Quantitative Grandmaster · Paragon ${lvl - 9}`;
      if (lvl >= 20 && lvl < 30) {
        title = `Sovereign Alpha Overlord · Stage ${lvl - 19}`;
      } else if (lvl >= 30 && lvl < 50) {
        title = `Singularity Market Deity · Epoch ${lvl - 29}`;
      } else if (lvl >= 50 && lvl < 100) {
        title = `Hyper-Dimensional Quant Nexus · Phase ${lvl - 49}`;
      } else if (lvl >= 100) {
        title = `Eternal Autonomous Omnipresence · Tier ${lvl}`;
      }

      const perk = `+${Math.min(99, 30 + (lvl - 9) * 2)}% Confluence Calibration & Asymmetric Edge`;

      return {
        level: lvl,
        title,
        minXp,
        maxXp,
        perk
      };
    }

    minXp = maxXp;
    span = Math.round(span * 1.25);
    lvl++;
  }
}

export const INITIAL_EVOLUTION: EvolutionState = {
  level: 1,
  title: 'Novice Algorithmic Desk',
  xp: 0,
  nextLevelXp: 150,
  currentLevelMinXp: 0,
  winStreak: 0,
  totalTrades: 0,
  totalWins: 0,
  adaptiveWeights: {
    regimePrecision: 5.0,
    falseBreakoutFilter: 6.0,
    sentimentCalibration: 4.0,
    dynamicSizingEdge: 5.0
  },
  recentEvolutions: [
    {
      id: 'init_evo',
      timestamp: new Date().toTimeString().split(' ')[0],
      text: 'Neural Evolution Core Initialized. Learning active.',
      type: 'XP'
    }
  ]
};

const STORAGE_KEY = 'grok_hermes_evolution_v2';

export function loadStoredEvolution(): EvolutionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Re-evaluate level tier in case XP changed or formula updated
      const tier = computeLevelTier(parsed.xp || 0);
      return {
        ...parsed,
        level: tier.level,
        title: tier.title,
        nextLevelXp: tier.maxXp,
        currentLevelMinXp: tier.minXp
      };
    }
  } catch {
    // fallback
  }
  return INITIAL_EVOLUTION;
}

export function saveStoredEvolution(state: EvolutionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function addExperience(
  current: EvolutionState,
  amount: number,
  reason: string,
  type: 'XP' | 'LEVEL_UP' | 'WEIGHT_UPDATE' = 'XP'
): EvolutionState {
  const newXp = current.xp + amount;
  const matchedTier = computeLevelTier(newXp);
  const isLevelUp = matchedTier.level > current.level;
  const timeStr = new Date().toTimeString().split(' ')[0];

  const newEvents: EvolutionEvent[] = [
    {
      id: `evo_${Date.now()}_${Math.random()}`,
      timestamp: timeStr,
      text: isLevelUp ? `⚡ LEVEL UP! Ascended to Level ${matchedTier.level}: ${matchedTier.title}! (${matchedTier.perk})` : `+${amount} XP: ${reason}`,
      type: isLevelUp ? 'LEVEL_UP' : type
    },
    ...current.recentEvolutions.slice(0, 15)
  ];

  // If leveled up, boost adaptive weights
  let updatedWeights = { ...current.adaptiveWeights };
  if (isLevelUp) {
    const levelDelta = matchedTier.level - current.level;
    updatedWeights = {
      regimePrecision: Number((updatedWeights.regimePrecision + 2.5 * levelDelta).toFixed(1)),
      falseBreakoutFilter: Number((updatedWeights.falseBreakoutFilter + 3.0 * levelDelta).toFixed(1)),
      sentimentCalibration: Number((updatedWeights.sentimentCalibration + 2.0 * levelDelta).toFixed(1)),
      dynamicSizingEdge: Number((updatedWeights.dynamicSizingEdge + 2.5 * levelDelta).toFixed(1))
    };
  }

  const updated: EvolutionState = {
    ...current,
    level: matchedTier.level,
    title: matchedTier.title,
    xp: newXp,
    nextLevelXp: matchedTier.maxXp,
    currentLevelMinXp: matchedTier.minXp,
    adaptiveWeights: updatedWeights,
    recentEvolutions: newEvents
  };

  saveStoredEvolution(updated);
  return updated;
}

export function adaptWeightsOnOutcome(
  current: EvolutionState,
  isWin: boolean,
  setupScore: number
): EvolutionState {
  const currentWeights = current.adaptiveWeights;
  const delta = isWin ? 0.4 : -0.2;

  const newWeights: AdaptiveWeights = {
    regimePrecision: Math.max(1, Number((currentWeights.regimePrecision + delta).toFixed(1))),
    falseBreakoutFilter: Math.max(1, Number((currentWeights.falseBreakoutFilter + (isWin ? 0.3 : 0.6)).toFixed(1))), // losses teach more about filtering
    sentimentCalibration: Math.max(1, Number((currentWeights.sentimentCalibration + (isWin ? 0.5 : 0.1)).toFixed(1))),
    dynamicSizingEdge: Math.max(1, Number((currentWeights.dynamicSizingEdge + delta).toFixed(1)))
  };

  const timeStr = new Date().toTimeString().split(' ')[0];
  const eventText = isWin
    ? `Learned from Win (${setupScore}/100): Reinforced regime & sizing weights.`
    : `Learned from Loss (${setupScore}/100): Hydra heightened false-breakout scrutiny (+0.6%).`;

  const newEvents: EvolutionEvent[] = [
    {
      id: `weight_${Date.now()}`,
      timestamp: timeStr,
      text: eventText,
      type: 'WEIGHT_UPDATE'
    },
    ...current.recentEvolutions.slice(0, 15)
  ];

  const updated: EvolutionState = {
    ...current,
    totalTrades: current.totalTrades + 1,
    totalWins: current.totalWins + (isWin ? 1 : 0),
    winStreak: isWin ? current.winStreak + 1 : 0,
    adaptiveWeights: newWeights,
    recentEvolutions: newEvents
  };

  saveStoredEvolution(updated);
  return updated;
}
