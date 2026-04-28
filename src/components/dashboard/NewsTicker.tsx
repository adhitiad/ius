"use client";

import React, { useEffect, useState } from "react";
import { marketService } from "@/services/marketService";
import { Radio, ChevronRight } from "lucide-react";

/**
 * NewsTicker Component
 * Fetches latest news from /api/v1/market/news-ticker and displays as a scrolling bar.
 * Upgraded with premium Neural aesthetics.
 */
export function NewsTicker() {
  const [news, setNews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await marketService.getNewsTicker();
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news ticker", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (news.length === 0 && !loading) return null;

  return (
    <div className="w-full bg-zinc-950/60 border-y border-white/5 backdrop-blur-2xl h-12 flex items-center overflow-hidden group relative z-50">
      {/* Label Statis dengan Branding Neural */}
      <div className="flex items-center px-8 bg-zinc-950 h-full border-r border-white/10 z-30 shadow-[15px_0_30px_rgba(0,0,0,0.8)] relative">
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent" />
        <div className="relative">
           <Radio className="size-4 text-emerald-500 mr-3 animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white whitespace-nowrap italic">
          Neural <span className="text-emerald-500">Live</span>
        </span>
      </div>
      
      {/* Container Marquee dengan Mask Gradient untuk Transisi Halus */}
      <div className="flex-1 overflow-hidden relative h-full">
        {/* Mask Overlay agar teks memudar di pinggir */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-950/80 to-transparent z-20 pointer-events-none" />

        <div className="flex items-center h-full whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] cursor-pointer">
          {news.map((item, idx) => (
            <div key={idx} className="flex items-center mx-8">
               <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group/item">
                  <span className="flex items-center justify-center size-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-black transition-all">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-bold text-zinc-400 group-hover/item:text-white transition-colors tracking-tight">
                    {item}
                  </span>
                  <ChevronRight className="size-3 text-zinc-700 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
               </div>
            </div>
          ))}
          {/* Duplikasi data untuk siklus perputaran yang sempurna (seamless) */}
          {news.map((item, idx) => (
            <div key={`dup-${idx}`} className="flex items-center mx-8">
               <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group/item">
                  <span className="flex items-center justify-center size-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-black transition-all">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-bold text-zinc-400 group-hover/item:text-white transition-colors tracking-tight">
                    {item}
                  </span>
                  <ChevronRight className="size-3 text-zinc-700 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indikator Status Sistem di Sisi Kanan */}
      <div className="hidden lg:flex items-center px-8 bg-zinc-950/40 h-full border-l border-white/5 z-30">
         <div className="flex flex-col items-end">
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Intelligence Unit</span>
            <span className="text-[10px] font-black text-emerald-500/80 uppercase font-mono tracking-tighter">SURVEILLANCE_ON</span>
         </div>
      </div>
    </div>
  );
}
