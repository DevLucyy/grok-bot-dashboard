import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGrokJevEngine } from './engine/grokJevEngine';
import { TerminalNav } from './components/TerminalNav';
import { PortfolioMatrixCard } from './components/PortfolioMatrixCard';
import { ActiveTicketHUD } from './components/ActiveTicketHUD';
import { TraderRosterBento } from './components/TraderRosterBento';
import { QuantRadarFunnel } from './components/QuantRadarFunnel';
import { OrderLedgerPanel } from './components/OrderLedgerPanel';
import { MegaWinModal } from './components/MegaWinModal';
import { BybitTestnetModal } from './components/BybitTestnetModal';
import { AvatarInspectorModal } from './components/AvatarInspectorModal';
import { loadBybitCredentials, BybitCredentials } from './engine/bybitClient';

export function App() {
  const [bybitCreds, setBybitCreds] = useState<BybitCredentials>(loadBybitCredentials());
  const [autoExecuteTestnet, setAutoExecuteTestnet] = useState<boolean>(() => {
    return localStorage.getItem('bybit_auto_execute_testnet') !== 'false';
  });

  const engine = useGrokJevEngine(bybitCreds, autoExecuteTestnet);
  const [isBybitModalOpen, setIsBybitModalOpen] = useState(false);
  const [inspectedBot, setInspectedBot] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scrolling synchronized with GSAP Ticker
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  const inspectedTraderStats = engine.traders.find((t) => t.name === inspectedBot);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-[#05060a] text-slate-100 font-sans select-none antialiased relative overflow-x-hidden"
    >
      {/* Ambient Lighting & High-End Obsidian Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.06),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[160px] pointer-events-none" />

      {/* Main Container - Auto-Centered, Zero Left Blank Space */}
      <div className="w-full max-w-[1640px] mx-auto px-3 sm:px-6 py-4 flex flex-col gap-5 relative z-10">
        {/* TOP COMMAND BAR & LIVE BYBIT TICKER MARQUEE */}
        <TerminalNav
          balance={engine.balance}
          digitalTime={engine.digitalTime}
          cloudExecutions={engine.cloudExecutions}
          isCloudSynced={engine.isCloudSynced}
          lastCloudSync={engine.lastCloudSync}
          bybitFeed={engine.bybitFeed}
          onResetToFifteen={() => engine.resetToWallet(15.00)}
          onOpenBybitModal={() => setIsBybitModalOpen(true)}
        />

        {/* ROW 1: CAPITAL & PERFORMANCE MATRIX (8 cols) + ACTIVE TICKET HUD (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 flex flex-col">
            <PortfolioMatrixCard
              balance={engine.balance}
              tonightStart={engine.tonightStart}
              tonightGainPercent={engine.tonightGainPercent}
              wins={engine.wins}
              losses={engine.losses}
              history={engine.balanceHistory}
              winRatePercent={engine.winRatePercent}
              profitFactor={engine.profitFactor}
              maxDrawdown={engine.maxDrawdown}
              consecutiveLosses={engine.consecutiveLosses}
              maxConsecutiveLosses={engine.maxConsecutiveLosses}
              simMode={engine.simMode}
              onToggleSimMode={engine.setSimMode}
              isRuin={engine.isRuin}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col">
            <ActiveTicketHUD
              ticket={engine.ticket}
              onInspectBot={setInspectedBot}
            />
          </div>
        </div>

        {/* ROW 2: THE TRADING FLOOR (8 cols) + QUANT RADAR & FUNNEL (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 flex flex-col">
            <TraderRosterBento
              traders={engine.traders}
              onInspectBot={setInspectedBot}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col">
            <QuantRadarFunnel
              funnel={engine.funnel}
              currentToken={engine.currentToken}
              selectedIndex={engine.selectedTokenIndex}
              onSelectToken={engine.setSelectedTokenIndex}
            />
          </div>
        </div>

        {/* ROW 3: FULL-WIDTH HIGH-FREQUENCY LIVE ORDER LEDGER */}
        <div className="w-full">
          <OrderLedgerPanel feeds={engine.feedLogs} />
        </div>
      </div>

      {/* MEGA WIN POPUP MODAL */}
      <MegaWinModal
        megaWin={engine.megaWin}
        onClose={() => engine.setMegaWin(null)}
      />

      {/* AVATAR INSPECTOR MODAL */}
      <AvatarInspectorModal
        botName={inspectedBot}
        onClose={() => setInspectedBot(null)}
        traderStats={inspectedTraderStats}
      />

      {/* BYBIT SETTINGS MODAL */}
      <BybitTestnetModal
        isOpen={isBybitModalOpen}
        onClose={() => setIsBybitModalOpen(false)}
        feedState={engine.bybitFeed}
        credentials={bybitCreds}
        onCredentialsChange={setBybitCreds}
        marketCategory="BYBIT_TESTNET"
        onSelectBybitMarket={() => {}}
        autoExecuteTestnet={autoExecuteTestnet}
        onToggleAutoExecuteTestnet={(val) => {
          setAutoExecuteTestnet(val);
          localStorage.setItem('bybit_auto_execute_testnet', val ? 'true' : 'false');
        }}
      />
    </div>
  );
}

export default App;
