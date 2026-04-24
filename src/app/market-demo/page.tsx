"use client";

import React from "react";
import { MarketTable } from "@/components/dashboard/MarketTable";
import { useMarketSocket } from "@/hooks/useMarketSocket";
import { Terminal, Cpu, Zap } from "lucide-react";

export default function MarketDemoPage() {
  // Aktifkan koneksi WebSocket Binance untuk mensuplai data deras
  const { isConnected, retryCount } = useMarketSocket();

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 pt-24 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-tighter">
            <Zap className="w-3 h-3" />
            Performance Demo
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">
            Zustand <span className="text-blue-500">Efficiency</span> Test
          </h1>
          <p className="text-zinc-400 max-w-xl text-lg leading-relaxed">
            Halaman ini membuktikan teknik <span className="text-white font-bold italic">Selective Re-rendering</span>. 
            Meskipun ribuan data masuk per detik dari Binance, hanya sel harga yang berubah yang akan me-render ulang.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up delay-100">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Terminal className="w-4 h-4 text-emerald-500" />
              Status Koneksi
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              <span className="text-xs text-zinc-400">
                {isConnected ? "Live Data Binance Aktif (wss://...)" : "Terputus"}
                {retryCount > 0 && ` (Retrying: ${retryCount})`}
              </span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Cpu className="w-4 h-4 text-blue-500" />
              Teori Performa
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Gunakan F12 (DevTools) &gt; Console. Lihat log <span className="text-white font-mono bg-zinc-800 px-1">MarketTable Rendered</span>. 
              Jika ia tidak muncul berulang-ulang saat harga berkedip, sistem berfungsi efisien!
            </p>
          </div>
        </div>

        {/* Main Component */}
        <div className="animate-fade-in-up delay-200">
          <MarketTable />
        </div>

        <div className="pt-8 text-center animate-fade-in-up delay-300">
          <p className="text-zinc-600 text-xs italic">
            Developed by Antigravity AI Engine
          </p>
        </div>
      </div>
    </div>
  );
}
