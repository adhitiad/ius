import React from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, DollarSign, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ErrorBoundaryCard from "@/components/ErrorBoundaryCard";
import NewsTicker from "@/components/NewsTicker";

export default function Home() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold tracking-wider uppercase">
          <Activity className="w-4 h-4" />
          Market Intelligence
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight font-outfit text-white">
          Market Dashboard
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Selamat datang kembali. Berikut adalah ikhtisar performa pasar dan sinyal terbaru untuk portofolio Anda.
        </p>
      </header>

      <NewsTicker />

      {/* Stats Grid */}
      <ErrorBoundaryCard title="Statistik Pasar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Equity", value: "$124,592.00", change: "+2.4%", up: true, icon: DollarSign },
            { label: "Active Signals", value: "12", change: "+3 today", up: true, icon: Activity },
            { label: "Win Rate", value: "68.4%", change: "-1.2%", up: false, icon: TrendingUp },
            { label: "Backtests Run", value: "152", change: "+12", up: true, icon: BarChart2 },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-blue-400 transition-colors">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                  stat.up ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                )}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </ErrorBoundaryCard>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ErrorBoundaryCard title="Grafik Analytics">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 h-[400px] flex flex-col items-center justify-center text-zinc-500">
            <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">Market Analytics Chart Placeholder</p>
            <p className="text-xs opacity-50">Visualisasi data akan muncul di sini</p>
          </div>
        </ErrorBoundaryCard>
        
        <ErrorBoundaryCard title="Sinyal Real-time">
          <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col gap-4 h-full">
            <h3 className="font-outfit font-bold text-lg text-white">Sinyal Terbaru</h3>
            <div className="space-y-4">
              {[
                { symbol: "BTC/USDT", type: "LONG", time: "10m ago", price: "$64,200" },
                { symbol: "ETH/USDT", type: "SHORT", time: "25m ago", price: "$3,450" },
                { symbol: "SOL/USDT", type: "LONG", time: "1h ago", price: "$142.50" },
              ].map((signal, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-zinc-200">{signal.symbol}</p>
                    <p className="text-[10px] text-zinc-500">{signal.time}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-xs font-black tracking-tighter",
                      signal.type === "LONG" ? "text-emerald-400" : "text-rose-400"
                    )}>{signal.type}</p>
                    <p className="text-xs font-mono text-zinc-300">{signal.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-auto w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
              Lihat Semua Sinyal
            </button>
          </div>
        </ErrorBoundaryCard>
      </div>
    </div>
  );
}
