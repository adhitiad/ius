"use client";

import React, { useMemo } from "react";
import { WhaleData } from "./WhaleDetectorTable";
import { cn } from "@/lib/utils";

interface MarketRadarProps {
  data: WhaleData[];
  loading?: boolean;
}

export function MarketRadar({ data, loading }: MarketRadarProps) {
  const radarStocks = useMemo(() => {
    // Take top 20 by bandar power or volatility for better visualization
    return [...data]
      .sort((a, b) => b.bandarPower - a.bandarPower)
      .slice(0, 15);
  }, [data]);

  if (loading) {
     return (
         <div className="w-full h-[500px] bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6">
               <div className="relative">
                  <div className="absolute inset-0 size-16 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="size-16 border-[6px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin relative z-10" />
               </div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] animate-pulse">Sinkronisasi Matriks Radar...</p>
            </div>
         </div>
     );
  }

  return (
    <div className="relative w-full h-[600px] bg-zinc-950/50 border border-white/5 rounded-[3rem] overflow-hidden">
      {/* Matrix Identification */}
      <div className="absolute top-10 left-10 z-20">
         <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-1">Neural Radar Matrix</h3>
         <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest text-left">Real-Time Asset Positioning</span>
         </div>
      </div>

      {/* Axis Labels */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
        Akumulasi Tinggi
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-500/60 uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
        Distribusi Panik
      </div>
      <div className="absolute left-10 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
        Alfa Negatif
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
        Alfa Positif
      </div>

      {/* Pulsing Sweep Effect */}
      <div className="absolute inset-0 bg-conic-gradient from-emerald-500/20 via-transparent to-transparent animate-slow-spin origin-center opacity-20" />

      {/* Stock Nodes */}
      <div className="relative w-full h-full">
        {radarStocks.map((stock) => {
          // Normalize coordinates: 
          // X-axis: Change (-5% to +5%)
          // Y-axis: Bandar Power (0 to 100)
          const x = 50 + (stock.change * 8); // Scaled
          const y = 100 - stock.bandarPower; // Inverted for Y-axis (Top is high power)
          
          return (
            <div 
              key={stock.ticker}
              className="absolute transition-all duration-1000 ease-out hover:z-50 group/node"
              style={{ left: `${Math.min(90, Math.max(10, x))}%`, top: `${Math.min(90, Math.max(10, y))}%` }}
            >
               <div className="relative">
                  {/* Outer ripple */}
                  <div className={cn(
                    "absolute inset-0 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping opacity-20",
                    stock.bandarPower > 80 ? "bg-emerald-500" : stock.bandarPower < 30 ? "bg-rose-500" : "bg-white"
                  )} />
                  
                  {/* Main dot */}
                  <div className={cn(
                    "size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-950 shadow-xl transition-transform group-hover/node:scale-150",
                    stock.bandarPower > 80 ? "bg-emerald-500" : stock.bandarPower < 30 ? "bg-rose-500" : "bg-white"
                  )} />

                  {/* Label */}
                  <div className="absolute top-4 left-0 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 group-hover/node:opacity-100 transition-opacity">
                     <span className="text-[10px] font-black text-white bg-black/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-md">
                        {stock.ticker}
                     </span>
                     {/* Mini tooltip on hover */}
                     <div className="hidden group-hover/node:block bg-zinc-900/90 border border-white/10 p-3 rounded-2xl text-[9px] font-black text-zinc-400 whitespace-nowrap shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex justify-between gap-4">
                              <span>POWER BANDAR:</span>
                              <span className="text-white">{stock.bandarPower}%</span>
                           </div>
                           <div className="flex justify-between gap-4">
                              <span>PERUBAHAN:</span>
                              <span className={cn(stock.change >= 0 ? "text-emerald-400" : "text-rose-400")}>{stock.change}%</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* Legend Block */}
      <div className="absolute bottom-10 left-10 p-6 bg-black/40 backdrop-blur-md border border-white/5 rounded-[2rem] space-y-4">
         <div className="flex items-center gap-4">
            <div className="relative">
               <div className="absolute inset-0 bg-emerald-500/40 blur-md rounded-full animate-pulse" />
               <div className="size-3 rounded-full bg-emerald-500 relative z-10" />
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Aktivitas Bandar</span>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative">
               <div className="absolute inset-0 bg-rose-500/40 blur-md rounded-full animate-pulse" />
               <div className="size-3 rounded-full bg-rose-500 relative z-10" />
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tekanan Jual</span>
         </div>
      </div>
    </div>
  );
}
