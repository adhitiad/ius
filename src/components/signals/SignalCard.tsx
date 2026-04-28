"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Info, Zap, ShieldCheck, Target } from "lucide-react";

const cardVariants = cva(
  "relative overflow-hidden rounded-[2.5rem] border bg-white/[0.02] p-8 backdrop-blur-3xl transition-all duration-700 hover:scale-[1.02] hover:bg-white/[0.04] group shadow-2xl",
  {
    variants: {
      type: {
        BUY: "border-emerald-500/20 shadow-emerald-500/5",
        SELL: "border-rose-500/20 shadow-rose-500/5",
      },
    },
    defaultVariants: {
      type: "BUY",
    },
  }
);

interface SignalCardProps extends VariantProps<typeof cardVariants> {
  ticker: string;
  orderType: "BUY LIMIT" | "SELL LIMIT" | "MARKET BUY" | "MARKET SELL";
  tp: number;
  sl: number;
  winRate: number;
  sentiment: string;
}

export const SignalCard = ({
  ticker,
  orderType,
  tp,
  sl,
  winRate,
  sentiment,
  type,
}: SignalCardProps) => {
  const isBuy = type === "BUY";

  return (
    <div className={cn(cardVariants({ type }))}>
      {/* Neural Background Patterns */}
      <div
        className={cn(
          "absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[100px] opacity-20 transition-all duration-1000 group-hover:opacity-40 group-hover:scale-125",
          isBuy ? "bg-emerald-500" : "bg-rose-500"
        )}
      />

      <div className="relative z-10 space-y-8">
        {/* Header Unit */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5">
                <div className={cn("size-1.5 rounded-full animate-pulse", isBuy ? "bg-emerald-500" : "bg-rose-500")} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{orderType}</span>
             </div>
             <h3 className="text-5xl font-black text-white tracking-tighter italic group-hover:text-primary transition-colors duration-500">
                {ticker}
             </h3>
          </div>
          <div className={cn(
            "size-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-inner",
            isBuy ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-rose-500/10 border border-rose-500/20"
          )}>
            {isBuy ? (
              <ArrowUpRight className="text-emerald-400 size-10" />
            ) : (
              <ArrowDownRight className="text-rose-400 size-10" />
            )}
          </div>
        </div>

        {/* Execution Grid */}
        <div className="grid grid-cols-2 gap-6 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
           <div className="space-y-2">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Take Profit</span>
              <div className="flex items-baseline gap-1">
                 <span className="text-xs font-black text-zinc-500 italic">IDR</span>
                 <span className="text-2xl font-black text-white tracking-tighter tabular-nums">{tp.toLocaleString()}</span>
              </div>
           </div>
           <div className="space-y-2">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Stop Loss</span>
              <div className="flex items-baseline gap-1">
                 <span className="text-xs font-black text-zinc-500 italic">IDR</span>
                 <span className="text-2xl font-black text-zinc-400 tracking-tighter tabular-nums">{sl.toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* Confidence Engine */}
        <div className="space-y-4">
           <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                 <Target className="size-4 text-zinc-600" />
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Neural Confidence</span>
              </div>
              <span className={cn("text-2xl font-black italic tracking-tighter", isBuy ? "text-emerald-400" : "text-rose-400")}>
                 {winRate}%
              </span>
           </div>
           <div className="h-2 w-full bg-white/[0.03] rounded-full p-0.5 border border-white/5 shadow-inner">
             <div
               className={cn(
                 "h-full rounded-full transition-all duration-[1.5s] ease-out shadow-2xl",
                 isBuy ? "bg-gradient-to-r from-emerald-600 to-emerald-400" : "bg-gradient-to-r from-rose-600 to-rose-400"
               )}
               style={{ width: `${winRate}%` }}
             />
           </div>
        </div>

        {/* Intel Summary */}
        <div className="pt-6 border-t border-white/5 relative group/intel">
           <div className="absolute -left-2 top-6 bottom-0 w-1 bg-primary/20 rounded-full group-hover:bg-primary transition-all duration-500" />
           <p className="text-[11px] text-zinc-500 leading-relaxed font-bold italic tracking-tight group-hover:text-zinc-400 transition-colors">
              "{sentiment}"
           </p>
        </div>
      </div>
    </div>
  );
};
