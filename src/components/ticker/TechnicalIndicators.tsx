"use client";

import React from "react";
import { TrendingUp, TrendingDown, Activity, Zap, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndicatorProps {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  movingAverage: { period: number; status: "Bullish" | "Bearish"; value: number };
}

export function TechnicalIndicators({ rsi, macd, movingAverage }: IndicatorProps) {
  const indicators = [
    {
      label: "Relative Strength Index (RSI 14)",
      value: rsi.toFixed(2),
      status: rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral",
      statusColor: rsi > 70 ? "text-rose-400" : rsi < 30 ? "text-emerald-400" : "text-zinc-400",
      icon: Activity,
      desc: rsi > 50 ? "Bullish Momentum" : "Bearish Momentum",
    },
    {
      label: "MACD (12, 26, 9)",
      value: macd.value.toFixed(2),
      status: macd.histogram >= 0 ? "Bullish Cross" : "Bearish Cross",
      statusColor: macd.histogram >= 0 ? "text-emerald-400" : "text-rose-400",
      icon: Zap,
      desc: `Signal: ${macd.signal.toFixed(2)}`,
    },
    {
      label: `Moving Average (${movingAverage.period} Day)`,
      value: `IDR ${movingAverage.value.toLocaleString()}`,
      status: movingAverage.status,
      statusColor: movingAverage.status === "Bullish" ? "text-emerald-400" : "text-rose-400",
      icon: movingAverage.status === "Bullish" ? TrendingUp : TrendingDown,
      desc: movingAverage.status === "Bullish" ? "Trading Above Trend" : "Trading Below Trend",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {indicators.map((ind, i) => (
        <div 
          key={i} 
          className={cn(
            "bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl shadow-lg hover:border-zinc-700 transition-all group",
            "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-white transition-colors">
              <ind.icon size={20} />
            </div>
            <span className={cn("text-[10px] font-black uppercase tracking-widest", ind.statusColor)}>
              {ind.status}
            </span>
          </div>
          
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{ind.label}</p>
            <p className="text-3xl font-black text-white tracking-tighter">{ind.value}</p>
            <p className="text-[10px] text-zinc-500 font-medium italic">{ind.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
