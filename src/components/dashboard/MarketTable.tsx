"use client";

import React from "react";
import { TickerRow } from "./TickerRow";

export function MarketTable() {
  // BUKTI EFISIENSI: Log ini hanya akan muncul sekali saat mount pertama.
  // Meskipun harga di dalam TickerRow berubah ribuan kali per detik,
  // tabel induk ini tidak akan me-render ulang karena penggunaan selector di TickerRow.
  console.log("📊 [DEMO] MarketTable Rendered");

  const symbols = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "ADAUSDT",
    "DOGEUSDT"
  ];

  return (
    <div className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl overflow-hidden glassmorphism">
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Market Stress Test (Zustand Efficiency)
        </h3>
        <p className="text-[10px] text-zinc-500 mt-1">
          Buka Browser Console untuk melihat bukti efisiensi re-render.
        </p>
      </div>
      
      <table className="w-full text-left">
        <thead>
          <tr className="bg-zinc-900/30 text-[10px] uppercase tracking-widest text-zinc-500">
            <th className="px-6 py-3 font-black">Ticker</th>
            <th className="px-6 py-3 text-right font-black">Price</th>
            <th className="px-6 py-3 text-right font-black">Volume</th>
          </tr>
        </thead>
        <tbody>
          {symbols.map((symbol) => (
            <TickerRow key={symbol} symbol={symbol} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
