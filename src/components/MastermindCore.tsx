import React, { useState, useEffect } from 'react';
import { EvolutionState, HermesCommittee } from '../types';
import { Brain, Zap, Sparkles, Activity, Cpu, Eye, Radio, Lock, ChevronRight, Layers } from 'lucide-react';

interface MastermindCoreProps {
  evolution: EvolutionState;
  committee: HermesCommittee;
  currentThought: string;
  activeLobeIndex?: number;
  onLobeIndexChange?: (index: number) => void;
}

const PIPELINE_STAGES = [
  { id: 0, name: 'Atlas', role: 'L2 Order Book Scan', action: 'STREAMING BYBIT TAPE', color: 'from-blue-500 to-cyan-500', glow: 'rgba(56, 189, 248, 0.4)' },
  { id: 1, name: 'Lumen', role: 'Macro Catalyst Audit', action: 'CHECKING NEWS LOCK', color: 'from-amber-400 to-orange-500', glow: 'rgba(251, 191, 36, 0.4)' },
  { id: 2, name: 'Hydra', role: 'Confluence Setup Scoring', action: 'CALCULATING 0-100 EDGE', color: 'from-emerald-400 to-teal-500', glow: 'rgba(52, 211, 153, 0.4)' },
  { id: 3, name: 'Sentinel', role: 'Fractional Kelly Sizing', action: 'DEFENSIVE ARMOR ACTIVE', color: 'from-purple-500 to-indigo-600', glow: 'rgba(168, 85, 247, 0.4)' },
  { id: 4, name: 'Hephaestus', role: 'Contract Architecture', action: 'FRAMING TP/SL LEVELS', color: 'from-orange-500 to-rose-600', glow: 'rgba(249, 115, 22, 0.4)' },
  { id: 5, name: 'Hermes', role: 'Autonomous Execution', action: '100% AUTO DISPATCH', color: 'from-amber-400 to-purple-600', glow: 'rgba(217, 70, 239, 0.4)' },
  { id: 6, name: 'Mnemosyne', role: 'Neural Synapse Vault', action: 'UPDATING NEURAL WEIGHTS', color: 'from-teal-400 to-emerald-600', glow: 'rgba(45, 212, 191, 0.4)' }
];

