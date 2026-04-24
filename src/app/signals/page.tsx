"use client";

import React from "react";
import { SignalCard } from "@/components/signals/SignalCard";
import { Sparkles, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_SIGNALS = [
  {
    id: 1,
    ticker: "BBCA",
    type: "BUY" as const,
    orderType: "MARKET BUY" as const,
    tp: 10500,
    sl: 9800,
    winRate: 84,
    sentiment: "Akumulasi masif oleh broker asing terdeteksi pada area support psikologis. Momentum RSI mulai keluar dari zona oversold.",
  },
  {
    id: 2,
    ticker: "BBNI",
    type: "SELL" as const,
    orderType: "SELL LIMIT" as const,
    tp: 4200,
    sl: 5100,
    winRate: 72,
    sentiment: "Penembusan ke bawah level support EMA-50 disertai lonjakan volume keluar. Tekanan jual sektoral perbankan sedang tinggi.",
  },
  {
    id: 3,
    ticker: "TLKM",
    type: "BUY" as const,
    orderType: "BUY LIMIT" as const,
    tp: 4100,
    sl: 3750,
    winRate: 68,
    sentiment: "Pola Bullish Divergence pada MACD mengindikasikan pembalikan arah. Rebound teknikal diharapkan pada area demand zone.",
  },
  {
    id: 4,
    ticker: "GOTO",
    type: "SELL" as const,
    orderType: "MARKET SELL" as const,
    tp: 45,
    sl: 65,
    winRate: 91,
    sentiment: "Sentimen teknologi global sedang bearish. Arus keluar modal asing belum menunjukkan tanda-tanda berhenti dalam jangka pendek.",
  },
  {
    id: 5,
    ticker: "ASII",
    type: "BUY" as const,
    orderType: "MARKET BUY" as const,
    tp: 5500,
    sl: 4900,
    winRate: 76,
    sentiment: "Data penjualan otomotif bulanan melampaui ekspektasi. Analisis Fibonacci menunjukkan target extension di level 5500.",
  },
  {
    id: 6,
    ticker: "MDKA",
    type: "BUY" as const,
    orderType: "BUY LIMIT" as const,
    tp: 2850,
    sl: 2400,
    winRate: 63,
    sentiment: "Harga komoditas emas dunia merangkak naik, memberikan sentimen positif bagi emiten pertambangan emas domestik.",
  }
];

export default function SignalsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm uppercase tracking-widest">
            <Sparkles size={16} />
            <span>AI Powered Screener</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Signals</span>
          </h1>
          <p className="text-zinc-400 max-w-lg">
            Algoritma kami menganalisis ribuan titik data secara real-time untuk memberikan sinyal trading dengan probabilitas tertinggi.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search ticker..." 
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SIGNALS.map((signal, i) => (
          <div 
            key={signal.id}
            className={cn(
              "animate-fade-in-up fill-mode-both",
              i < 8 ? `animate-stagger-${(i % 8) + 1}` : "animate-stagger-8"
            )}
          >
            <SignalCard {...signal} />
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-12 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 flex items-center justify-center">
        <p className="text-sm text-zinc-500 text-center max-w-2xl leading-relaxed">
          <span className="text-zinc-400 font-semibold italic">Disclaimer:</span> Sinyal di atas dihasilkan secara algoritmik berdasarkan data historis dan sentimen pasar saat ini. Trading melibatkan risiko signifikan. Selalu lakukan analisis mandiri sebelum mengeksekusi order.
        </p>
      </div>
    </div>
  );
}
