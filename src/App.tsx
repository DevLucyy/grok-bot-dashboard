import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGrokJevEngine } from './engine/grokJevEngine';
import { GrokJevHeader } from './components/GrokJevHeader';
import { GrokBalancePanel } from './components/GrokBalancePanel';
import { TheFunnelPanel } from './components/TheFunnelPanel';
import { JevAnalysisPanel } from './components/JevAnalysisPanel';
import { JevChecksPanel } from './components/JevChecksPanel';
import { OnTheTicketPanel } from './components/OnTheTicketPanel';
import { TheLinePanel } from './components/TheLinePanel';
import { TheFloorPanel } from './components/TheFloorPanel';
import { WhosCarryingPanel } from './components/WhosCarryingPanel';
import { LineFeedPanel } from './components/LineFeedPanel';
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
      duration: 1.2,
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
      className="min-h-screen w-full bg-[#070709] text-slate-200 p-2 sm:p-4 md:p-6 font-mono select-none antialiased relative overflow-x-hidden flex flex-col items-center"
    >
      {/* Cyber Ambient Matrix Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#eab30807_1px,transparent_1px),linear-gradient(to_bottom,#eab30807_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-[1800px] flex flex-col gap-4 relative z-10">
        {/* TOP STATUS BAR: BRANDING + DIGITAL CLOCK + BYBIT QUICK LINK */}
        <div className="cyber-enter-row flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-yellow-500/20">
          <GrokJevHeader
            balance={engine.balance}
            digitalTime={engine.digitalTime}
            cloudExecutions={engine.cloudExecutions}
            isCloudSynced={engine.isCloudSynced}
            lastCloudSync={engine.lastCloudSync}
            onResetToFifteen={() => engine.resetToWallet(15.00)}
          />

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Bybit API / Testnet Trigger */}
            <button
              onClick={() => setIsBybitModalOpen(true)}
              className="px-2.5 py-1 text-[10px] font-mono font-bold rounded bg-[#0b0e14] hover:bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Configure Bybit API / Live Feed Keys"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  engine.bybitFeed.isConnected ? 'bg-emerald-400' : 'bg-yellow-400 animate-pulse'
                }`}
              />
              BYBIT API / TESTNET
            </button>
          </div>
        </div>

        {/* ROW 1: BALANCE PANEL (8 cols) + THE FUNNEL (4 cols) */}
        <div className="cyber-enter-row grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <GrokBalancePanel
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

          <div className="lg:col-span-4">
            <TheFunnelPanel funnel={engine.funnel} />
          </div>
        </div>

        {/* ROW 2: DEV'S QUANT RADAR (8 cols) + [QUANT GATES & ON THE TICKET] (4 cols) */}
        <div className="cyber-enter-row grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <JevAnalysisPanel
              token={engine.currentToken}
              selectedIndex={engine.selectedTokenIndex}
              onSelectToken={engine.setSelectedTokenIndex}
              scannedCount={engine.funnel.universe}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <JevChecksPanel />
            <OnTheTicketPanel 
              ticket={engine.ticket} 
              onInspectBot={setInspectedBot}
            />
          </div>
        </div>

        {/* ROW 3: THE LINE (8 cols) + [THE FLOOR & WHO'S CARRYING] (4 cols) */}
        <div className="cyber-enter-row grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <TheLinePanel
              activeStationIndex={engine.activeStationIndex}
              rugBinCount={engine.rugBinCount}
              vaultPings={engine.vaultPings}
              balance={engine.balance}
              conveyorTokens={engine.conveyorTokens}
              onInspectBot={setInspectedBot}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <TheFloorPanel 
              traders={engine.traders} 
              onInspectBot={setInspectedBot}
            />
            <WhosCarryingPanel 
              traders={engine.traders} 
              onInspectBot={setInspectedBot}
            />
          </div>
        </div>

        {/* ROW 4: LINE FEED (12 cols full width) */}
        <div className="cyber-enter-row grid grid-cols-1 gap-4">
          <LineFeedPanel feeds={engine.feedLogs} />
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