export const MastermindCore: React.FC<MastermindCoreProps> = ({
  evolution,
  committee,
  currentThought,
  activeLobeIndex: externalLobeIndex,
  onLobeIndexChange
}) => {
  const [internalLobeIndex, setInternalLobeIndex] = useState<number>(0);
  const activeIndex = externalLobeIndex !== undefined ? externalLobeIndex : internalLobeIndex;

  // Continuously advance pipeline sequence every 900ms to visually demonstrate continuous agent-to-agent data flow
  useEffect(() => {
    const timer = setInterval(() => {
      setInternalLobeIndex(prev => {
        const next = (prev + 1) % 7;
        if (onLobeIndexChange) onLobeIndexChange(next);
        return next;
      });
    }, 900);
    return () => clearInterval(timer);
  }, [onLobeIndexChange]);

  // Infinite level percentage calculation
  const minXp = evolution.currentLevelMinXp ?? 0;
  const xpInLevel = Math.max(0, evolution.xp - minXp);
  const levelSpan = Math.max(1, evolution.nextLevelXp - minXp);
  const xpPercent = Math.min(100, Math.max(0, Math.round((xpInLevel / levelSpan) * 100)));

  return (
    <div className="relative p-5 rounded-2xl bg-gradient-to-b from-[#0c1024] via-[#090d1f] to-[#070914] border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.12)] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      {/* Top Bar: Mastermind Identity & Level Ascension */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          {/* Pulsing Neural Core Orb */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#080b18] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <Brain className="w-8 h-8 text-cyan-300 animate-pulse" />
                <span className="absolute inset-0 bg-cyan-400/10 rounded-full animate-ping pointer-events-none" />
                {/* Rotating Cyber Scope Ring */}
                <span className="absolute inset-1 rounded-xl border border-cyan-500/30 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 text-slate-950 shadow-md">
              LVL {evolution.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl text-white tracking-wide flex items-center gap-2">
                AUTONOMOUS MASTERMIND
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-spin text-cyan-400" />
                100% AUTOPILOT ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
              <span className="text-cyan-200 font-semibold">{evolution.title}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">{evolution.winStreak} Win Streak</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">{evolution.totalTrades} Realized Decisions</span>
            </p>
          </div>
        </div>

        {/* Neural XP Meter */}
        <div className="min-w-[280px] p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Neural Evolution
            </span>
            <span className="text-white font-bold">
              {evolution.xp} <span className="text-slate-500">/ {evolution.nextLevelXp} XP</span>
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1">
            <span>Progress: {xpPercent}%</span>
            <span className="text-cyan-400 font-semibold">Tier Level {evolution.level}</span>
          </div>
        </div>
      </div>

      {/* Middle: 7 Specialized Cognitive Lobes Connected via Real-Time SVG Linear Pipeline */}
      <div className="relative my-4">
        {/* Animated Horizontal Pipeline Beam across the 7 agents */}
        <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-1 pointer-events-none z-0">
          <svg className="w-full h-8 -top-3.5 relative overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Background base conduit */}
            <line x1="0" y1="14" x2="100%" y2="14" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            {/* Animated Pulsing Data Stream */}
            <line
              x1="0"
              y1="14"
              x2="100%"
              y2="14"
              stroke="url(#pipeGrad)"
              strokeWidth="2.5"
              strokeDasharray="8 12"
              className="animate-[dash_1.5s_linear_infinite]"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
          {/* 1. ATLAS (Macro & Order Book Depth) */}
          <div className={`p-3 rounded-2xl border flex flex-col items-center text-center relative group transition-all duration-300 shadow-lg ${
            activeIndex === 0
              ? 'bg-gradient-to-b from-[#14234b] to-[#0c1631] border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.35)] scale-[1.03] ring-2 ring-cyan-400/50'
              : 'bg-gradient-to-b from-[#0e162f] to-[#080d1e] border-blue-500/30 hover:border-blue-400'
          }`}>
            {/* Agent Avatar with Active Aura */}
            <div className="relative my-1">
              <div className={`w-14 h-14 rounded-2xl p-0.5 shadow-md flex items-center justify-center relative overflow-hidden transition-all ${
                activeIndex === 0 ? 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-cyan-400/50' : 'bg-gradient-to-br from-blue-500 to-indigo-700 shadow-blue-500/30'
              }`}>
                <div className="w-full h-full bg-[#060a17] rounded-[14px] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/25 to-transparent animate-[spin_2.5s_linear_infinite]" />
                  <Activity className={`w-6 h-6 relative z-10 transition-all ${activeIndex === 0 ? 'text-cyan-300 scale-110' : 'text-blue-400'}`} />
                  <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono font-bold text-white mt-1">Atlas</div>
            <div className="text-[9px] font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              L2 Depth
            </div>
            <div className={`text-xs font-mono font-extrabold mt-1.5 ${
              committee.atlas.bias === 'BULLISH' ? 'text-emerald-400' :
              committee.atlas.bias === 'BEARISH' ? 'text-rose-400' : 'text-slate-300'
            }`}>
              {committee.atlas.bias}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{committee.atlas.confidence}% Conf</div>

            {/* Active Lobe Action Badge */}
            <div className={`mt-2 pt-1 border-t border-slate-800/80 w-full text-[9px] font-mono font-semibold transition-all ${
              activeIndex === 0 ? 'text-cyan-300 animate-pulse' : 'text-blue-400/70'
            }`}>
              {activeIndex === 0 ? '⚡ LASER SCANNING' : 'SCANNING TAPE'}
            </div>

            {/* Laser Beam Indicator pointing toward chart */}
            {activeIndex === 0 && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <span className="w-1.5 h-3 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
              </div>
            )}
          </div>

          {/* 2. LUMEN (Macro News & Volatility Guard) */}
          <div className={`p-3 rounded-2xl border flex flex-col items-center text-center relative group transition-all duration-300 shadow-lg ${
            activeIndex === 1
              ? 'bg-gradient-to-b from-[#2a1d08] to-[#140e04] border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-[1.03] ring-2 ring-amber-400/50'
              : (committee.lumen.isLocked
                  ? 'bg-gradient-to-b from-rose-950/40 to-slate-950 border-rose-500/60 shadow-rose-500/20 animate-pulse'
                  : 'bg-gradient-to-b from-[#1b1509] to-[#0a0804] border-amber-500/30 hover:border-amber-400')
          }`}>
            <div className="relative my-1">
              <div className={`w-14 h-14 rounded-2xl p-0.5 shadow-md flex items-center justify-center relative overflow-hidden transition-all ${
                committee.lumen.isLocked
                  ? 'bg-gradient-to-br from-rose-500 to-amber-600 shadow-rose-500/40'
                  : 'bg-gradient-to-br from-amber-400 to-orange-600 shadow-amber-500/30'
              }`}>
                <div className="w-full h-full bg-[#0a0805] rounded-[14px] flex items-center justify-center relative">
                  <div className={`absolute inset-0 rounded-full animate-ping pointer-events-none ${
                    committee.lumen.isLocked ? 'bg-rose-500/20' : 'bg-amber-400/10'
                  }`} />
                  <Eye className={`w-6 h-6 relative z-10 transition-all ${
                    activeIndex === 1 ? 'text-amber-200 scale-110' : (committee.lumen.isLocked ? 'text-rose-400 animate-bounce' : 'text-amber-400')
                  }`} />
                  <span className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                    committee.lumen.isLocked ? 'bg-rose-400' : 'bg-emerald-400'
                  } animate-ping`} />
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono font-bold text-white mt-1">Lumen</div>
            <div className="text-[9px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <span className={`w-1 h-1 rounded-full ${committee.lumen.isLocked ? 'bg-rose-400' : 'bg-emerald-400'} animate-ping`} />
              Macro Gate
            </div>
            <div className={`text-xs font-mono font-extrabold mt-1.5 ${
              committee.lumen.isLocked ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {committee.lumen.newsStatus}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-full">
              {committee.lumen.nextEvent.slice(0, 16)}
            </div>
            <div className={`mt-2 pt-1 border-t border-slate-800/80 w-full text-[9px] font-mono font-semibold ${
              activeIndex === 1 ? 'text-amber-300 animate-pulse' : 'text-amber-400/70'
            }`}>
              {activeIndex === 1 ? '🔍 VERIFYING MACRO' : 'RADAR CLEAR'}
            </div>
          </div>

          {/* 3. HYDRA (Confluence & Pattern Vetting) */}
          <div className={`p-3 rounded-2xl border flex flex-col items-center text-center relative group transition-all duration-300 shadow-lg ${
            activeIndex === 2
              ? 'bg-gradient-to-b from-[#0c3121] to-[#061911] border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.35)] scale-[1.03] ring-2 ring-emerald-400/50'
              : 'bg-gradient-to-b from-[#0a2318] to-[#05130d] border-emerald-500/30 hover:border-emerald-400'
          }`}>
            <div className="relative my-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-md shadow-emerald-500/30 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full bg-[#05110b] rounded-[14px] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping pointer-events-none" />
                  <Layers className={`w-6 h-6 relative z-10 transition-all ${activeIndex === 2 ? 'text-emerald-200 scale-110' : 'text-emerald-400'}`} />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono font-bold text-white mt-1">Hydra</div>
            <div className="text-[9px] font-mono text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
              Confluence
            </div>
            <div className="text-xs font-mono font-extrabold text-emerald-300 mt-1.5">
              Grade {committee.hydra.setupGrade} ({committee.hydra.score}/100)
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {committee.hydra.isVetoed ? 'Threshold Veto' : 'Confluence Edge'}
            </div>
            <div className={`mt-2 pt-1 border-t border-slate-800/80 w-full text-[9px] font-mono font-semibold ${
              activeIndex === 2 ? 'text-emerald-300 animate-pulse' : 'text-emerald-400/70'
            }`}>
              {activeIndex === 2 ? '📊 SCORING SETUP' : 'GATE: 70+ (85+ DEF)'}
            </div>
          </div>

          {/* 4. SENTINEL (Risk & Kelly Armor) */}
          <div className={`p-3 rounded-2xl border flex flex-col items-center text-center relative group transition-all duration-300 shadow-lg ${
            activeIndex === 3
              ? 'bg-gradient-to-b from-[#2e1245] to-[#170924] border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.35)] scale-[1.03] ring-2 ring-purple-400/50'
              : 'bg-gradient-to-b from-[#1b0a2a] to-[#0e0516] border-purple-500/30 hover:border-purple-400'
          }`}>
            <div className="relative my-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-pink-500 p-0.5 shadow-md shadow-purple-500/30 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full bg-[#0a0312] rounded-[14px] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-ping pointer-events-none" />
                  <Lock className={`w-6 h-6 relative z-10 transition-all ${activeIndex === 3 ? 'text-purple-200 scale-110' : 'text-purple-300'}`} />
                  <span className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono font-bold text-white mt-1">Sentinel</div>
            <div className="text-[9px] font-mono text-purple-300 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-purple-400 animate-ping" />
              Risk Armor
            </div>
            <div className="text-xs font-mono font-extrabold text-purple-300 mt-1.5">
              {committee.sentinel.isDefensiveMode ? '0.35% (Defensive)' : `${committee.sentinel.riskPercent}% Sized`}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              Auto-Recovery Armed
            </div>
            <div className={`mt-2 pt-1 border-t border-slate-800/80 w-full text-[9px] font-mono font-semibold ${
              activeIndex === 3 ? 'text-purple-300 animate-pulse' : 'text-purple-400/70'
            }`}>
              {activeIndex === 3 ? '🛡️ SIZING KELLY' : '2-STRIKE AUTO-ROT'}
            </div>
          </div>

          {/* 5. HEPHAESTUS (Execution & Order Forge) */}
          <div className={`p-3 rounded-2xl border flex flex-col items-center text-center relative group transition-all duration-300 shadow-lg ${
            activeIndex === 4
              ? 'bg-gradient-to-b from-[#3a1d09] to-[#1c0d03] border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.35)] scale-[1.03] ring-2 ring-orange-400/50'
              : 'bg-gradient-to-b from-[#241308] to-[#120803] border-orange-500/30 hover:border-orange-400'
          }`}>
            <div className="relative my-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 p-0.5 shadow-md shadow-orange-500/30 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full bg-[#0d0602] rounded-[14px] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-transparent animate-pulse" />
                  <Zap className={`w-6 h-6 relative z-10 transition-all ${activeIndex === 4 ? 'text-amber-200 scale-110 animate-bounce' : 'text-amber-300'}`} />
                  <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono font-bold text-white mt-1">Hephaestus</div>
            <div className="text-[9px] font-mono text-orange-300 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-orange-400 animate-ping" />
              Order Forge
            </div>
            <div className="text-xs font-mono font-extrabold text-orange-300 mt-1.5 truncate max-w-full">
              {committee.hephaestus.action} {committee.hephaestus.instrument}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">1:3.0 R:R Locked</div>
            <div className={`mt-2 pt-1 border-t border-slate-800/80 w-full text-[9px] font-mono font-semibold ${
              activeIndex === 4 ? 'text-orange-300 animate-pulse' : 'text-orange-400/70'
            }`}>
              {activeIndex === 4 ? '⚙️ PACKAGING ORDER' : 'TP/SL TARGETS'}
            </div>
          </div>

          {/* 6. HERMES (Autonomous Executive Mastermind) */}
          <div className={`p-3 rounded-2xl border flex flex-col items-center text-center relative group transition-all duration-300 shadow-xl ${
            activeIndex === 5
              ? 'bg-gradient-to-b from-[#351254] to-[#1c082e] border-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.35)] scale-[1.03] ring-2 ring-fuchsia-400/50'
              : 'bg-gradient-to-b from-[#210d35] via-[#150824] to-[#0b0414] border-amber-500/40 hover:border-amber-400'
          }`}>
            <div className="relative my-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-purple-500 to-indigo-600 p-0.5 shadow-md shadow-purple-500/40 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full bg-[#0a0312] rounded-[14px] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping pointer-events-none" />
                  <Cpu className={`w-6 h-6 relative z-10 transition-all ${activeIndex === 5 ? 'text-amber-200 scale-110' : 'text-amber-300'}`} />
                  <span className="absolute -top-1 -right-1 px-1 rounded text-[8px] font-mono font-black bg-amber-400 text-black">
                    EXEC
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono font-bold text-white mt-1">Hermes Core</div>
            <div className="text-[9px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Auto-Pilot
            </div>
            <div className="text-xs font-mono font-extrabold text-white mt-1.5">
              100% AUTOPILOT
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5 font-semibold">
              Zero Manual Delay
            </div>
            <div className={`mt-2 pt-1 border-t border-purple-900/60 w-full text-[9px] font-mono font-semibold ${
              activeIndex === 5 ? 'text-amber-300 animate-pulse' : 'text-amber-400/70'
            }`}>
              {activeIndex === 5 ? '🚀 AUTO-DISPATCHING' : 'BYBIT V5 LIVE'}
            </div>
          </div>

          {/* 7. MNEMOSYNE (Neural Synapse & Memory Vault) */}
          <div className={`p-3 rounded-2xl border flex flex-col items-center text-center relative group transition-all duration-300 shadow-lg ${
            activeIndex === 6
              ? 'bg-gradient-to-b from-[#0c312a] to-[#051714] border-teal-400 shadow-[0_0_25px_rgba(45,212,191,0.35)] scale-[1.03] ring-2 ring-teal-400/50'
              : 'bg-gradient-to-b from-[#081f1b] to-[#04100e] border-teal-500/30 hover:border-teal-400'
          }`}>
            <div className="relative my-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-700 p-0.5 shadow-md shadow-teal-500/30 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full bg-[#030d0b] rounded-[14px] flex items-center justify-center relative">
                  <div className="absolute inset-1 rounded-xl border border-teal-400/30 border-dashed animate-[spin_12s_linear_infinite]" />
                  <Sparkles className={`w-6 h-6 relative z-10 transition-all ${activeIndex === 6 ? 'text-teal-200 scale-110' : 'text-teal-300'}`} />
                  <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono font-bold text-white mt-1">Mnemosyne</div>
            <div className="text-[9px] font-mono text-teal-300 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-teal-400 animate-ping" />
              Memory Vault
            </div>
            <div className="text-xs font-mono font-extrabold text-teal-300 mt-1.5">
              {committee.mnemosyne.winRate}% WR
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {committee.mnemosyne.totalApproved} Learned
            </div>
            <div className={`mt-2 pt-1 border-t border-slate-800/80 w-full text-[9px] font-mono font-semibold ${
              activeIndex === 6 ? 'text-teal-300 animate-pulse' : 'text-teal-400/70'
            }`}>
              {activeIndex === 6 ? '🧠 SYNAPSE UPDATE' : 'NEURAL WEIGHTS'}
            </div>
          </div>
        </div>
      </div>

      {/* Live Pipeline Flow Status Ribbon */}
      <div className="my-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400 animate-spin" />
            LIVE PIPELINE FLOW:
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
          {PIPELINE_STAGES.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all whitespace-nowrap ${
                activeIndex === idx
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeIndex === idx ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`} />
                <span>{s.name}</span>
                {activeIndex === idx && <span className="text-[9px] text-cyan-300 hidden sm:inline">[{s.action}]</span>}
              </div>
              {idx < PIPELINE_STAGES.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom: Live Stream of Consciousness (Internal Dialogue) */}
      <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          MASTERMIND THOUGHT
        </div>
        <p className="text-xs font-mono text-slate-200 truncate">
          {currentThought || committee.hermes.summary}
        </p>
      </div>
    </div>
  );
};
