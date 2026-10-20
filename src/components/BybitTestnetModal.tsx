import React, { useState, useEffect } from 'react';
import {
  BybitFeedState,
  BybitCredentials,
  saveBybitCredentials,
  clearBybitCredentials,
  checkBybitTestnetWallet,
  BybitWalletCheckResult,
} from '../engine/bybitClient';
import { X, Shield, Activity, Radio, Key, Check, Trash2, ExternalLink, RefreshCw, HelpCircle, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface BybitTestnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedState: BybitFeedState;
  credentials: BybitCredentials;
  onCredentialsChange: (creds: BybitCredentials) => void;
  marketCategory?: string;
  onSelectBybitMarket?: () => void;
  autoExecuteTestnet?: boolean;
  onToggleAutoExecuteTestnet?: (enabled: boolean) => void;
}

export const BybitTestnetModal: React.FC<BybitTestnetModalProps> = ({
  isOpen,
  onClose,
  feedState,
  credentials,
  onCredentialsChange,
  autoExecuteTestnet = true,
  onToggleAutoExecuteTestnet,
}) => {
  const [apiKey, setApiKey] = useState(credentials.apiKey);
  const [apiSecret, setApiSecret] = useState(credentials.apiSecret);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [walletInfo, setWalletInfo] = useState<BybitWalletCheckResult | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (credentials.apiKey && credentials.apiSecret) {
      handleVerify(credentials);
    }
  }, [credentials.apiKey]);

  if (!isOpen) return null;

  const handleVerify = async (credsToVerify = { apiKey, apiSecret, isConfigured: true }) => {
    setIsVerifying(true);
    try {
      const res = await checkBybitTestnetWallet(credsToVerify);
      setWalletInfo(res);
    } catch (err: any) {
      setWalletInfo({ ok: false, error: err?.message || 'Connection check failed' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveBybitCredentials({ apiKey, apiSecret });
    onCredentialsChange(updated);
    setSavedSuccess(true);
    handleVerify(updated);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClear = () => {
    clearBybitCredentials();
    setApiKey('');
    setApiSecret('');
    setWalletInfo(null);
    onCredentialsChange({ apiKey: '', apiSecret: '', isConfigured: false });
  };

  const btc = feedState.tickers['BTCUSDT'];
  const eth = feedState.tickers['ETHUSDT'];
  const sol = feedState.tickers['SOLUSDT'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090d16] border-2 border-yellow-400 rounded-2xl p-6 shadow-[0_0_50px_rgba(234,179,8,0.3)] overflow-hidden font-mono max-h-[90vh] overflow-y-auto">
        {/* Glow accents */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black text-lg shadow-[0_0_12px_rgba(234,179,8,0.5)]">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Bybit V5 Testnet Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-500/40 uppercase">
                  $0 Risk · Paper Funds
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span>api-testnet.bybit.com</span>
                <span className="text-slate-600">•</span>
                <span className={feedState.isConnected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {feedState.isConnected ? `Connected (${feedState.latencyMs}ms)` : 'Connecting...'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Public Market Telemetry */}
        <div className="my-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Live Bybit Testnet Prices (Zero Keys Required)
            </span>
            <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Real Orderbook Matching
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg bg-black/60 border border-yellow-500/10">
              <div className="text-[9px] text-slate-500">BTC/USDT</div>
              <div className="text-sm font-bold text-white">${btc ? btc.lastPrice.toLocaleString() : '81,900.00'}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-yellow-500/10">
              <div className="text-[9px] text-slate-500">ETH/USDT</div>
              <div className="text-sm font-bold text-white">${eth ? eth.lastPrice.toLocaleString() : '2,840.50'}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-yellow-500/10">
              <div className="text-[9px] text-slate-500">SOL/USDT</div>
              <div className="text-sm font-bold text-white">${sol ? sol.lastPrice.toLocaleString() : '184.20'}</div>
            </div>
          </div>
        </div>

        {/* Live Testnet Wallet Balance / Status Display */}
        {credentials.isConfigured && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-yellow-950/40 to-emerald-950/40 border border-yellow-500/40 my-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${walletInfo?.ok ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span>BYBIT TESTNET PAPER WALLET</span>
                    {walletInfo?.accountType && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] bg-slate-800 text-yellow-400 border border-slate-700">
                        {walletInfo.accountType}
                      </span>
                    )}
                  </div>
                  <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                    {walletInfo?.ok ? (
                      `$${walletInfo.totalEquity?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`
                    ) : isVerifying ? (
                      <span className="text-yellow-400 text-xs flex items-center gap-1.5">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Querying Bybit V5 API & Syncing Time...
                      </span>
                    ) : walletInfo?.error ? (
                      <span className="text-rose-400 text-xs font-medium">Connection Check Failed</span>
                    ) : (
                      'Ready to Query'
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleVerify(credentials)}
                disabled={isVerifying}
                className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black border border-yellow-500/30 text-yellow-400 text-[10px] font-bold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
                Verify Balance
              </button>
            </div>

            {/* Error Message Details Banner */}
            {walletInfo && !walletInfo.ok && walletInfo.error && (
              <div className="mt-2.5 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-[11px] text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-rose-200">{walletInfo.error}</div>
                  <p className="text-[10px] text-rose-300/80 leading-relaxed">
                    Tip: Make sure you created this key on <strong className="text-yellow-300">testnet.bybit.com</strong> (not mainnet bybit.com), selected <strong>Read-Write</strong> permissions, and set <strong>No IP restriction</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auto-Execute Toggle */}
        <div className="p-3 rounded-xl bg-[#0e1424] border border-cyan-500/30 my-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>⚡</span> REAL TESTNET AUTO-ORDER ROUTING
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Automatically broadcast <code className="text-cyan-300">POST /v5/order/create</code> to Bybit Testnet orderbook ($0 real money).
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoExecuteTestnet}
              onChange={(e) => onToggleAutoExecuteTestnet?.(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400" />
          </label>
        </div>

        {/* Testnet API Keys Form */}
        <div className="p-4 rounded-xl bg-black/70 border border-yellow-500/20 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Key className="w-3.5 h-3.5 text-yellow-400" />
              <span>Testnet API Key & Secret</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-[10px] text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                Permissions Guide
                {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <a
                href="https://testnet.bybit.com/app/user/api-management"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Bybit Testnet API Page <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Quick Setup / Checklist Accordion */}
          {showGuide && (
            <div className="mb-3 p-3 rounded-lg bg-yellow-950/20 border border-yellow-500/30 text-[11px] text-slate-300 space-y-2">
              <div className="font-bold text-yellow-400 flex items-center gap-1">
                <span>📋 Checklist for Bybit Testnet Key:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-300">
                <li><strong className="text-white">Domain:</strong> Must be created on <code className="text-yellow-300 bg-black/60 px-1 py-0.5 rounded">testnet.bybit.com</code> (NOT mainnet bybit.com).</li>
                <li><strong className="text-white">API Key Type:</strong> Choose <strong>"System-generated API Keys"</strong>.</li>
                <li><strong className="text-white">Permissions:</strong> Choose <strong>"Read-Write"</strong>.</li>
                <li><strong className="text-white">Unified Trading / Contract:</strong> Tick <strong>"Orders"</strong> and <strong>"Positions"</strong>.</li>
                <li><strong className="text-white">Account:</strong> Tick <strong>"Read"</strong> (Wallet / Assets).</li>
                <li><strong className="text-white">IP Restriction:</strong> Choose <strong>"No IP restriction"</strong> so your browser can connect directly.</li>
              </ul>
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-2.5">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste Bybit Testnet API Key"
                className="w-full px-3 py-2 rounded-lg bg-[#0b0e17] border border-slate-800 text-xs text-white focus:outline-none focus:border-yellow-400 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                API Secret
              </label>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Paste Bybit Testnet API Secret"
                className="w-full px-3 py-2 rounded-lg bg-[#0b0e17] border border-slate-800 text-xs text-white focus:outline-none focus:border-yellow-400 transition-colors font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-yellow-400/20"
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                  {savedSuccess ? 'Saved Securely!' : 'Save Credentials & Test'}
                </button>

                {credentials.isConfigured && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>

              {credentials.isConfigured ? (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Connected
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">
                  Client-side storage only
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-yellow-500/10 text-[10px] text-slate-400">
          <span>All orders placed via Bybit Testnet are executed with paper money ($0 capital risk).</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
