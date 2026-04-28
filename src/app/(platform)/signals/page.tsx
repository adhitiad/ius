"use client";

import React, { useState } from "react";
import { SignalCard } from "@/components/signals/SignalCard";
import { Sparkles, Search, Activity, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
  const [search, setSearch] = useState("");

  const filteredSignals = MOCK_SIGNALS.filter(s => 
    s.ticker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden">
      {/* Neural Background */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[30%] right-[-10%] w-[35%] h-[35%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl">
               <Zap className="size-3 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                 Protokol Eksekusi: Aktif
               </span>
            </div>
            <h1 className="text-8xl font-black tracking-tighter leading-[0.8]">
              Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] italic">Signals</span>
            </h1>
            <p className="text-zinc-500 font-bold text-2xl max-w-2xl leading-tight tracking-tight">
               Sinyal perdagangan real-time yang dihasilkan oleh mesin inferensi Neural untuk presisi maksimal.
            </p>
          </div>

          <div className="relative group w-full lg:w-[450px]">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 size-6 text-zinc-700 group-focus-within:text-primary transition-all duration-500" />
            <Input
              placeholder="Search ticker signals..."
              className="pl-20 bg-white/[0.02] border-white/5 h-20 w-full rounded-[2.5rem] focus:bg-white/[0.05] focus:ring-primary/20 transition-all backdrop-blur-3xl text-2xl font-black tracking-tighter placeholder:text-zinc-800 shadow-3xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-48 hover:bg-white/[0.04] transition-all group overflow-hidden">
              <Activity className="size-8 text-emerald-500 group-hover:scale-110 transition-transform" />
              <div>
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Status Aliran</span>
                 <h3 className="text-xl font-black text-white italic tracking-tighter">Sangat Aktif</h3>
              </div>
           </div>
           <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-48 hover:bg-white/[0.04] transition-all group overflow-hidden">
              <ShieldCheck className="size-8 text-blue-500 group-hover:scale-110 transition-transform" />
              <div>
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Verifikasi AI</span>
                 <h3 className="text-xl font-black text-white italic tracking-tighter">Tier 1 Elite</h3>
              </div>
           </div>
           <div className="md:col-span-2 p-8 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between group overflow-hidden">
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-white tracking-tighter leading-tight italic">Rata-rata Akurasi <br/>Minggu Ini</h3>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Berdasarkan 124 Sinyal</p>
              </div>
              <span className="text-8xl font-black text-emerald-500 tracking-tighter drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">86%</span>
           </div>
        </div>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredSignals.map((signal) => (
             <div key={signal.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <SignalCard {...signal} />
             </div>
          ))}
        </div>

        {/* Disclaimer Bento */}
        <div className="p-12 rounded-[4rem] bg-white/[0.01] border border-white/5 backdrop-blur-2xl text-center space-y-6">
           <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-zinc-800 bg-black/40">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Disklaimer Protokol</span>
           </div>
           <p className="max-w-3xl mx-auto text-zinc-600 font-bold text-sm leading-relaxed uppercase tracking-tight blur-[0.2px] hover:blur-0 transition-all cursor-default">
              Sinyal ini dirancang oleh arsitektur neural untuk membantu pengambilan keputusan. Namun, pasar modal memiliki risiko volatilitas yang tidak terduga. Gunakan manajemen risiko yang ketat.
           </p>
        </div>
      </main>

      <footer className="py-20 px-12 border-t border-white/5 bg-black/60 mt-32 backdrop-blur-3xl">
         <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <span className="font-black tracking-tighter text-2xl text-white">IUS.<span className="text-primary italic">SIGNALS</span></span>
            <div className="flex gap-16">
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Update Terakhir</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Sekarang</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Status Feed</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sinkron</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
