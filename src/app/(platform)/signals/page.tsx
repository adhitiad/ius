"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SignalCard } from "@/components/signals/SignalCard";
import { Sparkles, Search, Activity, Zap, ShieldCheck, RefreshCw, Loader2, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { marketService } from "@/services/marketService";

interface LiveSignal {
  ticker: string;
  type: "BUY" | "SELL" | "HOLD";
  orderType: string;
  price: number;
  change: number;
  tp: number;
  sl: number;
  winRate: number;
  rsi: number;
  composite_score: number;
  whale_score: number;
  sentiment: string;
  source: string;
}

export default function SignalsPage() {
  const [search, setSearch] = useState("");
  const [signals, setSignals] = useState<LiveSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [signalCount, setSignalCount] = useState(0);

  const fetchSignals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await marketService.getLiveSignals();
      const liveSignals: LiveSignal[] = (data?.signals ?? []).map((s: any) => ({
        ticker: s.ticker,
        type: s.type as "BUY" | "SELL" | "HOLD",
        orderType: s.orderType ?? s.order_type ?? "HOLD",
        price: s.price ?? 0,
        change: s.change ?? 0,
        tp: s.tp ?? 0,
        sl: s.sl ?? 0,
        winRate: s.winRate ?? s.win_rate ?? 50,
        rsi: s.rsi ?? 50,
        composite_score: s.composite_score ?? 0.5,
        whale_score: s.whale_score ?? 50,
        sentiment: s.sentiment ?? "",
        source: s.source ?? "unknown",
      }));
      setSignals(liveSignals);
      setSignalCount(data?.count ?? liveSignals.length);
      setLastUpdate(new Date().toLocaleTimeString("id-ID"));
    } catch (err: any) {
      console.error("Fetch signals error:", err);
      setError("Gagal mengambil sinyal trading. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
    // Auto refresh setiap 5 menit
    const interval = setInterval(fetchSignals, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchSignals]);

  const filteredSignals = signals.filter(s => 
    s.ticker.toLowerCase().includes(search.toLowerCase())
  );

  const buyCount = signals.filter(s => s.type === "BUY").length;
  const sellCount = signals.filter(s => s.type === "SELL").length;
  const avgWinRate = signals.length > 0 
    ? Math.round(signals.reduce((sum, s) => sum + s.winRate, 0) / signals.length)
    : 0;

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
                 Protokol Eksekusi: {loading ? "Memuat..." : signals.length > 0 ? "Aktif" : "Standby"}
               </span>
            </div>
            <h1 className="text-8xl font-black tracking-tighter leading-[0.8]">
              Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] italic">Signals</span>
            </h1>
            <p className="text-zinc-500 font-bold text-2xl max-w-2xl leading-tight tracking-tight">
               Sinyal perdagangan real-time yang dihasilkan oleh mesin inferensi Neural untuk presisi maksimal.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full lg:w-[450px]">
            <div className="relative group">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 size-6 text-zinc-700 group-focus-within:text-primary transition-all duration-500" />
              <Input
                placeholder="Search ticker signals..."
                className="pl-20 bg-white/[0.02] border-white/5 h-20 w-full rounded-[2.5rem] focus:bg-white/[0.05] focus:ring-primary/20 transition-all backdrop-blur-3xl text-2xl font-black tracking-tighter placeholder:text-zinc-800 shadow-3xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchSignals}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all text-xs font-black text-zinc-400 uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              {loading ? "Memuat Sinyal..." : "Refresh Sinyal"}
            </button>
          </div>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-48 hover:bg-white/[0.04] transition-all group overflow-hidden">
              <Activity className="size-8 text-emerald-500 group-hover:scale-110 transition-transform" />
              <div>
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Status Aliran</span>
                 <h3 className="text-xl font-black text-white italic tracking-tighter">
                   {loading ? "Memuat..." : signals.length > 0 ? "Sangat Aktif" : "Standby"}
                 </h3>
              </div>
           </div>
           <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-48 hover:bg-white/[0.04] transition-all group overflow-hidden">
              <ShieldCheck className="size-8 text-blue-500 group-hover:scale-110 transition-transform" />
              <div>
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Sinyal Aktif</span>
                 <h3 className="text-xl font-black text-white italic tracking-tighter">
                   <span className="text-emerald-400">{buyCount} BUY</span> / <span className="text-rose-400">{sellCount} SELL</span>
                 </h3>
              </div>
           </div>
           <div className="md:col-span-2 p-8 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between group overflow-hidden">
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-white tracking-tighter leading-tight italic">Rata-rata Akurasi <br/>Sesi Ini</h3>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Berdasarkan {signalCount} Sinyal</p>
              </div>
              <span className="text-8xl font-black text-emerald-500 tracking-tighter drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                {avgWinRate > 0 ? `${avgWinRate}%` : "—"}
              </span>
           </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-8 rounded-[3rem] bg-rose-500/5 border border-rose-500/20 flex items-center gap-6">
            <WifiOff className="size-8 text-rose-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-black text-rose-400 tracking-tighter">{error}</h3>
              <p className="text-sm text-zinc-500 mt-1">Pastikan backend API berjalan di ap1.aiuiso.site</p>
            </div>
            <button 
              onClick={fetchSignals}
              className="px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black text-xs uppercase tracking-widest hover:bg-rose-500/20 transition-all"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="size-16 text-emerald-500 animate-spin" />
            <p className="text-zinc-500 font-bold text-lg tracking-tight">Menganalisis pasar dan menghasilkan sinyal...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredSignals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Activity className="size-16 text-zinc-700" />
            <p className="text-zinc-500 font-bold text-lg tracking-tight">
              {search ? `Tidak ada sinyal untuk "${search}"` : "Belum ada sinyal tersedia saat ini."}
            </p>
          </div>
        )}

        {/* Signals Grid */}
        {!loading && filteredSignals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredSignals.map((signal, idx) => (
               <div key={`${signal.ticker}-${idx}`} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                 <SignalCard 
                   ticker={signal.ticker}
                   type={signal.type === "HOLD" ? "BUY" : signal.type}
                   orderType={signal.orderType as any}
                   tp={signal.tp}
                   sl={signal.sl}
                   winRate={signal.winRate}
                   sentiment={signal.sentiment}
                 />
               </div>
            ))}
          </div>
        )}

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
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{lastUpdate || "—"}</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Status Feed</span>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    signals.length > 0 ? "text-emerald-500" : "text-zinc-500"
                  )}>
                    {signals.length > 0 ? "Sinkron" : "Offline"}
                  </span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
