"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarketGaugeProps {
  value: number; // 0 - 100
  label: string;
  className?: string;
}

export function MarketGauge({ value, label, className }: MarketGaugeProps) {
  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-4 group", className)}>
      <svg className="w-56 h-56 -rotate-90 transform drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={value > 60 ? "#10b981" : value < 40 ? "#f43f5e" : "#f59e0b"} />
            <stop offset="100%" stopColor={value > 60 ? "#34d399" : value < 40 ? "#fb7185" : "#fbbf24"} />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Tech Decorative Ring */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="1 10"
          className="text-zinc-700 opacity-60 animate-slow-spin origin-center"
        />
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="0.2"
          className="text-zinc-800 opacity-30"
        />

        {/* Tick Marks */}
        {[...Array(20)].map((_, i) => {
          const angle = (i * 18) * (Math.PI / 180);
          const x1 = (100 + 72 * Math.cos(angle)).toFixed(4);
          const y1 = (100 + 72 * Math.sin(angle)).toFixed(4);
          const x2 = (100 + 68 * Math.cos(angle)).toFixed(4);
          const y2 = (100 + 68 * Math.sin(angle)).toFixed(4);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1.5"
              className={cn(
                "transition-colors duration-700",
                (i / 20) * 100 <= value ? "text-white/20" : "text-zinc-900"
              )}
            />
          );
        })}

        {/* Background Track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          className="text-zinc-900/50"
        />
        
        {/* Progress Glow Shadow */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="url(#gaugeGradient)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow)"
          className="transition-all duration-1000 ease-out opacity-20"
        />

        {/* Real Progress Stroke */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Inner Tech Accent */}
        <circle
          cx="100"
          cy="100"
          r={radius - 12}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-white/5"
        />
      </svg>

      {/* Center Intelligence Hub */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="relative group-hover:scale-110 transition-transform duration-700">
           <span className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
             {value}
             <span className="text-xl text-zinc-600">%</span>
           </span>
           <div className={cn(
             "absolute -inset-4 blur-3xl opacity-20 rounded-full transition-colors duration-1000",
             value > 60 ? "bg-emerald-500/30" : value < 40 ? "bg-rose-500/30" : "bg-amber-500/30"
           )} />
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
           <div className="flex items-center gap-3">
              <div className={cn(
                "size-2.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]",
                value > 60 ? "text-emerald-500 bg-emerald-500" : value < 40 ? "text-rose-500 bg-rose-500" : "text-amber-500 bg-amber-500"
              )} />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white drop-shadow-md">
                {label}
              </span>
           </div>
           <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
           <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600 animate-pulse">
             Analisis Aktif
           </span>
        </div>
      </div>

      {/* Atmospheric Aura */}
      <div className={cn(
        "absolute -z-10 blur-[80px] opacity-10 w-40 h-40 rounded-full transition-all duration-1000 group-hover:opacity-20 translate-y-2",
        value > 60 ? "bg-emerald-500" : value < 40 ? "bg-rose-500" : "bg-amber-500"
      )} />
    </div>
  );
}
