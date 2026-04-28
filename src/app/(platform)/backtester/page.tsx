"use client";

import { BacktestForm } from "@/components/backtester/BacktestForm";
import { EquityChart } from "@/components/backtester/EquityChart";
import { ChartSkeleton } from "@/components/chart/ChartSkeleton";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowDown, Info, Percent, Sparkles, Target, Zap, Activity, ShieldCheck, History } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const SMCChart = dynamic(
  () => import("@/components/chart/SMCChart").then((mod) => mod.SMCChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const calculateMaxDrawdown = (capitalHistory: number[]): number => {
  if (capitalHistory.length === 0) return 0;
  let peak = capitalHistory[0];
  let maxDrawdown = 0;
  for (const capital of capitalHistory) {
    if (capital > peak) peak = capital;
    const drawdown = ((peak - capital) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  return maxDrawdown;
};

const calculateWinRate = (history: Array<{ capital: number; profit_loss: number }>): { winRate: number; totalTrades: number } => {
  if (history.length < 2) return { winRate: 0, totalTrades: 0 };
  let wins = 0;
  let losses = 0;
  for (let i = 1; i < history.length; i++) {
    const profitLoss = history[i].profit_loss || 0;
    if (profitLoss > 0) wins++;
    else if (profitLoss < 0) losses++;
  }
  const totalTrades = wins + losses;
  return { winRate: totalTrades > 0 ? (wins / totalTrades) * 100 : 0, totalTrades };
};

export default function BacktesterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [backtestData, setBacktestData] = useState<Array<{ date: string; equity: number; benchmark: number }>>([]);
  const [metrics, setMetrics] = useState({
    totalReturn: "+0%",
    maxDrawdown: "0%",
    winRate: "0%",
  });
  const [tradeStats, setTradeStats] = useState({ totalTrades: 0, winningTrades: 0, losingTrades: 0 });

  const handleRunBacktest = async (params: any) => {
    setIsLoading(true);
    try {
      const response = await api.post<{
        history: Array<{ date: string; capital: number; profit_loss: number }>;
        final_profit_pct: number;
      }>("/market/backtest", params);
      const history = response.data.history || [];
      const formattedData = history.map((item) => ({
        date: item.date,
        equity: item.capital,
        benchmark: item.capital - (item.profit_loss || 0),
      }));
      setBacktestData(formattedData);
      if (history.length > 0) {
        const firstCapital = history[0].capital;
        const lastCapital = history[history.length - 1].capital;
        const totalReturn = (((lastCapital - firstCapital) / firstCapital) * 100).toFixed(1);
        const maxDrawdown = calculateMaxDrawdown(history.map(h => h.capital));
        const { winRate, totalTrades } = calculateWinRate(history);
        setMetrics({
          totalReturn: `${totalReturn}%`,
          maxDrawdown: `-${maxDrawdown.toFixed(1)}%`,
          winRate: `${winRate.toFixed(1)}%`,
        });
        setTradeStats({ totalTrades, winningTrades: Math.round((winRate / 100) * totalTrades), losingTrades: totalTrades - Math.round((winRate / 100) * totalTrades) });
      }
    } catch (error) {
      console.error("Backtest error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl">
               <History className="size-3 text-blue-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Time Travel Debugger</span>
            </div>
            <h1 className="text-8xl font-black tracking-tighter leading-[0.8]">
              Strategy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)] italic">Backtester</span>
            </h1>
            <p className="text-zinc-500 font-bold text-2xl max-w-2xl leading-tight tracking-tight">
               Validasi hipotesis perdagangan Anda terhadap data historis dekade terakhir dengan latensi milidetik.
            </p>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Controls Panel */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-8 h-fit">
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-4 shadow-2xl backdrop-blur-3xl">
               <div className="p-8 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                     <Zap className="size-4 text-blue-400" />
                     <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Konfigurasi</h2>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Parameter Simulasi Meta</p>
               </div>
               <div className="p-4">
                  <BacktestForm onRun={handleRunBacktest} isLoading={isLoading} />
               </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-blue-500/5 border border-blue-500/10 relative overflow-hidden group">
               <Sparkles className="absolute -right-4 -top-4 size-24 text-blue-500/10 group-hover:rotate-12 transition-transform duration-700" />
               <h3 className="text-xl font-black italic tracking-tighter text-blue-400 mb-3">AI Advisor</h3>
               <p className="text-xs text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">
                  Strategi Mean Reversion bekerja optimal pada emiten Blue Chip dengan volatilitas rendah untuk periode 6-12 bulan.
               </p>
            </div>
          </div>

          {/* Visualization & Metrics */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-10">
            {/* Chart Area */}
            <div className="rounded-[4rem] bg-zinc-900/20 border border-white/5 p-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] backdrop-blur-3xl overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                  <Activity className="size-40" />
               </div>
               
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12 relative z-10">
                  <div className="space-y-1">
                     <h3 className="text-4xl font-black text-white tracking-tighter italic">Kurva Pertumbuhan <span className="text-blue-400">Ekuitas</span></h3>
                     <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Visualisasi Aliran Modal Kumulatif</p>
                  </div>
                  <div className="flex items-center gap-8 bg-black/40 px-6 py-3 rounded-full border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Strategi Anda</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-zinc-700" />
                      <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Benchmark</span>
                    </div>
                  </div>
               </div>

               <div className="h-[500px] w-full">
                  <EquityChart data={backtestData} />
               </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[  
                 { label: "Total Profit", value: metrics.totalReturn, icon: Percent, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                 { label: "Max Drawdown", value: metrics.maxDrawdown, icon: ArrowDown, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
                 { label: "Neural Win Rate", value: metrics.winRate, icon: Target, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
               ].map((m, i) => (
                 <div key={i} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 shadow-2xl hover:bg-white/[0.04] transition-all group flex flex-col justify-between h-64">
                    <div className={cn("size-16 rounded-[1.5rem] flex items-center justify-center border", m.bg, m.border)}>
                       <m.icon className={cn("size-8", m.color)} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">{m.label}</p>
                       <p className={cn("text-6xl font-black tracking-tighter truncate italic", m.color)}>{m.value}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Advanced Analytics */}
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
               <div className="flex items-center gap-8 px-4">
                  <div className="flex items-center gap-4">
                     <div className="size-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <ShieldCheck className="size-6" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-white italic tracking-tighter leading-none">Smart Money <span className="text-blue-400">Analytics</span></h2>
                        <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em] mt-1">Deep Learning Price Action Correlation</p>
                     </div>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
               </div>
               <div className="rounded-[4rem] border border-white/5 bg-white/[0.01] overflow-hidden shadow-2xl backdrop-blur-3xl">
                  <SMCChart />
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-20 px-12 border-t border-white/5 bg-black/60 mt-32 backdrop-blur-2xl">
         <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <span className="font-black tracking-tighter text-3xl text-white">IUS.<span className="text-blue-400 italic font-black uppercase">Alpha</span></span>
            <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[1em]">Intelligence Surveillance Systems</p>
         </div>
      </footer>
    </div>
  );
}
