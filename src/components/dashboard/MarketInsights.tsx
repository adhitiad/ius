"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Landmark, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketInsights } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis,
  AreaChart,
  Area
} from "recharts";

interface MarketInsightsSectionProps {
  insights: MarketInsights | null;
  loading?: boolean;
}

// Data simulasi untuk sparkline jika data historis belum tersedia
const generateSparkData = (base: number, trend: 'up' | 'down') => {
  return Array.from({ length: 10 }, (_, i) => ({
    value: base + (trend === 'up' ? Math.random() * 5 + i : Math.random() * 5 - i)
  }));
};

export function MarketInsightsSection({ insights, loading }: MarketInsightsSectionProps) {
  if (loading || !insights) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-zinc-950/50 border-white/5 animate-pulse h-[300px]">
            <CardHeader className="space-y-2">
              <div className="h-6 w-24 bg-white/5 rounded" />
              <div className="h-4 w-32 bg-white/5 rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Top Gainers - Saham Terkuat */}
      <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl overflow-hidden group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ArrowUpRight className="size-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="font-black italic tracking-tighter text-xl">
                  <h2>Saham Terkuat</h2>
                </CardTitle>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kenaikan Harga Hari Ini</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {insights.top_gainers.slice(0, 4).map((item, idx) => (
            <div key={item.ticker} className="flex items-center justify-between group/item p-2 rounded-xl hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black">
                  #{idx + 1}
                </Badge>
                <span className="font-black text-lg tracking-tighter group-hover/item:text-emerald-400 transition-colors">{item.ticker}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-16 hidden sm:block">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={generateSparkData(item.price, 'up')}>
                      <defs>
                        <linearGradient id={`grad-up-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill={`url(#grad-up-${idx})`} strokeWidth={2} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-500">+{item.change.toFixed(2)}%</div>
                  <div className="text-[10px] font-bold text-zinc-600">IDR {item.price.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Losers - Saham Terlemah */}
      <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl overflow-hidden group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <ArrowDownRight className="size-5 text-rose-500" />
              </div>
              <div>
                <CardTitle className="font-black italic tracking-tighter text-xl">
                  <h2>Saham Terlemah</h2>
                </CardTitle>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Penurunan Harga Hari Ini</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {insights.top_losers.slice(0, 4).map((item, idx) => (
            <div key={item.ticker} className="flex items-center justify-between group/item p-2 rounded-xl hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-black">
                  #{idx + 1}
                </Badge>
                <span className="font-black text-lg tracking-tighter group-hover/item:text-rose-400 transition-colors">{item.ticker}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-16 hidden sm:block">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={generateSparkData(item.price, 'down')}>
                      <defs>
                        <linearGradient id={`grad-down-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="#f43f5e" fillOpacity={1} fill={`url(#grad-down-${idx})`} strokeWidth={2} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-rose-500">{item.change.toFixed(2)}%</div>
                  <div className="text-[10px] font-bold text-zinc-600">IDR {item.price.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Whale Accumulation - Akumulasi Bandar */}
      <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl overflow-hidden group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Landmark className="size-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="font-black italic tracking-tighter text-xl">
                  <h2>Akumulasi Bandar</h2>
                </CardTitle>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Aliran Dana Asing Tertinggi</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {insights.top_foreign.slice(0, 4).map((item, idx) => (
            <div key={item.ticker} className="flex items-center justify-between group/item p-2 rounded-xl hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-black">
                  #{idx + 1}
                </Badge>
                <span className="font-black text-lg tracking-tighter group-hover/item:text-blue-400 transition-colors">{item.ticker}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-16 hidden sm:block">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <LineChart data={generateSparkData(item.foreign_net, 'up')}>
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-blue-500">+{ (item.foreign_net / 1000000000).toFixed(1) }B</div>
                  <div className="text-[10px] font-bold text-zinc-600">Net Asing</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
