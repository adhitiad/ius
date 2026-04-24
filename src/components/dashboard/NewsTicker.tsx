"use client";

import React, { useEffect, useState } from "react";
import { marketService } from "@/services/marketService";
import { Radio } from "lucide-react";

/**
 * NewsTicker Component
 * Fetches latest news from /api/v1/market/news-ticker and displays as a scrolling bar.
 */
export function NewsTicker() {
  const [news, setNews] = useState<string[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await marketService.getNewsTicker();
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news ticker", error);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (news.length === 0) return null;

  return (
    <div className="w-full bg-zinc-950/80 border-y border-white/5 backdrop-blur-md h-10 flex items-center overflow-hidden">
      <div className="flex items-center px-4 bg-zinc-900 h-full border-r border-white/5 z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
        <Radio className="size-3.5 text-emerald-500 mr-2 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 whitespace-nowrap">
          Live Analysis
        </span>
      </div>
      
      <div className="flex-1 overflow-hidden pointer-events-none relative">
        <div className="flex whitespace-nowrap animate-marquee">
          {news.map((item, idx) => (
            <span key={idx} className="mx-10 text-xs font-medium text-zinc-300">
              <span className="text-emerald-500 mr-2">◆</span>
              {item}
            </span>
          ))}
          {/* Duplicate for seamless scrolling */}
          {news.map((item, idx) => (
            <span key={`dup-${idx}`} className="mx-10 text-xs font-medium text-zinc-300">
              <span className="text-emerald-500 mr-2">◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
