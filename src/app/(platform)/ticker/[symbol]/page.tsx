"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { TickerHeader } from "@/components/ticker/TickerHeader";
import { TickerChart } from "@/components/ticker/TickerChart";
import { TechnicalIndicators } from "@/components/ticker/TechnicalIndicators";
import { TickerSkeleton } from "@/components/ticker/TickerSkeleton";
import { ChartSkeleton } from "@/components/chart/ChartSkeleton";
import { AlertCircle, Sparkles } from "lucide-react";
import { marketService } from "@/services/marketService";
import { type ChartResponse, type MarketSignal, type RSIResponse } from "@/types/api";

const SMCChart = dynamic(() => import("@/components/chart/SMCChart").then(mod => mod.SMCChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

type TickerDetailData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  chartData: Array<{ date: string; price: number; volume: number }>;
  smcData: React.ComponentProps<typeof SMCChart>["dataOverride"];
  indicators: {
    rsi: number;
    macd: { value: number; signal: number; histogram: number };
    movingAverage: { period: number; status: "Bullish" | "Bearish"; value: number };
  };
};

const getTickerName = (symbol: string) => {
  const knownNames: Record<string, string> = {
    BBCA: "Bank Central Asia Tbk.",
    BBRI: "Bank Rakyat Indonesia Tbk.",
    TLKM: "Telkom Indonesia Tbk.",
  };

  return knownNames[symbol] ?? `${symbol} Stock`;
};

const getSentiment = (signal?: MarketSignal): "Bullish" | "Bearish" | "Neutral" => {
  const recommendation = signal?.recommendation?.toUpperCase();
  if (recommendation?.includes("BUY")) return "Bullish";
  if (recommendation?.includes("SELL")) return "Bearish";

  const score = signal?.sentiment_score ?? 0;
  if (score > 0.15) return "Bullish";
  if (score < -0.15) return "Bearish";
  return "Neutral";
};

const createTickerData = (
  symbol: string,
  chart: ChartResponse,
  rsi?: RSIResponse,
  signal?: MarketSignal,
): TickerDetailData => {
  const ohlc = chart.data.map((item) => ({
    time: item.timestamp,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
  }));
  const latest = chart.data.at(-1);
  const previous = chart.data.at(-2);
  const price = latest?.close ?? 0;
  const change = latest && previous ? latest.close - previous.close : 0;
  const changePercent = previous?.close ? (change / previous.close) * 100 : 0;
  const movingAverageValue =
    chart.data.length > 0
      ? chart.data.reduce((sum, item) => sum + item.close, 0) / chart.data.length
      : price;

  return {
    symbol,
    name: getTickerName(symbol),
    price,
    change,
    changePercent,
    sentiment: getSentiment(signal),
    chartData: chart.data.map((item) => ({
      date: item.timestamp,
      price: item.close,
      volume: item.volume,
    })),
    smcData: {
      ohlc,
      orderBlocks: chart.order_blocks.map((block) => ({
        startX: block.coordinates.start,
        endX: block.coordinates.end,
        y1: block.price * 0.995,
        y2: block.price * 1.005,
        type: block.type === "bullish" ? "demand" : "supply",
      })),
      structureLines:
        ohlc.length > 0
          ? [
              {
                x1: ohlc[0].time,
                x2: ohlc.at(-1)?.time ?? ohlc[0].time,
                y: Math.max(...ohlc.map((item) => item.high)),
                label: "BOS",
              },
              {
                x1: ohlc[0].time,
                x2: ohlc.at(-1)?.time ?? ohlc[0].time,
                y: Math.min(...ohlc.map((item) => item.low)),
                label: "CHoCH",
              },
            ]
          : [],
    },
    indicators: {
      rsi: rsi?.rsi ?? 50,
      macd: {
        value: signal?.lstm_probability ? signal.lstm_probability * 100 : 0,
        signal: signal?.sentiment_score ? signal.sentiment_score * 100 : 0,
        histogram:
          (signal?.lstm_probability ? signal.lstm_probability * 100 : 0) -
          (signal?.sentiment_score ? signal.sentiment_score * 100 : 0),
      },
      movingAverage: {
        period: chart.data.length,
        status: price >= movingAverageValue ? "Bullish" : "Bearish",
        value: Math.round(movingAverageValue),
      },
    },
  };
};

export default function TickerDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TickerDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const cleanSymbol = symbol.toUpperCase().replace(".JK", "");
        const [chartResult, rsiResult, signalResult] = await Promise.allSettled([
          marketService.getChart(cleanSymbol),
          marketService.getTechnicalRSI(cleanSymbol),
          marketService.getMarketSignal(cleanSymbol),
        ]);

        if (chartResult.status !== "fulfilled") {
          throw chartResult.reason;
        }

        const tickerData = createTickerData(
          cleanSymbol,
          chartResult.value,
          rsiResult.status === "fulfilled" ? rsiResult.value : undefined,
          signalResult.status === "fulfilled" ? signalResult.value : undefined,
        );
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
        <SMCChart dataOverride={data.smcData} />
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
