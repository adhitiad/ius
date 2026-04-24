"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

const cardVariants = cva(
  "relative overflow-hidden rounded-2xl border bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-black/60",
  {
    variants: {
      type: {
        BUY: "border-emerald-500/30 shadow-[0_0_20px_-12px_rgba(16,185,129,0.3)]",
        SELL: "border-rose-500/30 shadow-[0_0_20px_-12px_rgba(244,63,94,0.3)]",
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
      {/* Background Glow */}
      <div
        className={cn(
          "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-[60px]",
          isBuy ? "bg-emerald-500/20" : "bg-rose-500/20"
        )}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{ticker}</h3>
          <span
            className={cn(
              "text-xs font-semibold px-2 py-1 rounded-md uppercase",
              isBuy ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            )}
          >
            {orderType}
          </span>
        </div>
        <div
          className={cn(
            "p-3 rounded-xl",
            isBuy ? "bg-emerald-500/10" : "bg-rose-500/10"
          )}
        >
          {isBuy ? (
            <ArrowUpRight className="text-emerald-400" size={24} />
          ) : (
            <ArrowDownRight className="text-rose-400" size={24} />
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-xs text-zinc-500 uppercase font-medium">Target Price</p>
          <p className="text-lg font-semibold text-white">IDR {tp.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-zinc-500 uppercase font-medium">Stop Loss</p>
          <p className="text-lg font-semibold text-zinc-300">IDR {sl.toLocaleString()}</p>
        </div>
      </div>

      {/* Win Rate Progress */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500 font-medium uppercase tracking-wider">Win-Rate Probability</span>
          <span className={cn("font-bold", isBuy ? "text-emerald-400" : "text-rose-400")}>
            {winRate}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              isBuy ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            )}
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>

      {/* Sentiment Briefing */}
      <div className="pt-4 border-t border-zinc-800/50">
        <div className="flex items-start gap-2">
          <Info size={14} className="text-zinc-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] text-zinc-500 uppercase font-bold mb-1 tracking-widest">Sentiment Briefing</p>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              "{sentiment}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
