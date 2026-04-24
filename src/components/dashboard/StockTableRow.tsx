"use client";

import React from "react";
import { useMarketStore } from "@/store/useMarketStore";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { StockData } from "@/hooks/useMarketData";

interface StockTableRowProps {
  initialData: StockData;
  index: number;
}

export function StockTableRow({ initialData, index }: StockTableRowProps) {
  // OPTIMISASI KRUSIAL: Komponen ini hanya berlangganan ke harga ticker spesifiknya.
  // Zustand dengan selektor akan memastikan komponen ini TIDAK me-render ulang
  // jika harga saham lain di tabel berubah.
  const liveData = useMarketStore((state) => state.prices[initialData.ticker]);
  
  // Gunakan data real-time jika tersedia, jika tidak gunakan initial data (mock/snapshot)
  const price = liveData?.price ?? initialData.price;
  const change = liveData?.changePercent ?? initialData.change;
  const isUp = change >= 0;

  return (
    <tr 
      className={cn(
        "group hover:bg-zinc-900/40 transition-colors duration-200 border-b border-zinc-800/50",
        "animate-fade-in-up fill-mode-both"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-white group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
            {initialData.ticker.substring(0, 1)}
          </div>
          <div>
            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{initialData.ticker}</p>
            <p className="text-[10px] text-zinc-500">IDX: {initialData.ticker}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <p className={cn(
          "text-sm font-mono font-medium transition-colors duration-300",
          liveData ? "text-blue-400" : "text-zinc-200"
        )}>
          Rp {price.toLocaleString("id-ID")}
        </p>
      </td>
      <td className="px-6 py-4 text-right">
        <div className={cn(
          "inline-flex items-center gap-1 text-xs font-bold",
          isUp ? "text-emerald-400" : "text-rose-400"
        )}>
          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(change).toFixed(2)}%
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400">
          <Activity className="w-3 h-3 text-blue-500" />
          {initialData.volumeSpike}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-tighter uppercase",
          initialData.sentiment === "Positive" 
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
        )}>
          {initialData.sentiment}
        </span>
      </td>
    </tr>
  );
}
