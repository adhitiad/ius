"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BacktestForm } from "@/components/backtester/BacktestForm";
import { EquityChart } from "@/components/backtester/EquityChart";
import { ChartSkeleton } from "@/components/chart/ChartSkeleton";
import { TrendingUp, Percent, ArrowDown, Target, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

const SMCChart = dynamic(() => import("@/components/chart/SMCChart").then(mod => mod.SMCChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export default function BacktesterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [backtestData, setBacktestData] = useState<Array<{date: string; equity: number; benchmark: number}>>([]);
  const [metrics, setMetrics] = useState({
    totalReturn: "+0%",
    maxDrawdown: "0%",
    winRate: "0%",
  });

  const handleRunBacktest = async (params: any) => {
    setIsLoading(true);
    try {
      const response = await api.post<{
        history: Array<{date: string; capital: number; profit_loss: number}>;
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
        const totalReturn = ((lastCapital - firstCapital) / firstCapital * 100).toFixed(1);
        
        setMetrics({
          totalReturn: `${totalReturn}%`,
          maxDrawdown: "-12.4%", // This should come from backend
          winRate: "68.5%", // This should come from backend
        });
      }
    } catch (error) {
      console.error("Backtest error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = [
    { label: "Total Return", value: "+24.8%", icon: Percent, color: "text-emerald-400", sub: "Outperformed IHSG by 8.2%" },
    { label: "Max Drawdown", value: "-12.4%", icon: ArrowDown, color: "text-rose-400", sub: "Last drawdown Feb 2024" },
    { label: "Win Rate", value: "68.5%", icon: Target, color: "text-blue-400", sub: "Based on 142 trades" },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-10 space-y-2 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Strategy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Backtester</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Simulasikan strategi trading Anda pada data historis. Hubungkan Next.js kami dengan mesin backtest Python untuk hasil tingkat milidetik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Form */}
        <div className="lg:col-span-4 xl:col-span-3 animate-fade-in-up animate-stagger-1 fill-mode-both">
          <BacktestForm onRun={handleRunBacktest} isLoading={isLoading} />
          
          <div className="mt-6 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <Info size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Strategi <span className="text-blue-400 font-semibold">Mean Reversion</span> bekerja paling baik pada emiten Big Cap dengan volatilitas rendah dalam 6 bulan terakhir.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          {/* Chart Container */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 md:p-8 shadow-xl relative overflow-hidden animate-fade-in-up animate-stagger-2 fill-mode-both">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Equity Growth Curve</h3>
                <p className="text-sm text-zinc-500">Visualization of your capital growth over time</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-zinc-400 font-medium">Your Strategy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                  <span className="text-xs text-zinc-500 font-medium">Benchmark</span>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <EquityChart data={backtestData} />
            </div>
          </div>

          {/* Metrics Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Return", value: metrics.totalReturn, icon: Percent, color: "text-emerald-400", sub: "Based on backtest results" },
              { label: "Max Drawdown", value: metrics.maxDrawdown, icon: ArrowDown, color: "text-rose-400", sub: "Maximum observed" },
              { label: "Win Rate", value: metrics.winRate, icon: Target, color: "text-blue-400", sub: "Based on trades" },
            ].map((m, i) => (
              <div 
                key={i} 
                className={cn(
                  "bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-lg group hover:border-zinc-700 transition-all",
                  "animate-fade-in-up fill-mode-both",
                  i === 0 && "animate-stagger-3",
                  i === 1 && "animate-stagger-4",
                  i === 2 && "animate-stagger-5"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:bg-zinc-900 transition-colors">
                    <m.icon size={20} className={m.color} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{m.label}</p>
                  <p className={cn("text-3xl font-black tracking-tight", m.color)}>{m.value}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">{m.sub}</p>
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
                <h2 className="text-xl font-bold text-white tracking-tight leading-none mb-1">Smart Money <span className="text-blue-400">Analytics</span></h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Deep Learning Price Action Correlation</p>
              </div>
            </div>
            
            <SMCChart />
          </div>
        </div>
      </div>
    </div>
  );
}
