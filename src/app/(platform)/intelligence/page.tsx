"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Brain as BrainIcon, Sparkles as SparklesIcon, Activity as ActivityIcon, ShieldCheck as ShieldCheckIcon, Zap as ZapIcon, Bot as BotIcon, Network as NetworkIcon, Cpu as CpuIcon, Database as DatabaseIcon, RefreshCw as RefreshCwIcon, AlertCircle as AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { RadarResponse } from "@/types/api.d";

export default function IntelligencePage() {
  const [pulseScale, setPulseScale] = useState(1);
  const [activeNodes, setActiveNodes] = useState(124);
  const [radarData, setRadarData] = useState<RadarResponse | null>(null);
  const [pulseData, setPulseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { token } = useAuthStore();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchData = useCallback(async (showLoading = true) => {
    if (!token) return;
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const [radarRes, pulseRes] = await Promise.all([
        fetch(`${apiUrl}/api/v1/market/radar`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/v1/market/pulse`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!radarRes.ok || !pulseRes.ok) throw new Error("Gagal mengambil data intelijen");

      const radar = await radarRes.json();
      const pulse = await pulseRes.json();

      setRadarData(radar);
      setPulseData(pulse);
    } catch (err: any) {
      console.error("Intelligence Fetch Error:", err);
      setError(err.message || "Terjadi kesalahan koneksi ke Neural Engine");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setPulseScale(s => s === 1 ? 1.03 : 1);
      setActiveNodes(n => n + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);
    
    const refreshInterval = setInterval(() => fetchData(false), 30000); // Auto refresh data every 30s

    return () => {
      clearInterval(interval);
      clearInterval(refreshInterval);
    };
  }, [fetchData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchData(false);
  };

  // Status mapping
  const getSentimentLabel = (score: number) => {
    if (score > 0.5) return { label: "BULLISH", color: "text-emerald-400", sub: `${(score * 100).toFixed(0)}% Positif` };
    if (score < -0.5) return { label: "BEARISH", color: "text-rose-400", sub: `${(Math.abs(score) * 100).toFixed(0)}% Negatif` };
    return { label: "NEUTRAL", color: "text-zinc-400", sub: "Kondisi Stabil" };
  };

  const sentiment = getSentimentLabel(radarData?.telegram_score || 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden">
      {/* Brain Atmosphere */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-primary/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
        
        {/* Unit Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl">
               <BotIcon className="size-3 text-primary animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                 Sistem Introspeksi Otonom
               </span>
            </div>
            <h1 className="text-8xl font-black tracking-tighter leading-[0.8]">
              Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-emerald-600 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] italic">Engine</span>
            </h1>
            <p className="text-zinc-500 font-bold text-2xl max-w-2xl leading-tight tracking-tight">
               {radarData?.daily_summary || "Memantau aktivitas kognitif di balik setiap keputusan sinyal dan deteksi whale."}
            </p>
          </div>

          <div className="flex gap-8 bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] backdrop-blur-3xl relative">
             <button 
               onClick={handleManualRefresh}
               disabled={isRefreshing}
               className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-zinc-600 hover:text-white transition-all"
             >
                <RefreshCwIcon className={cn("size-4", isRefreshing && "animate-spin")} />
             </button>
             <div className="text-center space-y-2">
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Node Aktif</span>
                <p className="text-4xl font-black italic tracking-tighter transition-all duration-1000">{activeNodes}</p>
             </div>
             <div className="w-px h-12 bg-white/5" />
             <div className="text-center space-y-2">
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Inference</span>
                <p className="text-4xl font-black italic tracking-tighter text-emerald-500">{pulseData?.brain_latency || "0.85ms"}</p>
             </div>
          </div>
        </div>

        {error && (
          <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 text-rose-500 animate-in fade-in zoom-in">
             <AlertCircleIcon className="size-6 shrink-0" />
             <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Neural Activity Bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           {/* Central Brain Logic */}
           <div className="md:col-span-8 p-12 rounded-[4rem] bg-white/[0.01] border border-white/5 relative overflow-hidden group">
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 transition-transform duration-[2s]"
                style={{ transform: `translate(-50%, -50%) scale(${pulseScale})` }}
              >
                 <BrainIcon className="size-[500px] text-primary" />
              </div>
              
              <div className="relative z-10 space-y-12">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                       <NetworkIcon className="size-6" />
                    </div>
                    <h2 className="text-3xl font-black italic tracking-tighter">Sinkronisasi Matriks (IDX)</h2>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {(radarData?.market_indices || []).slice(0, 3).map((idx, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 hover:bg-white/[0.04] transition-all">
                         <div className="flex justify-between items-center">
                            <DatabaseIcon className="size-5 text-zinc-600" />
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                              idx.Percent.includes("-") ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                            )}>
                               {idx.Percent}
                            </span>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{idx.IndexCode === "COMPOSITE" ? "IHSG" : idx.IndexCode}</p>
                            <p className="text-3xl font-black text-white italic tracking-tighter">{idx.Current}</p>
                         </div>
                      </div>
                    ))}
                    {(!radarData?.market_indices || radarData.market_indices.length === 0) && (
                      <div className="sm:col-span-3 flex items-center justify-center h-32 text-zinc-700 font-bold uppercase tracking-widest text-xs border border-dashed border-white/5 rounded-3xl">
                        Menunggu Data IDX...
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Live Feed */}
           <div className="md:col-span-4 p-10 rounded-[4rem] bg-zinc-900/40 border border-white/5 space-y-8 flex flex-col justify-between">
              <div className="space-y-6">
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.4em] flex items-center gap-2">
                    <ActivityIcon className="size-4 text-emerald-500" />
                    Real-time Thinking
                 </h3>
                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {loading ? (
                      [1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-4 bg-white/5 animate-pulse rounded-md w-full" />
                      ))
                    ) : (radarData?.rss_news || []).length > 0 ? (
                      radarData?.rss_news.slice(0, 10).map((news, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                           <div className="size-1 rounded-full bg-zinc-800 mt-2 group-hover:bg-primary transition-all" />
                           <p className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-tight line-clamp-2">
                              {news.title}
                           </p>
                        </div>
                      ))
                    ) : (
                      [
                        "Menganalisis akumulasi BBCA...",
                        "Mendeteksi anomali volume di GOTO...",
                        "Mengkalkulasi ulang resiko TLKM...",
                        "Memverifikasi sinyal RSI di ASII...",
                        "Menyinkronkan data whale domestik..."
                      ].map((log, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                           <div className="size-1 rounded-full bg-zinc-800 mt-2 group-hover:bg-primary transition-all" />
                           <p className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-tight">
                              {log}
                           </p>
                        </div>
                      ))
                    )}
                 </div>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 text-center">
                 <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-2">Sistem AI</p>
                 <p className="text-lg font-black text-white italic tracking-tighter font-mono tracking-widest uppercase">
                   {pulseData?.active_models?.[0] || "IUS_OTAK_CORE"}
                 </p>
              </div>
           </div>
        </div>

        {/* Neural Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: "Sentimen Telegram", value: sentiment.label, sub: sentiment.sub, color: sentiment.color },
             { label: "Kekuatan Whale", value: "MASIF", sub: "Area Akumulasi", color: "text-blue-400" },
             { label: "System Status", value: pulseData?.status?.toUpperCase() || "ACTIVE", sub: "Kondisi Stabil", color: "text-emerald-500" },
             { label: "Last Update", value: radarData?.last_update ? new Date(radarData.last_update).toLocaleTimeString() : "READY", sub: "Terverifikasi", color: "text-primary" }
           ].map((m, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                 <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-4">{m.label}</p>
                 <p className={cn("text-5xl font-black italic tracking-tighter mb-1", m.color)}>{m.value}</p>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{m.sub}</p>
              </div>
           ))}
        </section>

      </main>

      <footer className="py-20 px-12 border-t border-white/5 bg-black/60 mt-32 backdrop-blur-3xl">
         <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <span className="font-black tracking-tighter text-3xl text-white">IUS.<span className="text-primary italic font-black uppercase tracking-widest text-lg">Brain</span></span>
            <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[1em]">Intelligence Surveillance Systems</p>
         </div>
      </footer>
    </div>
  );
}
