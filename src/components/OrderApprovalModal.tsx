import React from 'react';
import { PendingOrder } from '../types';
import { ShieldAlert, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Clock, Target, AlertTriangle, Sparkles } from 'lucide-react';

interface OrderApprovalModalProps {
  order: PendingOrder;
  onApprove: () => void;
  onVeto: () => void;
}

export const OrderApprovalModal: React.FC<OrderApprovalModalProps> = ({
  order,
  onApprove,
  onVeto
}) => {
  const isBuy = order.action === 'BUY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl p-6 rounded-2xl bg-gradient-to-b from-[#11162b] to-[#0c0f1d] border-2 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.35)] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white tracking-wide">
                  HERMES 7-AGENT DISPATCH
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  HITL APPROVAL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Operator confirmation required before broker routing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Standing by</span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="my-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          {/* Main Pair & Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-black text-white tracking-tight">
                {order.instrument}
              </span>
              <span className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs flex items-center gap-1 ${
                isBuy
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {isBuy ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {order.action} ORDER
              </span>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono uppercase text-slate-400">Hydra Quality</div>
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                Grade {order.setupGrade} ({order.gradeScore}/100)
              </span>
            </div>
          </div>

          {/* Pricing Levels */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
            <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <div className="text-[10px] font-mono uppercase text-slate-400">Entry Target</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                ${order.entryPrice.toLocaleString()}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30">
              <div className="text-[10px] font-mono uppercase text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Stop Loss
              </div>
              <div className="text-sm font-mono font-bold text-rose-300 mt-0.5">
                ${order.stopLoss.toLocaleString()}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
              <div className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1">
                <Target className="w-3 h-3" /> Profit Target
              </div>
              <div className="text-sm font-mono font-bold text-emerald-300 mt-0.5">
                ${order.targetPrice.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Sentinel Risk Rule */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs font-mono">
            <div className="flex items-center gap-2 text-indigo-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Sentinel Cap: Strict 0.75% Max Risk</span>
            </div>
            <div className="font-bold text-white">
              Risk: ${order.riskUsd.toFixed(2)} <span className="text-emerald-400">(Reward: +${order.potentialProfitUsd.toFixed(2)})</span>
            </div>
          </div>

          {/* AI Committee Synthesis */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
            <span className="font-mono font-bold text-indigo-400">Hermes Rationale: </span>
            {order.rationale}. Atlas confirms trend direction; Lumen reports clear macro news window.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onVeto}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 font-display font-semibold text-sm border border-slate-700/80 hover:border-rose-500/50 transition-all duration-200 active:scale-95"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            Veto / Stand Aside (+15 XP)
          </button>

          <button
            onClick={onApprove}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-display font-bold text-sm shadow-lg shadow-emerald-600/30 border border-emerald-400/40 transition-all duration-200 active:scale-95 hover:shadow-emerald-500/50"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            Approve Order (+35 XP)
          </button>
        </div>
      </div>
    </div>
  );
};
