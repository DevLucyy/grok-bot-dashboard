import React, { useState } from 'react';
import { BybitFeedState, BybitCredentials, saveBybitCredentials, clearBybitCredentials } from '../engine/bybitClient';
import { X, Shield, Activity, Radio, Key, Check, Trash2, ExternalLink, Zap } from 'lucide-react';

interface BybitTestnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedState: BybitFeedState;
  credentials: BybitCredentials;
  onCredentialsChange: (creds: BybitCredentials) => void;
  marketCategory: string;
  onSelectBybitMarket: () => void;
}

export const BybitTestnetModal: React.FC<BybitTestnetModalProps> = ({
  isOpen,
  onClose,
  feedState,
  credentials,
  onCredentialsChange,
  marketCategory,
  onSelectBybitMarket
}) => {
  const [apiKey, setApiKey] = useState(credentials.apiKey);
  const [apiSecret, setApiSecret] = useState(credentials.apiSecret);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveBybitCredentials({ apiKey, apiSecret });
    onCredentialsChange(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClear = () => {
    clearBybitCredentials();
    setApiKey('');
    setApiSecret('');
    onCredentialsChange({ apiKey: '', apiSecret: '', isConfigured: false });
  };

  const btc = feedState.tickers['BTCUSDT'];
  const eth = feedState.tickers['ETHUSDT'];
  const sol = feedState.tickers['SOLUSDT'];
  const btcDepth = feedState.depth['BTCUSDT'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0c1228] to-[#070b18] border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Glow acccents */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
                <Radio className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">Bybit V5 Testnet Engine</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  $0 CAPITAL RISK
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                <span>wss://stream-testnet.bybit.com</span>
                <span className="text-slate-600">•</span>
                <span className={feedState.isConnected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {feedState.isConnected ? `Connected (${feedState.latencyMs}ms)` : 'Connecting...'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Public Market Telemetry (Zero Keys Required) */}
        <div className="my-5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Live Bybit Testnet Feeds (No Keys Required)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Real-Time WebSocket L1</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* BTC */}
            <div className="p-3 rounded-2xl bg-[#091024]/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>BTC/USDT</span>
                <span className={`text-[10px] font-bold ${btc && btc.price24hPcnt >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {btc ? `${(btc.price24hPcnt * 100).toFixed(2)}%` : '+0.95%'}
                </span>
              </div>
              <div className="text-base font-extrabold font-mono text-white mt-1">
                ${btc ? btc.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 1 }) : '81,900.0'}
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-1 truncate">
                L2 Skew: {btcDepth ? `${(btcDepth.imbalance * 100).toFixed(0)}%` : '+23%'} {btcDepth && btcDepth.imbalance >= 0 ? 'Buyer' : 'Seller'}
              </div>
            </div>

            {/* ETH */}
            <div className="p-3 rounded-2xl bg-[#091024]/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>ETH/USDT</span>
                <span className={`text-[10px] font-bold ${eth && eth.price24hPcnt >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {eth ? `${(eth.price24hPcnt * 100).toFixed(2)}%` : '+1.81%'}
                </span>
              </div>
              <div className="text-base font-extrabold font-mono text-white mt-1">
                ${eth ? eth.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 1 }) : '2,840.5'}
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-1 truncate">
                Spread: 0.01%
              </div>
            </div>

            {/* SOL */}
            <div className="p-3 rounded-2xl bg-[#091024]/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>SOL/USDT</span>
                <span className={`text-[10px] font-bold ${sol && sol.price24hPcnt >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {sol ? `${(sol.price24hPcnt * 100).toFixed(2)}%` : '+3.19%'}
                </span>
              </div>
              <div className="text-base font-extrabold font-mono text-white mt-1">
                ${sol ? sol.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '184.20'}
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-1 truncate">
                Vol: 890k SOL
              </div>
            </div>
          </div>
        </div>

        {/* Optional Testnet API Keys Form */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Bybit Testnet API Credentials (Optional Demo Orders)</span>
            </div>
            <a
              href="https://testnet.bybit.com/app/user/api-management"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Get Free Testnet Keys <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <p className="text-[11px] text-slate-400 font-mono mb-3">
            Keys are strictly saved in browser <code className="text-cyan-300">localStorage</code>. Never sent to any external server. Used only to place free simulated testnet demo orders with your <strong>$50,000 USDT Testnet balance</strong>.
          </p>

          <form onSubmit={handleSave} className="flex flex-col gap-2.5">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Testnet API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="e.g. 5xX09dfa98sdf098a"
                className="w-full px-3 py-2 rounded-xl bg-[#090d1c] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Testnet API Secret
              </label>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="••••••••••••••••••••••••"
                className="w-full px-3 py-2 rounded-xl bg-[#090d1c] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Shield className="w-3.5 h-3.5" />}
                  {savedSuccess ? 'Saved Securely!' : 'Save Credentials'}
                </button>

                {credentials.isConfigured && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Keys
                  </button>
                )}
              </div>

              {credentials.isConfigured ? (
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Testnet Configured
                </span>
              ) : (
                <span className="text-[11px] font-mono text-slate-500">
                  Running on Public Stream ($0 Risk)
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Footer / Switch Mode Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400">
            <span>Market Mode: </span>
            <span className="text-white font-bold">{marketCategory}</span>
          </div>

          <button
            onClick={() => {
              onSelectBybitMarket();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Switch Engine to Bybit Testnet Mode
          </button>
        </div>
      </div>
    </div>
  );
};
