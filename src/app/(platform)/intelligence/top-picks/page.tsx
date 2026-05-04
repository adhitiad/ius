"use client";

import { adminService } from "@/services/adminService";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TopPick {
  ticker: string;
  name: string;
  final_intelligence_score: number;
  health_status: string;
  agent_conviction: string;
  price: number;
  change: number;
}

export default function TopPicksPage() {
  const [topPicks, setTopPicks] = useState<TopPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");

  const fetchData = async () => {
    try {
      setLoading(true);
      const picksData = await adminService.getAgentTopPicks(timeframe);
      setTopPicks(picksData);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data Top 20 Intelligence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 15000);
    return () => clearInterval(interval);
  }, [timeframe]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-amber-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <div className="size-16 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center shadow-inner">
              <TrendingUp className="size-8 text-amber-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white italic tracking-tighter">
                Top 20 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Inteligensi</span>
              </h1>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2">
                Sintesis Alpha Tertinggi dari Agen Otonom
              </p>
            </div>
          </div>

          <div className="flex items-center p-1.5 bg-black/40 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl">
            {(["daily", "weekly", "monthly"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  timeframe === tf
                    ? "bg-white/10 text-white shadow-lg"
                    : "text-zinc-600 hover:text-zinc-300"
                )}
              >
                {tf === "daily" ? "Harian" : tf === "weekly" ? "Mingguan" : "Bulanan"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-black/20 border border-white/5 rounded-[2rem] backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Rank</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Aset</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Neural Score</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Health</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Conviction</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && topPicks.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td colSpan={6} className="p-8">
                        <Skeleton className="h-12 w-full bg-zinc-900/50 rounded-xl" />
                      </td>
                    </tr>
                  ))
                ) : topPicks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-32 text-center opacity-50">
                      <TrendingUp className="size-20 text-zinc-800 mb-6 mx-auto" />
                      <p className="text-zinc-600 font-bold italic text-lg tracking-tight">
                        Belum ada data inteligensi tersedia untuk timeframe ini.
                      </p>
                    </td>
                  </tr>
                ) : (
                  topPicks.map((pick, i) => (
                    <tr 
                      key={pick.ticker}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group animate-in slide-in-from-bottom-2 duration-500"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <td className="px-8 py-6">
                        <div className={cn(
                          "size-10 rounded-xl flex items-center justify-center font-black text-sm italic shadow-inner",
                          i === 0 ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                          i === 1 ? "bg-zinc-300/20 text-zinc-300 border border-zinc-300/30" :
                          i === 2 ? "bg-amber-700/20 text-amber-700 border border-amber-700/30" :
                          "bg-white/5 text-zinc-500 border border-white/10"
                        )}>
                          #{i + 1}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="space-y-1">
                            <div className="font-black text-2xl tracking-tighter text-white group-hover:text-amber-500 transition-colors italic">
                              {pick.ticker}
                            </div>
                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest truncate max-w-[200px]">
                              {pick.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-2xl text-white font-black italic tabular-nums tracking-tighter">
                          {pick.final_intelligence_score.toFixed(1)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={cn(
                          "text-xs font-black uppercase tracking-widest",
                          pick.health_status === "PRIME" ? "text-emerald-500" : "text-amber-500"
                        )}>
                          {pick.health_status}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge
                          className={cn(
                            "text-[10px] px-3 py-1 font-black rounded-xl border uppercase tracking-widest",
                            pick.agent_conviction === "HIGH"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20",
                          )}
                        >
                          {pick.agent_conviction}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <a href={`/screener?ticker=${pick.ticker}`} className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest border border-white/10 transition-all shadow-lg hover:scale-105">
                          Analisis
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
