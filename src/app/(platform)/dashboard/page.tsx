"use client";

import { AgentTerminal } from "@/components/dashboard/AgentTerminal";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { MarketGauge } from "@/components/dashboard/MarketGauge";
import { MarketInsightsSection } from "@/components/dashboard/MarketInsights";
import { MarketRadar } from "@/components/dashboard/MarketRadar";
import { NeuralPulse } from "@/components/dashboard/NeuralPulse";
import { NewsTicker } from "@/components/dashboard/NewsTicker";
import {
  WhaleData,
  WhaleDetectorTable,
} from "@/components/dashboard/WhaleDetectorTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMarketData } from "@/hooks/useMarketData";
import { cn } from "@/lib/utils";
import { Cpu, Database, Globe, MessageSquare, Search } from "lucide-react";
import { useMemo, useState } from "react";

const TABS = [
  "BLUECHIPS",
  "MEDIUM",
  "GORENGAN",
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
  KOMPAS100: ["BBCA", "BBRI", "BMRI", "TLKM", "ASII", "GOTO", "PGAS", "KLBF"],
  "BISNIS-27": ["BBCA", "BBRI", "BMRI", "TLKM", "ASII", "MAPI", "KLBF"],
  "SRI-KEHATI": ["BBCA", "BBRI", "TLKM", "UNVR", "KLBF", "PGAS"],
  JII: ["TLKM", "ASII", "INDF", "ICBP", "CPIN", "ADRO", "ANTM"],
  ISSI: ["ADRO", "ANTM", "CPIN", "ICBP", "INDF", "KLBF", "TLKM"],
};

const normalizeTicker = (ticker: string) =>
  ticker.replace(".JK", "").toUpperCase();

