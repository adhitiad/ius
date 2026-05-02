"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { WhaleData } from "./WhaleDetectorTable";
import { marketService } from "@/services/marketService";
import { 
  Activity, 
  Brain, 
  Send, 
  Zap, 
  TrendingUp, 
  Loader2,
  Waves as Whale,
  Target,
  ShieldCheck,
  BarChart2,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface StockDetailSheetProps {
  ticker: string | null;
  isOpen: boolean;
  onClose: () => void;
  initialData?: WhaleData;
}

export function StockDetailSheet({ ticker, isOpen, onClose, initialData }: StockDetailSheetProps) {
  const [loading, setLoading] = useState(false);
  const [technicalData, setTechnicalData] = useState<any>(null);
  const [marketSignal, setMarketSignal] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [currentLogs, setCurrentLogs] = useState<any[]>([]);
  const [intelligenceData, setIntelligenceData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticker && isOpen) {
      fetchStockIntelligence();
      setChatHistory([
        { role: 'assistant', content: `Koneksi Neural dengan **${ticker}** terbentuk. Sistem pengawasan institusional aktif. Menganalisis jejak akumulasi dan vektor probabilitas market. Ada yang bisa saya bantu terkait strategi eksekusi Anda?` }
      ]);
    }
  }, [ticker, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const fetchStockIntelligence = async () => {
    if (!ticker) return;
    try {
      setLoading(true);
      const [rsi, signal, intel] = await Promise.all([
        marketService.getTechnicalRSI(ticker),
        marketService.getMarketSignal(ticker),
        marketService.getMarketIntelligence(ticker)
      ]);
      setTechnicalData(rsi);
      setMarketSignal(signal);
      setIntelligenceData(intel);
    } catch (err) {
      console.error("Failed to fetch intelligence:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskBrain = async () => {
    if (!input.trim() || !ticker || isAsking) return;
    
    const userMessage = input;
    setInput("");
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAsking(true);

    try {
      setCurrentLogs([]);
      const response = await marketService.askBrain(ticker, userMessage);
      
      // Jika ada logs, kita bisa mensimulasikan pembacaan logs atau langsung tampilkan
      if (response.thinking_logs) {
        setCurrentLogs(response.thinking_logs);
      }

      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response.final_synthesis || response.recommendation || "Analisis selesai. Parameter market sudah terintegrasi." 
      }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Koneksi neural terputus. Mohon sinkronisasi ulang permintaan Anda." }]);
    } finally {
      setIsAsking(false);
      // Hapus logs setelah selesai untuk membersihkan UI
      setTimeout(() => setCurrentLogs([]), 2000);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl bg-zinc-950 border-white/5 p-0 flex flex-col selection:bg-primary/30 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
        
        {/* Intelligence Header */}
        <div className="relative pt-12 pb-10 px-10 overflow-hidden border-b border-white/5">
           {/* Ambient Background Glow */}
           <div className={cn(
             "absolute -top-24 -left-20 size-64 blur-[120px] rounded-full opacity-20 transition-colors duration-1000",
             (initialData?.change || 0) >= 0 ? "bg-emerald-500" : "bg-rose-500"
           )} />
           
           <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-md">
                       <Zap className={cn("size-6 shadow-sm", (initialData?.change || 0) >= 0 ? "text-emerald-400" : "text-rose-400")} />
                    </div>
                    <div>
                       <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] leading-none mb-1.5">Intelijen Aset</h3>
                       <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">Pengawasan Aktif</p>
                          {initialData?.isFallback && (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[6px] h-3 px-1 font-black leading-none ml-1">
                              YAHOO
                            </Badge>
                          )}
                       </div>
                    </div>
                 </div>
                 <div className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="size-3" /> Link: {new Date().toLocaleTimeString()}
                 </div>
              </div>

              <div className="flex items-end justify-between gap-4">
                 <div className="space-y-0 text-left">
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-9xl font-black text-white tracking-tighter uppercase leading-[0.75]">
                          {ticker || "---"}
                        </h2>
                    </div>
                    <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px] mt-6 ml-1 flex items-center gap-2">
                      <div className="h-px w-6 bg-zinc-800" /> {initialData?.name || "Komponen Intelijen Pasar"}
                    </p>
                 </div>
                 <div className="text-right">
                    <div className="text-6xl font-black text-white font-mono tracking-tighter tabular-nums leading-none mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                       {new Intl.NumberFormat("id-ID", { 
                         minimumFractionDigits: 0,
                         maximumFractionDigits: 0 
                       }).format(initialData?.price || 0)}
                       <span className="text-xl text-zinc-700 ml-2">IDR</span>
                    </div>
                    <div className={cn(
                       "text-[10px] font-black px-5 py-2 rounded-full inline-flex items-center gap-2 tracking-[0.2em] transition-all",
                       (initialData?.change || 0) >= 0 
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                        : "text-rose-400 bg-rose-500/10 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                    )}>
                       {(initialData?.change || 0) >= 0 ? <TrendingUp className="size-3" /> : <TrendingUp className="size-3 rotate-180" />}
                       {(initialData?.change || 0) >= 0 ? "NAIK" : "TURUN"} {(initialData?.change || 0).toFixed(2)}%
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Bento Intelligence Cluster */}
        <div className="p-8 grid grid-cols-3 gap-4">
            <div className="p-5 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Brain className="size-20" />
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-3">Prob. Neural</span>
              {loading ? <Skeleton className="h-10 w-full bg-white/5 rounded-xl" /> : (
                 <div className="space-y-3 relative z-10">
                    <div className="text-3xl font-black text-white italic leading-none tracking-tighter drop-shadow-lg">{(marketSignal?.lstm_probability * 100).toFixed(0)}%</div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-500 rounded-full animate-progress" style={{ width: `${marketSignal?.lstm_probability * 100}%` }} />
                    </div>
                 </div>
              )}
           </div>

           <div className="p-5 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarChart2 className="size-20" />
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-3">Skor Sosmed</span>
              {loading ? <Skeleton className="h-10 w-full bg-white/5 rounded-xl" /> : (
                 <div className="space-y-3 relative z-10">
                    <div className="text-3xl font-black text-blue-400 italic leading-none tracking-tighter drop-shadow-lg">{(marketSignal?.sentiment_score * 100).toFixed(0)}%</div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: `${marketSignal?.sentiment_score * 100}%` }} />
                    </div>
                 </div>
              )}
           </div>

           <div className="p-5 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="size-20" />
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-3">Kekuatan Relatif</span>
              {loading ? <Skeleton className="h-10 w-full bg-white/5 rounded-xl" /> : (
                 <div className="space-y-3 relative z-10">
                    <div className={cn(
                       "text-3xl font-black italic leading-none tracking-tighter drop-shadow-lg",
                       (technicalData?.rsi || 0) > 70 ? "text-rose-400" : (technicalData?.rsi || 0) < 30 ? "text-emerald-400" : "text-white"
                    )}>
                       {technicalData?.rsi?.toFixed(1) || "---"}
                    </div>
                    <div className="flex gap-1.5">
                       {[...Array(6)].map((_, i) => (
                          <div key={i} className={cn("h-2 flex-1 rounded-full px-1", i < (technicalData?.rsi / 16.6) ? "bg-white/30" : "bg-white/5")} />
                       ))}
                    </div>
                 </div>
              )}
           </div>
        </div>

         {/* Voted Decision & Scenario Simulations */}
         <div className="px-8 pb-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
               {/* Voted Decision Card */}
               <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <ShieldCheck className="size-16" />
                  </div>
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-3">Voted Decision</span>
                  <div className={cn(
                    "text-xl font-black italic tracking-tight",
                    intelligenceData?.voted_decision === "ACCUMULATION" ? "text-emerald-400" : intelligenceData?.voted_decision === "DISTRIBUTION" ? "text-rose-400" : "text-zinc-400"
                  )}>
                    {intelligenceData?.voted_decision || "MENUNGGU SINKRONISASI..."}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 font-medium">Konsensus Neural Berdasarkan Aliran Dana.</p>
               </div>

               {/* Intelligence Context */}
               <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Brain className="size-16" />
                  </div>
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-3">Anomali Terdeteksi</span>
                  <div className="text-xl font-black text-white italic tracking-tight">
                    {intelligenceData?.anomalies?.length || 0} Vektor
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 font-medium">Ketidakwajaran Volume & Harga.</p>
               </div>
            </div>

            {/* Scenario Simulation Cluster */}
            <div className="p-8 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 relative group overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Target className="size-32 rotate-12" />
               </div>
               
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Activity className="size-5 text-primary" />
                     </div>
                     <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Neural Scenario Simulation</h3>
                  </div>

                  <div className="space-y-3">
                    {intelligenceData?.scenarios?.map((s: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group/item hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "size-8 rounded-lg flex items-center justify-center text-[10px] font-black",
                            s.type === 'BULLISH' ? "bg-emerald-500/10 text-emerald-400" : s.type === 'BEARISH' ? "bg-rose-500/10 text-rose-400" : "bg-zinc-500/10 text-zinc-400"
                          )}>
                            {s.type[0]}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-black text-white tracking-widest uppercase">{s.type}</p>
                            <p className="text-[10px] text-zinc-500 leading-tight">{s.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-white font-mono tracking-tighter">
                            {new Intl.NumberFormat("id-ID").format(Math.round(s.target))}
                          </p>
                          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Target Proyeksi</p>
                        </div>
                      </div>
                    ))}
                    {!intelligenceData?.scenarios && (
                      <div className="py-6 text-center border border-dashed border-white/10 rounded-3xl">
                        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Simulator Offline</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-black/40 border border-white/5 relative group overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <ShieldCheck className="size-4 text-emerald-400" />
                     </div>
                     <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Neural Recommendation</h3>
                  </div>
                  <p className="text-[13px] text-zinc-400 leading-relaxed font-medium italic">
                     {marketSignal?.recommendation || "Mengolah dataset neurals untuk menentukan titik eksekusi optimal secara real-time..."}
                  </p>
               </div>
            </div>
         </div>

        {/* Neural Reasoning Interface */}
        <div className="flex-1 flex flex-col min-h-0 bg-black/40 backdrop-blur-xl border-t border-white/5">
           <div className="px-10 py-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
                    <Brain className="size-5 text-primary relative z-10" />
                 </div>
                 <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Neural Core Link</h3>
              </div>
              <div className="flex items-center gap-1">
                 <div className="size-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                 <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Active reasoning</span>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide" ref={scrollRef}>
              {chatHistory.map((msg, i) => (
                 <div key={i} className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn(
                       "max-w-[85%] px-7 py-5 rounded-[2.5rem] text-[13px] leading-relaxed transition-all duration-300",
                       msg.role === 'user' 
                        ? "bg-primary text-black font-black rounded-tr-none shadow-[0_15px_40px_rgba(var(--primary-rgb),0.15)]" 
                        : "bg-zinc-900/80 border border-white/10 text-zinc-300 rounded-tl-none backdrop-blur-md"
                    )}>
                       {msg.content}
                    </div>
                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] px-4">
                       {msg.role === 'user' ? "Sumber: Origin" : "Respon Neural IUS"}
                    </span>
                 </div>
              ))}
               {isAsking && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 animate-pulse">
                        <div className="flex gap-1">
                          <span className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="size-1.5 bg-primary rounded-full animate-bounce" />
                        </div>
                        Mensintesis Logika Market...
                    </div>
                    
                    {/* Neural Thinking Visualizer */}
                    <div className="px-4 space-y-3">
                      {currentLogs.length > 0 ? currentLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                          <div className="size-1.5 rounded-full bg-primary/40 mt-1.5" />
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{log.type === 'thought' ? 'Analisis Internal' : 'Akses Sensorik'}</p>
                            <p className="text-[11px] text-zinc-400 italic line-clamp-1">{log.content}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="h-20 flex items-center justify-center border border-white/5 bg-white/[0.02] rounded-3xl border-dashed">
                           <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Menunggu Feedback Neural...</p>
                        </div>
                      )}
                    </div>
                  </div>
               )}
            </div>

           {/* Command Control Area */}
           <div className="p-10 pt-4">
              <div className="relative group">
                 <div className="absolute inset-0 bg-primary/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                 <input 
                    disabled={isAsking || !ticker}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskBrain()}
                    placeholder="Input kueri eksekusi stratejik..."
                    className="relative w-full bg-zinc-900/50 border border-white/10 rounded-[2.5rem] px-10 py-7 pr-24 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-primary/40 focus:ring-[12px] focus:ring-primary/5 transition-all backdrop-blur-md"
                 />
                 <button 
                    onClick={handleAskBrain}
                    disabled={isAsking || !input.trim()}
                    className="absolute right-5 top-1/2 -translate-y-1/2 size-14 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 group/btn"
                 >
                    <Send className="size-6 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                 </button>
              </div>
              <div className="mt-6 flex items-center gap-6 opacity-20 group">
                 <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white" />
                 <span className="text-[9px] font-black text-white uppercase tracking-[0.6em] transition-all group-hover:tracking-[0.8em]">End-to-End Encryption</span>
                 <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white" />
              </div>
           </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
