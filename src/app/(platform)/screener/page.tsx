"use client";

import { ScreenerTable } from "@/components/screener/ScreenerTable";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/marketService";
import { ScreenerItem } from "@/types/api";
import { BarChart3, Search, ShieldCheck, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScreenerPage() {
  const [data, setData] = useState<ScreenerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");

  const fetchData = async () => {
    setLoading(true);
    try {
      const screener = await marketService.getScreener(timeframe);
      setData(screener);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const filteredData = data.filter((item) =>
    item.ticker.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl">
              <Sparkles className="size-3 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                Data Intelijen: Alpha Filter
              </span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.85]">
              Market{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                Screener
              </span>
            </h1>
            <p className="text-zinc-500 font-bold text-xl max-w-xl leading-relaxed tracking-tight">
              Algoritma penyaringan tingkat lanjut untuk menemukan peluang
              trading dengan probabilitas tinggi.
            </p>
          </div>

          <div className="relative group w-full lg:w-[400px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-zinc-600 group-focus-within:text-primary transition-all duration-500" />
            <Input
              placeholder="Filter ticker..."
              className="pl-16 bg-white/[0.02] border-white/5 h-18 w-full rounded-[2.5rem] focus:bg-white/[0.05] focus:ring-primary/20 transition-all backdrop-blur-3xl text-xl font-black tracking-tighter placeholder:text-zinc-800 shadow-2xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Feature Highlights Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col gap-6 relative group overflow-hidden hover:bg-white/[0.04] transition-all">
            <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <BarChart3 className="size-6" />
            </div>
            <div>
              <h3 className="text-xl font-black italic tracking-tighter">
                Analisis Teknis
              </h3>
              <p className="text-xs text-zinc-500 font-bold mt-2 uppercase tracking-widest text-zinc-600">
                Terintegrasi RSI & EMA 200
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <BarChart3 className="size-24" />
            </div>
          </div>

          <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col gap-6 relative group overflow-hidden hover:bg-white/[0.04] transition-all">
            <div className="size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Target className="size-6" />
            </div>
            <div>
              <h3 className="text-xl font-black italic tracking-tighter">
                Probabilitas Win
              </h3>
              <p className="text-xs text-zinc-500 font-bold mt-2 uppercase tracking-widest text-zinc-600">
                Mesin Prediksi Win Rate
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <Target className="size-24" />
            </div>
          </div>

          <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col gap-6 relative group overflow-hidden hover:bg-white/[0.04] transition-all">
            <div className="size-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h3 className="text-xl font-black italic tracking-tighter">
                Verifikasi Institusi
              </h3>
              <p className="text-xs text-zinc-500 font-bold mt-2 uppercase tracking-widest text-zinc-600">
                Deteksi Aliran Dana Besar
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <ShieldCheck className="size-24" />
            </div>
          </div>
        </div>

        {/* Screener Display */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="px-12 py-10 border-b border-white/5 bg-gradient-to-r from-white/[0.01] to-transparent flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                <h2 className="text-xl font-black italic tracking-tighter uppercase">
                  TOP 20 {timeframe === 'daily' ? 'HARIAN' : timeframe === 'weekly' ? 'MINGGUAN' : 'BULANAN'}
                </h2>
              </div>
              
              <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/5">
                {[
                  { id: 'daily', label: 'Harian' },
                  { id: 'weekly', label: 'Mingguan' },
                  { id: 'monthly', label: 'Bulanan' }
                ].map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setTimeframe(tf.id as any)}
                    className={cn(
                      "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      timeframe === tf.id 
                        ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                        : "text-zinc-500 hover:text-white"
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={fetchData}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
              disabled={loading}
            >
              {loading ? "Refresh..." : "Segarkan Data"}
            </button>
          </div>

          <ScreenerTable data={filteredData} loading={loading} />
        </div>
      </main>

      {/* Futuristic Navigasi Footer */}
      <footer className="py-20 px-12 border-t border-white/5 bg-black/40 backdrop-blur-xl mt-32">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <h2 className="text-3xl font-black italic tracking-tighter">
            Screener <span className="text-primary">v2.4</span>
          </h2>
          <div className="flex gap-16">
            {["Akumulasi", "Distribusi", "Netral"].map((status) => (
              <div key={status} className="flex items-center gap-3">
                <div
                  className={cn(
                    "size-2 rounded-full",
                    status === "Akumulasi"
                      ? "bg-emerald-500"
                      : status === "Distribusi"
                        ? "bg-rose-500"
                        : "bg-zinc-600",
                  )}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[1em]">
            Intelligence Surveillance
          </p>
        </div>
      </footer>
    </div>
  );
}