const toWhaleData = (item: any, index: number): WhaleData => {
  const normalizedTicker = normalizeTicker(item.ticker);
  const bandarPower = Math.round(
    item.whale_accumulation_score || item.bandar_score || 50,
  );
  const signal =
    item.bandar_activity?.toUpperCase() ||
    item.bandar_label?.toUpperCase() ||
    "NETRAL";

  return {
    id: `${normalizedTicker}-${index}`,
    ticker: normalizedTicker,
    name: normalizedTicker,
    price: Number(item.price || 0),
    change: Number(item.change || 0),
    volume: `${(item.spike_ratio || 0).toFixed(1)}x`,
    bandarPower,
    signal: signal as any,
  };
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("BLUECHIPS");

  const tierMap: Record<string, number> = {
    BLUECHIPS: 1,
    MEDIUM: 2,
    GORENGAN: 3,
  };

  const currentTier = tierMap[activeTab];
  const { data, loading: statsLoading } = useMarketData(currentTier);
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    if (!data?.stocks) return [];
    return data.stocks.map((item, index) => toWhaleData(item, index));
  }, [data]);

  const filteredRows = useMemo(() => {
    const currentIndexMembers = INDEX_MEMBERS[activeTab] || [];
    const source = byIndex(rows, currentIndexMembers);

    const query = search.trim().toLowerCase();
    if (!query) return source;

    return source.filter(
      (item) =>
        item.ticker.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query),
    );
  }, [activeTab, rows, search]);

  function byIndex(rows: WhaleData[], members: string[]) {
    // If we are in Tier mode (not index mode), we show all rows returned by the tiered service
    if (currentTier) return rows;

    const filtered = rows.filter((item) => members.includes(item.ticker));
    return filtered.length > 0 ? filtered : rows;
  }

  const marketPulse = useMemo(() => {
    if (!filteredRows.length) {
      return { sentiment: "MEMUAT", avgBandarPower: 0, whaleCount: 0 };
    }
    const avgBandarPower = Math.round(
      filteredRows.reduce((sum, item) => sum + item.bandarPower, 0) /
        filteredRows.length,
    );
    return {
      sentiment:
        avgBandarPower >= 60
          ? "BULLISH"
          : avgBandarPower <= 40
            ? "BEARISH"
            : "NETRAL",
      avgBandarPower,
      whaleCount: filteredRows.filter((item) => item.bandarPower > 80).length,
    };
  }, [filteredRows]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden selection:bg-primary/30">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <NewsTicker />

      <main className="flex-1 p-6 lg:p-12 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out relative z-10">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                Data Feed: Live
              </span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.85]">
              Market{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                Pulse
              </span>
            </h1>
            <div className="pt-2">
              <NeuralPulse />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 w-full xl:w-auto">
            <div className="relative group flex-1 xl:flex-none min-w-85">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-zinc-600 group-focus-within:text-primary transition-all" />
              <Input
                placeholder="Cari kode saham..."
                className="pl-14 bg-white/2 border-white/5 h-16 w-full rounded-4xl focus:bg-white/5 focus:ring-primary/20 transition-all text-xl font-black placeholder:text-zinc-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <button className="h-16 px-10 rounded-4xl bg-primary text-black font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 hover:scale-[1.03] active:scale-95 transition-all shadow-2xl shadow-primary/20 group">
                  <MessageSquare className="size-5 transition-transform group-hover:rotate-12" />
                  HUBUNGI AGEN IUS
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-2xl bg-zinc-950/95 p-0 border-white/10 backdrop-blur-3xl"
              >
                <AgentTerminal ticker={search.toUpperCase() || "IHSG"} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Highlight Stats Component */}
        <section className="animate-in fade-in slide-in-from-top-6 duration-1000 delay-200">
          <DashboardStats stats={data?.stats} loading={statsLoading} />
        </section>

        {/* Market Intelligence Insights */}
        <section className="animate-in fade-in slide-in-from-top-6 duration-1000 delay-300">
          <MarketInsightsSection insights={data?.insights ?? null} />
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-auto">
          {/* Market Sentiment Gauge */}
          <Card className="lg:col-span-8 p-0 rounded-[3.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border-white/5 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group transition-all hover:bg-white/[0.05] shadow-2xl">
            <CardContent className="flex flex-col md:flex-row items-center gap-12 p-10 w-full">
              <MarketGauge
                value={marketPulse.avgBandarPower}
                label={marketPulse.sentiment}
                className="shrink-0 scale-125 group-hover:scale-[1.35] transition-transform duration-1000"
              />
              <div className="flex-1 space-y-8 relative z-10 w-full text-center md:text-left">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] block">
                    Sentimen Neural
                  </span>
                  <h2
                    className={cn(
                      "text-6xl font-black italic tracking-tighter transition-all duration-700",
                      marketPulse.sentiment === "BULLISH"
                        ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                        : marketPulse.sentiment === "BEARISH"
                          ? "text-rose-400"
                          : "text-amber-400",
                    )}
                  >
                    {marketPulse.sentiment}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-white/5 pb-3">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                      Kekuatan Akumulasi
                    </span>
                    <span className="text-2xl font-black font-mono text-white tracking-tighter">
                      {marketPulse.avgBandarPower}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Whale Density Card */}
          <Card className="lg:col-span-4 p-10 rounded-[3.5rem] bg-white/[0.02] border-white/5 flex flex-col justify-between group relative overflow-hidden transition-all hover:bg-white/[0.04]">
            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-all duration-1000">
              <Database className="size-48 rotate-12" />
            </div>
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block">
                Node Utama
              </span>
              <div className="flex items-baseline gap-3">
                <h2 className="text-8xl font-black text-white tracking-tighter leading-none">
                  {marketPulse.whaleCount}
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="size-1 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                    LIVE
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-5 relative z-10">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                Whale Terdeteksi di Sektor Ini
              </p>
            </div>
          </Card>

          {/* Market Radar */}
          <div className="lg:col-span-12 space-y-8 py-4">
            <div className="flex items-center gap-6 px-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Globe className="size-5 text-primary" />
                </div>
                <h2 className="text-xl font-black text-white italic tracking-tighter">
                  Matriks Radar Pasar
                </h2>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>
            <div className="rounded-[4rem] overflow-hidden border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-2xl">
              <MarketRadar data={filteredRows} loading={statsLoading} />
            </div>
          </div>

          {/* Index Tabs & Table Section */}
          <div className="lg:col-span-12 space-y-8 pb-20">
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide py-2 px-2">
              <div className="flex items-center gap-3 p-1.5 rounded-[2rem] bg-white/[0.02] border border-white/5">
                {TABS.map((tab) => (
                  <Button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap",
                      activeTab === tab
                        ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] scale-105"
                        : "text-zinc-600 hover:text-zinc-300",
                    )}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/10 border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="px-12 py-12 border-b border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="flex items-center gap-8">
                  <div className="size-20 rounded-[2rem] bg-zinc-950 border border-white/10 flex items-center justify-center shadow-inner">
                    <Cpu className="size-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter italic">
                      Aliran Dana <span className="text-primary">Whale</span>
                    </h2>
                    <p className="text-[11px] text-zinc-600 uppercase font-black tracking-[0.4em] mt-3">
                      Deteksi Transaksi Institusi Besar
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <WhaleDetectorTable
                  data={filteredRows}
                  loading={statsLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-16 px-12 border-t border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <span className="font-black tracking-tighter text-2xl text-white">
            IUS.<span className="text-primary">OTAK</span>
          </span>
          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">
            2024 Intelligence Unit Surveillance
          </p>
        </div>
      </footer>
    </div>
  );
}
