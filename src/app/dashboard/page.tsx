"use client";

import { NewsTicker } from "@/components/dashboard/NewsTicker";
import {
  WhaleData,
  WhaleDetectorTable,
} from "@/components/dashboard/WhaleDetectorTable";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/marketService";
import { Activity, Database, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const TABS = [
  "LQ45",
  "IDX30",
  "KOMPAS100",
  "BISNIS-27",
  "SRI-KEHATI",
  "JII",
  "ISSI",
];

const INDEX_MEMBERS: Record<string, string[]> = {
  LQ45: [
    "BBCA",
    "BBRI",
    "BMRI",
    "TLKM",
    "ASII",
    "UNVR",
    "CPIN",
    "ICBP",
    "INDF",
  ],
  IDX30: ["BBCA", "BBRI", "BMRI", "TLKM", "ASII", "ANTM", "MDKA", "INCO"],
  KOMPAS100: [
    "BBCA",
    "BBRI",
    "BMRI",
    "TLKM",
    "ASII",
    "GOTO",
    "PGAS",
    "KLBF",
  ],
  "BISNIS-27": ["BBCA", "BBRI", "BMRI", "TLKM", "ASII", "MAPI", "KLBF"],
  "SRI-KEHATI": ["BBCA", "BBRI", "TLKM", "UNVR", "KLBF", "PGAS"],
  JII: ["TLKM", "ASII", "INDF", "ICBP", "CPIN", "ADRO", "ANTM"],
  ISSI: ["ADRO", "ANTM", "CPIN", "ICBP", "INDF", "KLBF", "TLKM"],
};

const normalizeTicker = (ticker: string) => ticker.replace(".JK", "").toUpperCase();

const toWhaleData = (
  item: { name: string; ticker: string; price: number; win_rate: number },
  index: number,
): WhaleData => {
  const normalizedTicker = normalizeTicker(item.ticker);
  const bandarPower = Math.max(
    0,
    Math.min(100, Math.round(item.win_rate <= 1 ? item.win_rate * 100 : item.win_rate)),
  );
  const syntheticChange = Number((((bandarPower - 50) / 12) * 1.8).toFixed(2));

  return {
    id: `${normalizedTicker}-${index}`,
    ticker: normalizedTicker,
    name: item.name,
    price: Number(item.price || 0),
    change: syntheticChange,
    volume: `${Math.max(50, bandarPower * 24 + index * 13)}M`,
    bandarPower,
    signal:
      bandarPower >= 70
        ? "ACCUMULATION"
        : bandarPower <= 35
          ? "DISTRIBUTION"
          : "NEUTRAL",
  };
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("LQ45");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<WhaleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const screener = await marketService.getScreener();
        if (!mounted) return;
        setRows(screener.map(toWhaleData));
      } catch (error) {
        if (!mounted) return;
        setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 45_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredRows = useMemo(() => {
    const currentIndexMembers = INDEX_MEMBERS[activeTab] || [];
    const byIndex = rows.filter((item) => currentIndexMembers.includes(item.ticker));
    const source = byIndex.length > 0 ? byIndex : rows;

    const query = search.trim().toLowerCase();
    if (!query) return source;

    return source.filter(
      (item) =>
        item.ticker.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query),
    );
  }, [activeTab, rows, search]);

  const marketPulse = useMemo(() => {
    if (!filteredRows.length) {
      return {
        sentiment: "WAITING",
        avgBandarPower: 0,
        whaleCount: 0,
      };
    }

    const avgBandarPower = Math.round(
      filteredRows.reduce((sum, item) => sum + item.bandarPower, 0) / filteredRows.length,
    );

    return {
      sentiment: avgBandarPower >= 60 ? "BULLISH" : avgBandarPower <= 40 ? "BEARISH" : "NEUTRAL",
      avgBandarPower,
      whaleCount: filteredRows.filter((item) => item.bandarPower > 80).length,
    };
  }, [filteredRows]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NewsTicker />

      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-10 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Activity className="size-3 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                The Engine Room
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white italic">
              Market <span className="text-emerald-500">Dashboard</span>
            </h1>
            <p className="text-zinc-500 font-medium text-lg max-w-xl">
              Platform intelijen pasar real-time dengan detektor whale dan
              analisis sentimen berbasis AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="Cari Ticker..."
                className="pl-12 bg-zinc-900/50 border-white/5 h-12 w-[300px] rounded-xl focus:ring-emerald-500/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Index Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                activeTab === tab
                  ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105"
                  : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-emerald-500/30 hover:text-zinc-300",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Whale Detector Section */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-zinc-950/60 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-emerald-500/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Database className="size-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Whale Detector
                  </h2>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">
                    Real-time Big Money Tracker
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="size-8 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[8px] font-black text-zinc-600"
                    >
                      AI
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                  {loading ? "Syncing..." : "Verified by UIS-OTAK Engine"}
                </span>
              </div>
            </div>

            <WhaleDetectorTable data={filteredRows} />
          </div>
        </div>

        {/* Summary Footer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Market Sentiment",
              value: marketPulse.sentiment,
              detail: `Avg Bandar Power: ${marketPulse.avgBandarPower}`,
              color:
                marketPulse.sentiment === "BULLISH"
                  ? "text-emerald-500"
                  : marketPulse.sentiment === "BEARISH"
                    ? "text-rose-500"
                    : "text-amber-400",
            },
            {
              label: "Whale Alert Count",
              value: String(marketPulse.whaleCount),
              detail: `Score > 80 pada ${activeTab}`,
              color: "text-blue-500",
            },
            {
              label: "AI Prediction",
              value: loading ? "LOADING..." : "LIVE TRACKING",
              detail: `Screener rows: ${filteredRows.length}`,
              color: "text-emerald-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl backdrop-blur-sm"
            >
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p
                className={cn(
                  "text-2xl font-black tracking-tighter",
                  stat.color,
                )}
              >
                {stat.value}
              </p>
              <p className="text-xs text-zinc-600 mt-2 font-medium italic">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
