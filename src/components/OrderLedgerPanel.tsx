import React, { useState } from 'react';
import { FeedFill } from '../engine/grokJevEngine';
import { ScrollText, Search, Download, CheckCircle2, XCircle } from 'lucide-react';

interface OrderLedgerPanelProps {
  feeds: FeedFill[];
}

export const OrderLedgerPanel: React.FC<OrderLedgerPanelProps> = ({ feeds }) => {
  const [filterTrader, setFilterTrader] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const traders = ['ALL', 'BAZZ', 'QUILO', 'TOMI', 'OKKO', 'FERRO', 'LUX'];

  const filteredFeeds = feeds.filter((fill) => {
    const matchesTrader = filterTrader === 'ALL' || fill.trader === filterTrader;
    const matchesSearch =
      searchQuery === '' ||
      fill.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fill.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fill.trader.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrader && matchesSearch;
  });

  const exportCSV = () => {
    const headers = 'Time,Trader,Role,Token,Description,PnL,IsLoss\n';
    const rows = feeds
      .map(
        (f) =>
          `"${f.time}","${f.trader}","${f.role}","${f.token}","${f.desc.replace(/"/g, '""')}","${f.pnl}","${f.isLoss}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devs_quant_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="terminal-card w-full">
      <div className="terminal-card-inner p-4 sm:p-5 flex flex-col justify-between">
        {/* Header: Title, Filters, Search & Export */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-white/10 gap-3">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-emerald-400" />
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
              LIVE EXECUTION LEDGER
            </h3>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              · REAL-TIME BYBIT ORDER FILLS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-[11px] rounded-lg bg-black/50 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-36 sm:w-44"
              />
            </div>

            {/* Trader Filter Pills */}
            <div className="hidden lg:flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
              {traders.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTrader(t)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    filterTrader === t
                      ? 'bg-white/15 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* CSV Export Button */}
            <button
              onClick={exportCSV}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-black/50 hover:bg-white/10 border border-white/10 text-slate-300 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              title="Export execution history as CSV"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>EXPORT</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto no-scrollbar max-h-72 overflow-y-auto mt-2">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-2 px-3">TIME</th>
                <th className="py-2 px-3">TRADER</th>
                <th className="py-2 px-3">ROLE</th>
                <th className="py-2 px-3">PAIR</th>
                <th className="py-2 px-3">EXECUTION BREAKDOWN (GROSS / FEES / NET)</th>
                <th className="py-2 px-3 text-right">NET REALIZED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFeeds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No orders logged yet. Autonomous engine executes on completed Bybit candle confirmation.
                  </td>
                </tr>
              ) : (
                filteredFeeds.map((fill) => {
                  const isWin = !fill.isLoss;
                  const isMega = fill.isMega;

                  return (
                    <tr
                      key={fill.id}
                      className={`transition-colors text-[11px] ${
                        isMega
                          ? 'bg-amber-500/10 border-l-2 border-amber-400 text-amber-200 font-bold'
                          : 'hover:bg-white/[0.02] text-slate-300'
                      }`}
                    >
                      <td className="py-2 px-3 text-slate-400 text-[10px] whitespace-nowrap">
                        {fill.time}
                      </td>

                      <td className="py-2 px-3 font-bold whitespace-nowrap">
                        <span
                          className={
                            fill.trader === 'BAZZ'
                              ? 'text-cyan-400'
                              : fill.trader === 'QUILO'
                              ? 'text-pink-400'
                              : fill.trader === 'TOMI'
                              ? 'text-rose-400'
                              : fill.trader === 'OKKO'
                              ? 'text-purple-400'
                              : fill.trader === 'FERRO'
                              ? 'text-blue-400'
                              : 'text-slate-100'
                          }
                        >
                          {fill.trader}
                        </span>
                      </td>

                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-slate-400">
                          {fill.role}
                        </span>
                      </td>

                      <td className="py-2 px-3 font-bold text-cyan-300 whitespace-nowrap">
                        {fill.token}
                      </td>

                      <td
                        className="py-2 px-3 text-slate-300 truncate max-w-xs sm:max-w-md cursor-help"
                        title={fill.desc}
                      >
                        {fill.desc}
                      </td>

                      <td
                        className={`py-2 px-3 text-right font-bold whitespace-nowrap ${
                          isWin ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1 justify-end">
                          {isWin ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-rose-400" />}
                          {isWin ? `+$${fill.pnl.toFixed(2)}` : `-$${Math.abs(fill.pnl).toFixed(2)}`}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>LATENCY SPEED: &lt;12ms TO BYBIT MATCHING ENGINE</span>
          <span className="text-slate-300">
            SHOWING {filteredFeeds.length} OF {feeds.length} TOTAL FILLS
          </span>
        </div>
      </div>
    </div>
  );
};
