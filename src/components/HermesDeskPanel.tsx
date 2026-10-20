import React from 'react';
import { HermesCommittee, EvolutionState, MarketCategory, ExecutionMode } from '../types';
import {
  Globe,
  Bell,
  CheckCircle,
  Shield,
  Hammer,
  BookOpen,
  Crown,
  Sparkles,
  Zap,
  Brain
} from 'lucide-react';

interface HermesDeskPanelProps {
  committee: HermesCommittee;
  evolution: EvolutionState;
  marketCategory: MarketCategory;
  executionMode: ExecutionMode;
}

export const HermesDeskPanel: React.FC<HermesDeskPanelProps> = ({
  committee,
  evolution,
  marketCategory,
  executionMode
}) => {
  const { atlas, lumen, hydra, sentinel, hephaestus, mnemosyne, hermes } = committee;

  const xpProgress = Math.min(100, Math.round((evolution.xp / evolution.nextLevelXp) * 100));

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* 🧠 SELF-EVOLVING NEURAL CORE HEADER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d1226] via-[#101736] to-[#0c1024] border border-indigo-500/30 shadow-[0_4px_24px_rgba(99,102,241,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain className="w-6 h-6 text-white animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black bg-cyan-400 text-slate-950 shadow">
                LVL {evolution.level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Self-Evolving Neural Engine
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {evolution.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {marketCategory === 'PROP_FIRM' ? 'TOPSTEP $50K' : 'CRYPTO SPOT'}
                </span>
              </div>
              <div className="text-sm font-sans font-medium text-slate-300 mt-0.5">
                Adapts weights & sharpens edge on every trade analysis
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="min-w-[260px] p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Experience
              </span>
              <span className="text-white font-bold">
                {evolution.xp} <span className="text-slate-500">/ {evolution.nextLevelXp} XP</span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Evolved Adaptive Weights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-800/80">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-[10px] font-mono uppercase text-slate-400">Regime Precision</div>
            <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
              +{evolution.adaptiveWeights.regimePrecision}% bonus
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-[10px] font-mono uppercase text-slate-400">False-Breakout Veto</div>
            <div className="text-xs font-mono font-bold text-emerald-300 mt-0.5">
              +{evolution.adaptiveWeights.falseBreakoutFilter}% accuracy
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-[10px] font-mono uppercase text-slate-400">Sentiment Calibration</div>
            <div className="text-xs font-mono font-bold text-indigo-300 mt-0.5">
              +{evolution.adaptiveWeights.sentimentCalibration}% edge
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-[10px] font-mono uppercase text-slate-400">Dynamic Kelly Sizing</div>
            <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">
              +{evolution.adaptiveWeights.dynamicSizingEdge}% efficiency
            </div>
          </div>
        </div>
      </div>

      {/* 🏛️ 7-AGENT COMMITTEE COCKPIT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. ATLAS (Macro Analysis) */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="font-mono font-bold text-xs text-white">1. ATLAS (Macro)</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                atlas.bias === 'BULLISH' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                atlas.bias === 'BEARISH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                'bg-slate-700/40 text-slate-300'
              }`}>
                {atlas.bias} ({atlas.confidence}%)
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
              {atlas.macroSummary}
            </p>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
            Key Anchor Level: <span className="text-white font-bold">${atlas.keyLevel.toLocaleString()}</span>
          </div>
        </div>

        {/* 2. LUMEN (News Guard) */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
          lumen.isLocked
            ? 'bg-rose-950/20 border-rose-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
            : 'bg-slate-900/50 border-slate-800/80'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="font-mono font-bold text-xs text-white">2. LUMEN (News)</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                lumen.isLocked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {lumen.isLocked ? 'DESK LOCKED' : 'NEWS CLEAR'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {lumen.isLocked
                ? 'High-impact red news window within 15 minutes. Trading halted to prevent slippage.'
                : 'Next high-impact economic catalyst:'}
            </p>
            <div className="text-xs font-mono font-bold text-amber-300 mt-1">
              {lumen.nextEvent}
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
            Rule: ±15m red news blackout enforced
          </div>
        </div>

        {/* 3. HYDRA (Setup Grader) */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="font-mono font-bold text-xs text-white">3. HYDRA (Grader)</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                hydra.isVetoed
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}>
                {hydra.setupGrade} ({hydra.score}/100)
              </span>
            </div>
            <div className="space-y-1 mt-1">
              {hydra.reasons.map((r, i) => (
                <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="truncate">{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
            Threshold: Vetoes anything below Grade B (&lt;70)
          </div>
        </div>

        {/* 4. SENTINEL (Risk Boss) */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="font-mono font-bold text-xs text-white">4. SENTINEL (Risk)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                0.75% Max Risk
              </span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Allocation:</span>
                <span className="font-bold text-white">${sentinel.riskUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consecutive Losses:</span>
                <span className={`font-bold ${sentinel.consecutiveLosses > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {sentinel.consecutiveLosses} / {sentinel.maxLosses}
                </span>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
            Rule: 2 consecutive losses = mandatory lockout
          </div>
        </div>

        {/* 5. HEPHAESTUS (Order Architect) */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                  <Hammer className="w-4 h-4" />
                </div>
                <span className="font-mono font-bold text-xs text-white">5. HEPHAESTUS (Orders)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                R:R 1:3.0
              </span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Slip:</span>
                <span className="font-bold text-white">{hephaestus.action} {hephaestus.instrument}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Entry:</span>
                <span>${hephaestus.entryPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span className="text-slate-400">Stop:</span>
                <span>${hephaestus.stopLoss.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span className="text-slate-400">Target:</span>
                <span>${hephaestus.targetPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
            Bracket orders built with hard stops
          </div>
        </div>

        {/* 6. MNEMOSYNE (Journal & Memory) */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-mono font-bold text-xs text-white">6. MNEMOSYNE (Journal)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                {mnemosyne.winRate}% WR
              </span>
            </div>
            <div className="text-xs text-slate-300 font-sans leading-relaxed">
              <span className="font-mono text-teal-400 text-[11px] block mb-1">Latest Neural Insight:</span>
              <p className="line-clamp-2 text-[11px] italic text-slate-400">
                "{mnemosyne.recentLearnings[0] || 'Learning trade sequences across regimes...'}"
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
            Approved: {mnemosyne.totalApproved} | Vetoed: {mnemosyne.totalVetoed}
          </div>
        </div>
      </div>

      {/* 👑 7. HERMES (CLAUDE CEO) SYNTHESIS BANNER */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950/60 border border-indigo-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-white">
                7. HERMES (Claude Executive Verdict)
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                hermes.verdict === 'APPROVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                hermes.verdict === 'PENDING_USER_APPROVAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                'bg-slate-700/40 text-slate-300'
              }`}>
                {hermes.verdict.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-sans">
              {hermes.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Execution Mode:</span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-white flex items-center gap-1.5">
            {executionMode === 'SEMI_AUTO' ? '✋ Semi-Auto (HITL)' : '⚡ Auto-Pilot'}
          </span>
        </div>
      </div>
    </div>
  );
};
