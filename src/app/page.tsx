"use client";

import React, { useMemo, useState, useEffect } from "react";
import { 
  ArrowRight,
  Target,
  Zap,
  Globe,
  ShieldCheck,
  Bot,
  Layers,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import NewsTicker from "@/components/NewsTicker";
import { WhaleDetectorTable, WhaleData } from "@/components/dashboard/WhaleDetectorTable";
import { useMarketData } from "@/hooks/useMarketData";
import { Badge } from "@/components/ui/badge";
import { BackgroundParticles } from "@/components/BackgroundParticles";

export default function Home() {
  const { data, loading } = useMarketData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mapping StockData to WhaleData format
  const mappedStocks: WhaleData[] = useMemo(() => {
    if (!data?.stocks) return [];
    return data.stocks.slice(0, 8).map((s, i) => ({
      id: `${s.ticker}-${i}`,
      ticker: s.ticker,
      name: s.ticker,
      price: s.price,
      change: s.change,
      volume: `${((s.spike_ratio || 0) * 100).toFixed(0)}%`,
      bandarPower: s.bandar_score,
      signal: s.signal?.includes("ACC") ? "ACCUMULATION" : 
              s.signal?.includes("DIST") ? "DISTRIBUTION" : "NEUTRAL",
      source: s.source,
      isFallback: s.is_fallback
    }));
  }, [data?.stocks]);

  return (
    <div className="relative min-h-screen bg-[#020203] text-zinc-400 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      
      {/* ATMOSPHERIC BACKGROUND LAYERS */}
      <BackgroundParticles />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-[0.03] pointer-events-none z-[1]" />
      <div className="fixed inset-0 bg-[#020203] [mask-image:radial-gradient(circle_at_50%_-20%,transparent_0%,#020203_100%)] pointer-events-none z-[2]" />

      {/* 1. FLOATING NAVIGATION BAR */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4",
        scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="size-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-black shadow-[0_0_20px_#10b98140] group-hover:rotate-12 transition-transform duration-500">
               <Bot className="size-6" />
            </div>
            <span className="text-xl font-black tracking-[-0.05em] text-white uppercase italic">
              IUS.<span className="text-emerald-500">BRAIN</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {["Market", "Intelligence", "API Docs", "Pricing"].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-emerald-400 transition-colors">
                {item}
              </a>
            ))}
            <button 
              onClick={() => window.location.href='/dashboard'}
              className="px-8 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Control Center
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="size-8" /> : <Menu className="size-8" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-[90] bg-black/95 backdrop-blur-2xl transition-all duration-700 flex flex-col items-center justify-center gap-10 md:hidden",
        mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
         {["Market", "Intelligence", "API Docs", "Pricing"].map(item => (
            <a key={item} href="#" className="text-3xl font-black uppercase tracking-widest text-zinc-600 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              {item}
            </a>
         ))}
         <button 
          onClick={() => window.location.href='/dashboard'}
          className="mt-10 px-12 py-5 rounded-2xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest"
         >
           Akses Dashboard
         </button>
      </div>

      {/* 2. SUPERIOR HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 overflow-hidden flex flex-col items-center justify-center min-h-[95vh]">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150vh] bg-[radial-gradient(circle_at_50%_0%,#10b98108,transparent_50%)] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        
        <div className="relative z-10 max-w-7xl w-full text-center space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-2xl">
               <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80">Neural Grid Live v5.4</span>
            </div>

            <h1 className="text-6xl md:text-[10rem] lg:text-[12rem] font-black tracking-[-0.07em] leading-[0.8] text-white uppercase italic">
              Limitless<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-blue-500 drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]">Power</span>
            </h1>

            <p className="max-w-xl mx-auto text-zinc-500 text-sm md:text-lg font-bold tracking-tight leading-relaxed uppercase">
              Ekosistem intelijen kuantitatif otonom yang mengawasi aliran modal institusi di Bursa Efek Indonesia secara real-time.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
               <button 
                onClick={() => window.location.href='/dashboard'}
                className="group w-full md:w-auto px-12 py-7 rounded-[2rem] bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-[0_15px_60px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center gap-4"
               >
                 Jalankan Kognisi
                 <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
               </button>
               <button className="w-full md:w-auto px-12 py-7 rounded-[2rem] bg-white/[0.02] border border-white/5 font-black text-zinc-400 text-xs uppercase tracking-[0.3em] hover:bg-white/[0.05] hover:text-white transition-all backdrop-blur-sm">
                  Laporan Eksklusif
               </button>
            </div>
        </div>

        {/* Live Market Bar */}
        <div className="mt-auto w-full max-w-7xl pt-20">
           <NewsTicker />
        </div>
      </section>

      {/* 3. NEURAL CAPABILITIES (BENTO GRID) */}
      <section className="py-40 px-6 lg:px-12 max-w-7xl mx-auto space-y-24">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-10">
           <div>
              <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                Neural <span className="text-emerald-500">Edge</span>
              </h2>
              <p className="text-[10px] font-black text-zinc-700 tracking-[0.5em] uppercase mt-4">Infrastruktur Intelijen Generasi Berikutnya</p>
           </div>
           <div className="flex items-center gap-4 text-zinc-500 text-xs font-black uppercase tracking-widest bg-white/[0.02] px-6 py-3 rounded-2xl border border-white/5">
              <Globe className="size-4 text-emerald-500" />
              Sinergi Global Aktif
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           {/* Primary Feature */}
           <div className="md:col-span-8 group relative p-12 rounded-[3.5rem] bg-gradient-to-br from-zinc-900/40 to-transparent border border-white/5 hover:border-emerald-500/20 transition-all overflow-hidden h-[500px] flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <Layers className="size-80" />
              </div>
              <div className="relative z-10 space-y-4">
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1.5 text-[8px] uppercase tracking-widest font-black">Autonomous Engine | Latency: 1.0ms</Badge>
                 <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Smart Screener<br />Vektor Hybrid</h3>
                 <p className="max-w-md text-zinc-600 font-bold text-lg uppercase leading-tight">Menggabungkan logika Bandarologi dengan pola Fractal Price Action secara bersamaan.</p>
              </div>
           </div>

           {/* Side Features */}
           <div className="md:col-span-4 space-y-8 flex flex-col">
              <div className="flex-1 p-10 rounded-[3rem] bg-zinc-950/50 border border-white/5 hover:bg-white/[0.02] transition-all group flex flex-col justify-between">
                 <div className="size-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                    <Target className="size-8" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Sniper Entry</h4>
                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Akurasi sinyal hingga 89.4% berdasarkan data historis 10 tahun.</p>
                 </div>
              </div>
              <div className="flex-1 p-10 rounded-[3rem] bg-zinc-950/50 border border-white/5 hover:bg-white/[0.02] transition-all group flex flex-col justify-between">
                 <div className="size-16 rounded-[1.5rem] bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                    <Zap className="size-8" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Rapid Response</h4>
                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Notifikasi instan via Telegram Command Center tepat saat 'Whale' masuk.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. LIVE MARKET MONITOR */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto space-y-16">
         <div className="p-10 md:p-16 rounded-[4rem] bg-white/[0.02] border border-white/5 relative overflow-hidden backdrop-blur-3xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#10b98108,transparent_50%)] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16 relative z-10">
               <div className="text-center md:text-left space-y-3">
                  <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                    Whale <span className="text-emerald-500">Flux</span>
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                     <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                     <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Surveilans Pasar Aktif: BEI (ID)</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">Semua Sektor</button>
                  <button className="px-6 py-3 rounded-xl bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest">Real-time Only</button>
               </div>
            </div>

            <div className="relative z-10 rounded-[2.5rem] border border-white/5 bg-black/40 overflow-hidden shadow-2xl">
               <WhaleDetectorTable data={mappedStocks} loading={loading} />
            </div>

            <div className="mt-12 flex justify-center relative z-10">
               <button 
                onClick={() => window.location.href='/dashboard'}
                className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.5em] text-zinc-600 hover:text-emerald-500 transition-all"
               >
                 Tampilkan Semua Spektrum Neural
                 <ChevronRight className="size-5 group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
         </div>
      </section>

      {/* 5. ELITE FOOTER */}
      <footer className="pt-40 pb-20 px-6 lg:px-12 border-t border-white/5 bg-black/40">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-20">
            <div className="md:col-span-5 space-y-10">
               <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black">
                     <Bot className="size-5" />
                  </div>
                  <span className="text-2xl font-black tracking-[-0.05em] text-white uppercase italic">IUS.<span className="text-emerald-500">BRAIN</span></span>
               </div>
               <p className="text-zinc-600 font-bold text-lg uppercase leading-tight tracking-tight max-w-sm">
                 Memberikan keunggulan asimetris bagi pelaku pasar modal melalui kekuatan komputasi neural otonom.
               </p>
               <div className="flex items-center gap-8 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                  <ShieldCheck className="size-10 text-white" />
                  <Globe className="size-10 text-white" />
                  <Layers className="size-10 text-white" />
               </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
               {[
                 { title: "Sistem", links: ["Market", "Signals", "Alpha", "Scanner"] },
                 { title: "Legalitas", links: ["Privacy", "Terms", "Licensing", "Risk"] },
                 { title: "Koneksi", links: ["API Docs", "Terminal", "Telegram", "Status"] }
               ].map(col => (
                 <div key={col.title} className="space-y-6">
                    <h5 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">{col.title}</h5>
                    <ul className="space-y-4">
                       {col.links.map(link => (
                         <li key={link}>
                           <a href="#" className="text-[10px] font-black text-zinc-700 hover:text-emerald-500 transition-colors uppercase tracking-[0.2em]">{link}</a>
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </div>
         </div>

         <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[1em]">© 2026 IUS_NEURAL_CONSTRUCT</span>
            <div className="flex items-center gap-6">
               <div className="size-2 rounded-full bg-emerald-500" />
               <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mt-1">Global Core Online: Jakarta, SG, HK</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
