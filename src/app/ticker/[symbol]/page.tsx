"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import axios from "axios";
import { TickerHeader } from "@/components/ticker/TickerHeader";
import { TickerChart } from "@/components/ticker/TickerChart";
import { TechnicalIndicators } from "@/components/ticker/TechnicalIndicators";
import { TickerSkeleton } from "@/components/ticker/TickerSkeleton";
import { ChartSkeleton } from "@/components/chart/ChartSkeleton";
import { AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SMCChart = dynamic(() => import("@/components/chart/SMCChart").then(mod => mod.SMCChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

// Mock data generator for ticker detail
const generateTickerData = (symbol: string) => {
  const chartData = [];
  let price = 5000 + Math.random() * 5000;
  
  for (let i = 20; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price = price * (1 + (Math.random() * 0.04 - 0.02));
    chartData.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price),
      volume: Math.round(1000000 + Math.random() * 5000000),
    });
  }

  return {
    symbol: symbol.toUpperCase(),
    name: symbol.toUpperCase() === "BBCA" ? "Bank Central Asia Tbk." : 
          symbol.toUpperCase() === "BBRI" ? "Bank Rakyat Indonesia Tbk." :
          symbol.toUpperCase() === "TLKM" ? "Telkom Indonesia Tbk." : "Emiten Pilihan Antigravity",
    price: Math.round(price),
    change: Math.round(price * 0.015),
    changePercent: 1.5,
    sentiment: (Math.random() > 0.4 ? "Bullish" : Math.random() > 0.5 ? "Neutral" : "Bearish") as any,
    chartData,
    indicators: {
      rsi: 45 + Math.random() * 20,
      macd: { value: 1.2, signal: 0.8, histogram: 0.4 },
      movingAverage: { period: 20, status: "Bullish" as const, value: Math.round(price * 0.98) },
    }
  };
};

export default function TickerDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulasi delay axios
        await new Promise(resolve => setTimeout(resolve, 1500));
        const tickerData = generateTickerData(symbol);
        setData(tickerData);
      } catch (err) {
        setError("Gagal memuat data emiten. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <TickerSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white">Ops! Terjadi Kesalahan</h2>
        <p className="text-zinc-500 max-w-md">{error || "Data tidak ditemukan."}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="animate-in fade-in slide-in-from-top-4 duration-700 fill-mode-both">
        <TickerHeader 
          symbol={data.symbol}
          name={data.name}
          price={data.price}
          change={data.change}
          changePercent={data.changePercent}
          sentiment={data.sentiment}
        />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 animate-stagger-1 fill-mode-both">
        <TickerChart data={data.chartData} />
      </div>

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 animate-stagger-1.5 fill-mode-both">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-none mb-1">Advanced <span className="text-blue-400">AI Analytics</span></h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Institutional Order Block & Structure Flow</p>
          </div>
        </div>
        <SMCChart />
      </div>

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 animate-stagger-2 fill-mode-both">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-widest">Technical Analytics</h2>
        </div>
        <TechnicalIndicators 
          rsi={data.indicators.rsi}
          macd={data.indicators.macd}
          movingAverage={data.indicators.movingAverage}
        />
      </div>

      {/* Footer Info */}
      <footer className="pt-12 pb-6 border-t border-zinc-800/50">
        <p className="text-[10px] text-zinc-600 text-center uppercase font-bold tracking-[0.3em]">
          Powered by Antigravity Intelligence Engine • Data Delay up to 15 mins
        </p>
      </footer>
    </div>
  );
}
