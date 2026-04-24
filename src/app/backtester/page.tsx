"use client";

import { BacktestForm } from "@/components/backtester/BacktestForm";
import { EquityChart } from "@/components/backtester/EquityChart";
import { ChartSkeleton } from "@/components/chart/ChartSkeleton";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowDown, Info, Percent, Sparkles, Target } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const SMCChart = dynamic(
  () => import("@/components/chart/SMCChart").then((mod) => mod.SMCChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

// Fungsi untuk menghitung Max Drawdown dari equity curve
const calculateMaxDrawdown = (capitalHistory: number[]): number => {
  if (capitalHistory.length === 0) return 0;
  
  let peak = capitalHistory[0];
  let maxDrawdown = 0;
  
  for (const capital of capitalHistory) {
    if (capital > peak) {
      peak = capital;
    }
    const drawdown = ((peak - capital) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown;
};

// Fungsi untuk menghitung Win Rate dari data backtest
const calculateWinRate = (history: Array<{ capital: number; profit_loss: number }>): { winRate: number; totalTrades: number } => {
  if (history.length < 2) return { winRate: 0, totalTrades: 0 };
  
  let wins = 0;
  let losses = 0;
  
  for (let i = 1; i < history.length; i++) {
    const profitLoss = history[i].profit_loss || 0;
    
    if (profitLoss !== 0) {
      if (profitLoss > 0) {
        wins++;
      } else if (profitLoss < 0) {
        losses++;
      }
    } else {
      const prevCapital = history[i - 1].capital;
      const currCapital = history[i].capital;
      const dailyReturn = currCapital - prevCapital;
      if (dailyReturn > 0) {
        wins++;
      } else if (dailyReturn < 0) {
        losses++;
      }
    }
  }
  
  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  
  return { winRate, totalTrades };
};

export default function BacktesterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [backtestData, setBacktestData] = useState<
    Array<{ date: string; equity: number; benchmark: number }>
  >([]);
  const [metrics, setMetrics] = useState({
    totalReturn: "+0%",
    maxDrawdown: "0%",
    winRate: "0%",
  });
  const [tradeStats, setTradeStats] = useState<{
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
  }>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
  });

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

      // Calculate metrics from real data
      if (history.length > 0) {
        const firstCapital = history[0].capital;
        const lastCapital = history[history.length - 1].capital;
        const totalReturn = (
          ((lastCapital - firstCapital) / firstCapital) *
          100
        ).toFixed(1);

        // Hitung max drawdown dari equity curve
        const capitalHistory = history.map((h) => h.capital);
        const maxDrawdown = calculateMaxDrawdown(capitalHistory);

        // Hitung win rate dari data trade
        const { winRate, totalTrades } = calculateWinRate(history);
        const winningTrades = Math.round((winRate / 100) * totalTrades);
        const losingTrades = totalTrades - winningTrades;

        setMetrics({
          totalReturn: `${totalReturn}%`,
          maxDrawdown: `-${maxDrawdown.toFixed(1)}%`,
          winRate: `${winRate.toFixed(1)}%`,
        });

        setTradeStats({
          totalTrades,
          winningTrades,
          losingTrades,
        });
      }
    } catch (error) {
      console.error("Backtest error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-400 mx-auto min-h-screen">
      <div className="mb-10 space-y-2 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Strategy{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
            Backtester
          </span>
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Simulasikan strategi trading Anda pada data historis. Hubungkan
          Next.js kami dengan mesin backtest Python untuk hasil tingkat
          milidetik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Form */}
        <div className="lg:col-span-4 xl:col-span-3 animate-fade-in-up animate-stagger-1 fill-mode-both">
          <BacktestForm onRun={handleRunBacktest} isLoading={isLoading} />

          <div className="mt-6 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <Info size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                AI Insight
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Strategi{" "}
              <span className="text-blue-400 font-semibold">
                Mean Reversion
              </span>{" "}
              bekerja paling baik pada emiten Big Cap dengan volatilitas rendah
              dalam 6 bulan terakhir.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          {/* Chart Container */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 md:p-8 shadow-xl relative overflow-hidden animate-fade-in-up animate-stagger-2 fill-mode-both">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Equity Growth Curve
                </h3>
                <p className="text-sm text-zinc-500">
                  Visualization of your capital growth over time
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-zinc-400 font-medium">
                    Your Strategy
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                  <span className="text-xs text-zinc-500 font-medium">
                    Benchmark
                  </span>
                </div>
              </div>
            </div>

            <div className="h-100 w-full">
              <EquityChart data={backtestData} />
            </div>
          </div>

          {/* Metrics Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[  
               {  
                 label: "Total Return",  
                 value: metrics.totalReturn,  
                 icon: Percent,  
                 color: "text-emerald-400",  
                 sub: "Based on backtest results",  
               },  
               {  
                 label: "Max Drawdown",  
                 value: metrics.maxDrawdown,  
                 icon: ArrowDown,  
                 color: "text-rose-400",  
                 sub: "Maximum observed loss from peak",  
               },  
               {  
                 label: "Win Rate",  
                 value: metrics.winRate,  
                 icon: Target,  
                 color: "text-blue-400",  
                 sub: tradeStats.totalTrades > 0  
                   ? `${tradeStats.winningTrades}/${tradeStats.totalTrades} profitable trades`  
                   : "No trades executed",  
               },  
             ].map((m, i) => (
              <div
                key={i}
                className={cn(
                  "bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-lg group hover:border-zinc-700 transition-all",
                  "animate-fade-in-up fill-mode-both",
                  i === 0 && "animate-stagger-3",
                  i === 1 && "animate-stagger-4",
                  i === 2 && "animate-stagger-5",
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:bg-zinc-900 transition-colors">
                    <m.icon size={20} className={m.color} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    {m.label}
                  </p>
                  <p
                    className={cn(
                      "text-3xl font-black tracking-tight",
                      m.color,
                    )}
                  >
                    {m.value}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    {m.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info / Table Log could go here */}
          <div className="space-y-6 animate-fade-in-up animate-stagger-6 fill-mode-both">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight leading-none mb-1">
                  Smart Money <span className="text-blue-400">Analytics</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                  Deep Learning Price Action Correlation
                </p>
              </div>
            </div>

            <SMCChart />
          </div>
        </div>
      </div>
    </div>
  );
}
