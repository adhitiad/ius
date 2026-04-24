"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMarketStore } from "@/store/useMarketStore";
import { cn } from "@/lib/utils";

interface TickerRowProps {
  symbol: string;
}

export function TickerRow({ symbol }: TickerRowProps) {
  // SELEKTOR KRUSIAL: Komponen ini hanya berlangganan ke field spesifik dari symbol ini.
  // Jika ticker lain berubah, komponen ini TIDAK akan me-render ulang.
  const tickerData = useMarketStore((state) => state.prices[symbol]);
  
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef<number | undefined>(tickerData?.price);

  useEffect(() => {
    if (tickerData?.price && tickerData.price !== prevPrice.current) {
      setFlash(tickerData.price > (prevPrice.current || 0) ? "up" : "down");
      prevPrice.current = tickerData.price;

      const timer = setTimeout(() => setFlash(null), 300);
      return () => clearTimeout(timer);
    }
  }, [tickerData?.price]);

  if (!tickerData) {
    return (
      <tr className="border-b border-zinc-800/50">
        <td className="px-6 py-4 text-zinc-500 font-mono text-sm">{symbol}</td>
        <td colSpan={2} className="px-6 py-4 text-center text-zinc-600 text-xs italic">
          Waiting for data...
        </td>
      </tr>
    );
  }

  return (
    <tr 
      className={cn(
        "border-b border-zinc-800/50 transition-colors duration-300",
        flash === "up" ? "bg-emerald-500/10" : flash === "down" ? "bg-rose-500/10" : "hover:bg-zinc-900/40"
      )}
    >
      <td className="px-6 py-4">
        <span className="font-bold text-white tracking-tight">{symbol}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className={cn(
          "font-mono text-sm transition-colors duration-300",
          flash === "up" ? "text-emerald-400" : flash === "down" ? "text-rose-400" : "text-zinc-100"
        )}>
          ${tickerData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-zinc-400 text-xs font-mono">
          {tickerData.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </td>
    </tr>
  );
}
