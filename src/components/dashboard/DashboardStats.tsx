"use client";
import React from "react";

import { MarketStats } from "@/hooks/useMarketData";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Cpu,
  DollarSign,
  Globe,
  Layers,
  Server,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from "recharts";

interface DashboardStatsProps {
  stats?: MarketStats;
  loading: boolean;
}

// Data simulasi untuk tren indeks
const generateIndexTrend = (isUp: boolean) => {
  return Array.from({ length: 8 }, (_, i) => ({
    value: 50 + (isUp ? i * 2 + Math.random() * 5 : -i * 2 + Math.random() * 5)
  }));
};

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const user = useMarketStore((state) => state.user);
  const [secondsAgo, setSecondsAgo] = React.useState(0);

  React.useEffect(() => {
    setSecondsAgo(0);
    const interval = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [stats]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const telemetry = stats?.telemetry;

  return (
    <div className="space-y-8">
      {/* Neural Core Status Bar */}
      <Card className="bg-emerald-500/[0.03] border-emerald-500/10 backdrop-blur-sm relative overflow-hidden group rounded-[2rem]">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent animate-shimmer pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Activity className="size-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white">
                Sinopsis Neural
              </h2>
              <p className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest mt-1 italic">
                {stats?.synopsis ||
                  "Sinkronisasi pola kognitif pasar sedang berlangsung..."}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-black/60 border-white/10 px-5 py-2.5 rounded-2xl relative z-10 shadow-2xl flex items-center gap-3 h-auto"
          >
            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Data Sinkron {secondsAgo} Detik Lalu
            </span>
          </Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8 w-full">
        {/* 1. PORTFOLIO PERFORMANCE */}
        <Card className="md:col-span-6 lg:col-span-4 border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-[2.5rem] flex flex-col justify-between group relative overflow-hidden transition-all hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] border-none ring-1 ring-white/5 h-[280px]">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
          
          {/* Portfolio Chart Background */}
          <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generateIndexTrend(true)}>
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" strokeWidth={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative z-10 p-8">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="text-right">
              <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Nilai Ekuitas Bersih
              </CardDescription>
              <CardTitle className="text-4xl lg:text-3xl font-black text-white tracking-tighter mt-1">
                {user
                  ? formatCurrency(
                      75200000 + (user.returnPercentage || 0) * 1250000,
                    )
                  : "Rp 0"}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-0 flex justify-between items-end mt-4 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-emerald-400 font-black">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[11px] flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)] rounded-lg px-3 py-1">
                  <TrendingUp className="w-3.5 h-3.5" />+
                  {user?.returnPercentage?.toFixed(2) || "0.00"}%
                </Badge>
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
                  ROR Real-time
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex gap-1.5 mb-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 h-3.5 rounded-full shadow-sm",
                      i < 4 ? "bg-emerald-500" : "bg-zinc-800",
                    )}
                  />
                ))}
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                Kesehatan Node
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 2. MARKET ANALYTICS */}
        <Card className="md:col-span-3 lg:col-span-4 border-white/5 bg-zinc-950/50 backdrop-blur-md rounded-[2.5rem] flex flex-col justify-between group relative overflow-hidden h-[280px]">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 p-8">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:rotate-12 transition-transform">
              <Zap className="w-8 h-8" />
            </div>
            <div className="text-right">
              <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Sentimen Hybrid
              </CardDescription>
              <CardTitle
                className={cn(
                  "text-3xl font-black tracking-[0.1em] mt-1 italic",
                  stats?.compositeSentiment === "ACCUMULATION"
                    ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    : stats?.compositeSentiment === "DISTRIBUTION"
                      ? "text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                      : "text-amber-400",
                )}
              >
                {loading
                  ? "MENGANALISIS..."
                  : stats?.compositeSentiment === "ACCUMULATION"
                    ? "OPTIMAL"
                    : stats?.compositeSentiment === "DISTRIBUTION"
                      ? "DIVERGEN"
                      : "NETRAL"}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-0 space-y-6 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                <span>RSI Vektor Berbobot</span>
                <span
                  className={cn(
                    "font-mono",
                    (stats?.avgRSI || 0) > 70
                      ? "text-rose-500"
                      : (stats?.avgRSI || 0) < 30
                        ? "text-emerald-500"
                        : "text-zinc-400",
                  )}
                >
                  {stats?.avgRSI?.toFixed(2) || "45.00"}
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 relative",
                    (stats?.avgRSI || 0) > 70
                      ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                      : (stats?.avgRSI || 0) < 30
                        ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
                  )}
                  style={{ width: `${stats?.avgRSI || 45}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-t border-white/5">
              <div className="flex-1">
                <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">
                  Densitas Sinyal Neural
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 h-1 rounded-full",
                        i % 3 === 0 ? "bg-primary/40" : "bg-zinc-800",
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-white">
                  {stats?.activeSignals || 0}
                </span>
                <Badge
                  variant="outline"
                  className="text-[6px] h-3 px-1 border-white/5 text-zinc-500 block uppercase"
                >
                  Nodes
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. SYSTEM TELEMETRY */}
        <Card className="md:col-span-3 lg:col-span-4 border-white/5 bg-zinc-950/30 rounded-[2.5rem] flex flex-col justify-between group h-[280px]">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 p-8">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cpu className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-right">
              <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Beban Kognitif Core
              </CardDescription>
              <CardTitle className="text-4xl font-black text-white tracking-widest mt-1 italic">
                {telemetry?.diagnostics.ram_usage || "0%"}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-0 mt-8 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  telemetry?.diagnostics.gpu.has_gpu
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-zinc-800 text-zinc-600",
                )}
              >
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-white uppercase leading-none mb-1 tracking-wider">
                  {telemetry?.diagnostics.gpu.has_gpu
                    ? "AKSELERASI LSTM"
                    : "CORE LATE SYNC"}
                </p>
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                  {telemetry?.diagnostics.gpu.gpu_name || "OPTIMASI CPU AKTIF"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Badge
                variant="outline"
                className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center group-hover:bg-blue-500/5 transition-colors h-auto"
              >
                <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">
                  Latency
                </span>
                <span className="text-xs font-black text-blue-400 font-mono tracking-tighter">
                  14ms
                </span>
              </Badge>
              <Badge
                variant="outline"
                className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center group-hover:bg-emerald-500/5 transition-colors h-auto"
              >
                <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">
                  Status
                </span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">
                  SINERGI
                </span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 4. IDX INTELLIGENCE */}
        <Card className="md:col-span-6 lg:col-span-8 border-white/5 bg-gradient-to-br from-zinc-900/50 to-transparent rounded-[3rem] flex flex-col group relative overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 pb-0">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-500",
                  stats?.ihsg.up
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20",
                )}
              >
                <Globe
                  className={cn(
                    "w-8 h-8",
                    stats?.ihsg.up ? "animate-pulse" : "",
                  )}
                />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-white italic tracking-tighter">
                  Matriks{" "}
                  <span className="text-primary italic">IDX Vektor</span>
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <CardDescription className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                    Infrastruktur Analitik Real-Time
                  </CardDescription>
                  {stats?.ihsg.isFallback && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[7px] h-3 px-1 font-black leading-none">
                      YAHOO FALLBACK
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right bg-black/20 px-6 py-4 rounded-3xl border border-white/5">
              <p className="text-3xl font-black text-white tracking-widest font-mono">
                {loading ? "??.????" : stats?.ihsg.value}
              </p>
              <div
                className={cn(
                  "flex items-center justify-end gap-1 font-black text-xs mt-1",
                  stats?.ihsg.up ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {stats?.ihsg.up ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stats?.ihsg.change}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {(stats?.majorIndices || []).map((idx) => (
              <div
                key={idx.code}
                className="p-5 rounded-3xl bg-zinc-950/40 border border-white/5 hover:border-primary/40 transition-all group/idx relative overflow-hidden"
              >
                <div className="absolute inset-0 z-0 opacity-10 group-hover/idx:opacity-20 transition-opacity">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateIndexTrend(idx.up)}>
                         <Area type="monotone" dataKey="value" stroke={idx.up ? "#10b981" : "#f43f5e"} fill={idx.up ? "#10b981" : "#f43f5e"} strokeWidth={0} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase group-hover/idx:text-primary transition-colors tracking-widest leading-none">
                      {idx.code}
                    </span>
                    {idx.isFallback && (
                      <span className="text-[6px] font-black text-amber-500/60 uppercase tracking-tighter">YF</span>
                    )}
                  </div>
                  <p className="text-xl font-black text-white mb-2 font-mono tracking-tighter leading-none">
                    {loading ? "---" : idx.value}
                  </p>
                  <Badge
                    variant="ghost"
                    className={cn(
                      "text-[10px] font-black p-0 h-auto",
                      idx.up ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {idx.up ? "+" : ""}
                    {idx.change}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 5. SERVICE CONNECTIVITY MESH */}
        <Card className="md:col-span-6 lg:col-span-4 border-white/5 bg-transparent rounded-[3rem] flex flex-col justify-between p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="size-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
              <Server className="size-5 text-zinc-500" />
            </div>
            <CardTitle className="text-xs font-black text-white uppercase tracking-[0.3em]">
              Mesh Konfigurasi Jaringan
            </CardTitle>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              {
                id: "NEURAL DB",
                status: telemetry?.services.database_neon,
                color: "hover:border-emerald-500/40",
              },
              {
                id: "COMMAND CORE",
                status: telemetry?.services.redis_cloud,
                color: "hover:border-blue-500/40",
              },
              {
                id: "SINKRON VEKTOR",
                status: telemetry?.services.pinecone_vector,
                color: "hover:border-amber-500/40",
              },
            ].map((svc) => (
              <div
                key={svc.id}
                className={cn(
                  "p-4 rounded-2xl bg-zinc-950/40 border border-white/5 flex items-center justify-between group/svc transition-colors",
                  svc.color,
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      svc.status === "Connected"
                        ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                        : "bg-red-500 animate-pulse",
                    )}
                  />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/svc:text-zinc-300 transition-colors leading-none">
                    {svc.id}
                  </span>
                </div>
                <Badge
                  className={cn(
                    "text-[8px] font-black uppercase px-2 py-1",
                    svc.status === "Connected"
                      ? "bg-emerald-500/10 text-emerald-500 font-black border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 animate-pulse",
                  )}
                >
                  {svc.status === "Connected" ? "ACTIVE" : "OFFLINE"}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-4xl bg-emerald-500/3 border border-emerald-500/20 flex items-center justify-between group/ver overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 to-transparent -translate-x-full group-hover/ver:translate-x-full transition-transform duration-1000" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] relative z-10">
              Neural Interface
            </span>
            <Badge
              variant="outline"
              className="text-[11px] font-mono font-black text-zinc-400 relative z-10 px-2 py-0.5 rounded bg-black/40 border border-white/5"
            >
              V5.0.0-PRO
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
