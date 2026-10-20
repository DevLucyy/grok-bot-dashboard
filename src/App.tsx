import { useState } from 'react';
import { useTradingSimulation } from './engine/useTradingSimulation';
import { Header } from './components/Header';
import { MastermindCore } from './components/MastermindCore';
import { ActivePositionHUD } from './components/ActivePositionHUD';
import { BalanceCards } from './components/BalanceCards';
import { SteppedChart } from './components/SteppedChart';
import { LiveCryptoChart } from './components/LiveCryptoChart';
import { CopyFeed } from './components/CopyFeed';
import { TraderBench } from './components/TraderBench';
import { BybitTestnetModal } from './components/BybitTestnetModal';
import { Shield, Radio, TrendingUp } from 'lucide-react';

export function App() {
  const [isBybitModalOpen, setIsBybitModalOpen] = useState<boolean>(false);
  const [activeChartTab, setActiveChartTab] = useState<'LIVE_CRYPTO' | 'EQUITY_CURVE'>('LIVE_CRYPTO');
  const [activeLobeIndex, setActiveLobeIndex] = useState<number>(0);

  const {
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
    committee,
    evolution,
    currentThought,
    selectTrader,
    resetSimulation,
    logs,
    chartHistory,
    marketCategory,
    switchMarket,
    bybitFeed,
    bybitCreds,
    setBybitCreds,
    activePosition,
    closeActivePositionManually,
    triggerMastermindAutoHandover
  } = useTradingSimulation();

  return (
    <div className="min-h-screen p-3 md:p-6 max-w-7xl mx-auto flex flex-col gap-5">
      {/* 1. Header with clean branding, autopilot badge, Bybit live status pill, speed multipliers, and pause/reset */}
      <Header
        tradesCopied={tradesCopied}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        speed={speed}
        setSpeed={setSpeed}
        onReset={resetSimulation}
        bybitFeed={bybitFeed}
        bybitCreds={bybitCreds}
        onOpenBybitModal={() => setIsBybitModalOpen(true)}
      />

      {/* 2. Unified Mastermind Beast Core with Animated 7-Agent Pipeline & Laser Emission */}
      <MastermindCore
        evolution={evolution}
        committee={committee}
        currentThought={currentThought}
        activeLobeIndex={activeLobeIndex}
        onLobeIndexChange={setActiveLobeIndex}
      />

      {/* 2.5 Real-Tick Live Position HUD (Active Bybit Position or Radar Scanning) */}
      <ActivePositionHUD
        position={activePosition}
        onManualClose={closeActivePositionManually}
        bybitConnected={bybitFeed.isConnected}
        orderBookImbalance={bybitFeed.depth['BTCUSDT']?.imbalance ?? 0.22}
      />

      {/* 3. Top Metric Cards (Balance, P&L, Operator with Win/Loss Glow Pills, 2-Strike Handbrake) */}
      <BalanceCards
        balance={balance}
        startingBalance={startingBalance}
        totalPnl={totalPnl}
        pnlPercent={pnlPercent}
        pnlMultiplier={pnlMultiplier}
        activeTrader={activeTrader}
        lossesInARow={lossesInARow}
        firedCount={firedCount}
        onManualFire={() => triggerMastermindAutoHandover('Manual Operator Handover')}
        marketCategory={marketCategory}
      />

      {/* 4. Middle Section: Live Crypto Candlestick Chart / Stepped Chart & Copy Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Dual Interactive Chart Container (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Chart View Switcher Tabs */}
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveChartTab('LIVE_CRYPTO')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  activeChartTab === 'LIVE_CRYPTO'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Radio className="w-3 h-3 text-cyan-300 animate-pulse" />
                Live Crypto Candlestick Chart
              </button>
              <button
                onClick={() => setActiveChartTab('EQUITY_CURVE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  activeChartTab === 'EQUITY_CURVE'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                Compounding Growth Curve ($15 → $45)
              </button>
            </div>
            <div className="text-[10px] font-mono text-slate-500 pr-2 hidden sm:block">
              {activeChartTab === 'LIVE_CRYPTO' ? 'Real-Tick Bybit V5 Tape' : 'Stepped Equity Growth'}
            </div>
          </div>

          {/* Active Chart Display */}
          {activeChartTab === 'LIVE_CRYPTO' ? (
            <LiveCryptoChart
              feedState={bybitFeed}
              activePosition={activePosition}
              activeLobeIndex={activeLobeIndex}
            />
          ) : (
            <SteppedChart
              history={chartHistory}
              currentBalance={balance}
            />
          )}
        </div>

        {/* Right: Streaming Trade & Evolution Feed (5 Cols) */}
        <div className="lg:col-span-5">
          <CopyFeed logs={logs} />
        </div>
      </div>

      {/* 5. Bottom: Trader Bench Roster */}
      <TraderBench
        traders={traders}
        activeTraderId={activeTraderId}
        onSelectTrader={selectTrader}
      />

      {/* 6. Bybit V5 Testnet Configuration & Live Telemetry Modal */}
      <BybitTestnetModal
        isOpen={isBybitModalOpen}
        onClose={() => setIsBybitModalOpen(false)}
        feedState={bybitFeed}
        credentials={bybitCreds}
        onCredentialsChange={setBybitCreds}
        marketCategory={marketCategory}
        onSelectBybitMarket={() => switchMarket('BYBIT_TESTNET')}
      />

      {/* 7. Footer Disclaimer & AppSec Safety Notice */}
      <footer className="mt-2 pt-3 border-t border-[#1a233d]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bybit V5 Real-Tick Engine · $15.00 Micro Capital · 10x Micro-Leverage · 100% Fully Autonomous Mastermind</span>
        </div>
        <div>
          <span>Grok Bot v3.3 (Autonomous Real-Tick Mastermind)</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
