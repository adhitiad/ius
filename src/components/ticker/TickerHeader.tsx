"use client";

import React from "react";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TickerHeaderProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: "Bullish" | "Bearish" | "Neutral";
}

export function TickerHeader({
  symbol,
  name,
  price,
  change,
  changePercent,
  sentiment,
}: TickerHeaderProps) {
  const isPositive = change >= 0;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      <div className="space-y-4">
        {/* Breadcrumb / Symbol */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-bold tracking-widest uppercase">
            Ticker Detail
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-100 font-bold tracking-tight">{symbol}</span>
        </div>

        {/* Name & Sentiment */}
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            {name}
          </h1>
          <div
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border",
              sentiment === "Bullish"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.4)]"
                : sentiment === "Bearish"
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_-5px_rgba(244,63,94,0.4)]"
                : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
              sentiment === "Bullish" ? "bg-emerald-500" : sentiment === "Bearish" ? "bg-rose-500" : "bg-zinc-500"
            )} />
            {sentiment} Sentiment
          </div>
        </div>
      </div>

      {/* Price Info */}
      <div className="flex flex-col items-start md:items-end gap-1 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 backdrop-blur-sm self-start">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Last Traded Price</p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-white tracking-tighter">
            IDR {price.toLocaleString()}
          </span>
          <div className={cn(
            "flex items-center gap-1 font-bold text-sm",
            isPositive ? "text-emerald-400" : "text-rose-400"
          )}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>
              {isPositive ? "+" : ""}{change.toLocaleString()} ({changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
