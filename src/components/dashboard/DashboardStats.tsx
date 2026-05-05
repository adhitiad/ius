"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  BarChart3,
  Network,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Data simulasi untuk tren indeks
const generateIndexTrend = (isUp: boolean) => {
  return Array.from({ length: 8 }, (_, i) => ({
    value: 50 + (isUp ? i * 2 + Math.random() * 5 : -i * 2 + Math.random() * 5)
  }));
};

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const marketUser = useMarketStore((state) => state.user);
  const authUser = useAuthStore((state) => state.user);
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

  const subData = React.useMemo(() => {
    if (!authUser?.subscriptionExpiresAt) return { percentage: 0, daysLeft: 0 };
    const today = new Date();
    const expiry = new Date(authUser.subscriptionExpiresAt);
    const diffTime = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const percentage = Math.min(Math.max((daysLeft / 30) * 100, 0), 100);
    return { percentage, daysLeft };
  }, [authUser?.subscriptionExpiresAt]);

  const telemetry = stats?.telemetry;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Neural Core Status Bar - Premium Glassmorphism */}
      <motion.div variants={itemVariants}>
        <Card className="glass-effect overflow-hidden relative group rounded-[2rem] border-primary/10">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Activity className="size-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gradient">
                  Neural Core Synopsis
                </h2>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={stats?.synopsis}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-1 italic"
                  >
                    {stats?.synopsis || "Syncing neural cognitive patterns..."}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <Badge
                variant="outline"
                className="bg-zinc-950/60 backdrop-blur-md border-white/5 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 h-auto"
              >
                <div className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Data Synchronized {secondsAgo}s ago
                </span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8 w-full">
        {/* 1. PORTFOLIO PERFORMANCE - Premium Interactive Card */}
        <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4">
          <Card className="glass-effect border-none ring-1 ring-white/5 rounded-[2.5rem] flex flex-col justify-between group relative overflow-hidden transition-all hover:ring-primary/30 h-[300px] shadow-2xl hover:shadow-primary/5">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />
            
            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateIndexTrend(true)}>
                  <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" strokeWidth={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8 relative z-10">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                <DollarSign className="size-8" />
              </div>
              <div className="text-right">
                <CardDescription className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Net Equity Value
                </CardDescription>
                <CardTitle className="text-4xl lg:text-3xl font-black text-white tracking-tighter mt-1">
                  {authUser
                    ? formatCurrency(75200000 + (authUser.returnPercentage || 0) * 1250000)
                    : "Rp 0"}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-0 flex justify-between items-end relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-[11px] font-bold flex items-center gap-1.5 rounded-lg px-3 py-1 transition-colors">
                    <TrendingUp className="size-3.5" />+
                    {authUser?.returnPercentage?.toFixed(2) || "0.00"}%
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
                    Real-time ROR
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 1 }}
                      animate={{ scaleY: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className={cn(
                        "w-1 h-4 rounded-full",
                        i < 4 ? "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-800"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  Node Health
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. MARKET ANALYTICS - Sentiment Card */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4">
          <Card className="glass-effect border-none ring-1 ring-white/5 rounded-[2.5rem] flex flex-col justify-between group relative overflow-hidden h-[300px]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:rotate-12 transition-transform shadow-inner">
                <Zap className="size-8" />
              </div>
              <div className="text-right">
                <CardDescription className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Hybrid Sentiment
                </CardDescription>
                <CardTitle
                  className={cn(
                    "text-3xl font-black tracking-[0.1em] mt-1 italic transition-all duration-500",
                    stats?.compositeSentiment === "ACCUMULATION"
                      ? "text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : stats?.compositeSentiment === "DISTRIBUTION"
                        ? "text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        : "text-amber-400",
                  )}
                >
                  {loading
                    ? "ANALYZING..."
                    : stats?.compositeSentiment === "ACCUMULATION"
                      ? "OPTIMAL"
                      : stats?.compositeSentiment === "DISTRIBUTION"
                        ? "DIVERGENT"
                        : "NEUTRAL"}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-0 space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <span>Weighted Vector RSI</span>
                  <span className={cn("font-mono text-xs", (stats?.avgRSI || 0) > 70 ? "text-rose-500" : (stats?.avgRSI || 0) < 30 ? "text-primary" : "text-amber-500")}>
                    {stats?.avgRSI?.toFixed(2) || "45.00"}
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden ring-1 ring-white/5 p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.avgRSI || 45}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full relative overflow-hidden",
                      (stats?.avgRSI || 0) > 70 ? "bg-rose-500" : (stats?.avgRSI || 0) < 30 ? "bg-primary" : "bg-amber-500"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center gap-4 py-4 border-t border-white/5">
                <div className="flex-1">
                  <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1.5 tracking-wider">
                    Neural Signal Density
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 h-1.5 rounded-full transition-all duration-300",
                          i < (stats?.activeSignals || 5) ? "bg-primary/50" : "bg-zinc-800"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white leading-none">
                    {stats?.activeSignals || 0}
                  </span>
                  <span className="text-[8px] font-black text-muted-foreground block uppercase mt-0.5">Nodes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. SYSTEM TELEMETRY - Tech Focused */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4">
          <Card className="glass-effect border-none ring-1 ring-white/5 rounded-[2.5rem] flex flex-col justify-between group h-[300px]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8">
              <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform shadow-inner">
                <Cpu className="size-8" />
              </div>
              <div className="text-right">
                <CardDescription className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Core Cognitive Load
                </CardDescription>
                <CardTitle className="text-4xl font-black text-white tracking-widest mt-1 italic">
                  {telemetry?.diagnostics.ram_usage || "0%"}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-0 space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors hover:bg-white/[0.04]">
                <div className={cn("p-2.5 rounded-xl transition-all duration-500", telemetry?.diagnostics.gpu.has_gpu ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-zinc-800 text-zinc-600")}>
                  <Layers className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-black text-white uppercase leading-none mb-1.5 tracking-wider">
                    {telemetry?.diagnostics.gpu.has_gpu ? "LSTM ACCELERATION" : "CORE LATE SYNC"}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    {telemetry?.diagnostics.gpu.gpu_name || "CPU OPTIMIZATION ACTIVE"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-blue-500/5 group/metric">
                  <span className="text-[9px] font-black text-zinc-600 uppercase block mb-1 tracking-widest group-hover/metric:text-blue-400/70 transition-colors">Latency</span>
                  <span className="text-sm font-black text-blue-400 font-mono">14ms</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-primary/5 group/metric">
                  <span className="text-[9px] font-black text-zinc-600 uppercase block mb-1 tracking-widest group-hover/metric:text-primary/70 transition-colors">Status</span>
                  <span className="text-sm font-black text-primary uppercase tracking-widest">SYNERGY</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 4. SUBSCRIPTION STATUS - Action Oriented */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4">
          <Card className="glass-effect ring-1 ring-white/5 border-none rounded-[2.5rem] flex flex-col justify-between group h-[300px] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-700 pointer-events-none">
              <Zap className="size-32 rotate-12" />
            </div>
            
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8 relative z-10">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform shadow-inner">
                <ShieldCheck className="size-8" />
              </div>
              <div className="text-right">
                <CardDescription className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Subscription Plan
                </CardDescription>
                <CardTitle className="text-4xl font-black text-white tracking-widest mt-1 italic uppercase drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  {authUser?.plan || "FREE"}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-0 space-y-6 relative z-10">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                <div className={cn("p-2.5 rounded-xl", authUser?.isActive ? "bg-primary/10 text-primary" : "bg-rose-500/10 text-rose-500")}>
                  <Activity className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-black text-white uppercase mb-1 tracking-wider">
                    {authUser?.isActive ? "ACCESS ACTIVE" : "LIMITED ACCESS"}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
                    {authUser?.subscriptionExpiresAt 
                      ? `${subData.daysLeft} DAYS REMAINING` 
                      : "PLEASE UPGRADE PLAN"}
                  </p>
                </div>
              </div>

              {authUser?.subscriptionExpiresAt && (
                <div className="space-y-3 px-1">
                  <div className="flex justify-between items-center text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    <span>Validity Matrix</span>
                    <span className="text-white">{Math.round(subData.percentage)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden ring-1 ring-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${subData.percentage}%` }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className={cn(
                        "h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
                        subData.percentage < 20 && "from-rose-600 to-rose-400 shadow-rose-500/40"
                      )}
                    />
                  </div>
                </div>
              )}

              <Link href="/pricing" className="w-full block">
                <Button className="w-full h-12 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl">
                  Manage Subscription
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* 5. IDX INTELLIGENCE - Large Visualization */}
        <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-8">
          <Card className="glass-effect ring-1 ring-white/5 border-none rounded-[3rem] flex flex-col group relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 p-10 pb-6">
              <div className="flex items-center gap-5">
                <div className={cn("p-5 rounded-[1.5rem] border transition-all duration-500 shadow-2xl", stats?.ihsg.up ? "bg-primary/10 text-primary border-primary/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20")}>
                  <Globe className={cn("size-10", stats?.ihsg.up ? "animate-pulse" : "")} />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black text-white italic tracking-tight">
                    IDX <span className="text-primary not-italic">Matrix</span>
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-1.5">
                    <CardDescription className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      Real-time Analytics Infra
                    </CardDescription>
                    {stats?.ihsg.isFallback && (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] px-2 py-0 font-black">
                        YAHOO FALLBACK
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-right bg-zinc-950/60 backdrop-blur-xl px-8 py-5 rounded-[2rem] ring-1 ring-white/5 shadow-2xl"
              >
                <p className="text-4xl font-black text-white tracking-widest font-mono">
                  {loading ? "??.????" : stats?.ihsg.value}
                </p>
                <div className={cn("flex items-center justify-end gap-1.5 font-black text-sm mt-1.5", stats?.ihsg.up ? "text-primary" : "text-rose-400")}>
                  {stats?.ihsg.up ? <ArrowUpRight className="size-5" /> : <ArrowDownRight className="size-5" />}
                  {stats?.ihsg.change}
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="p-10 grid grid-cols-2 md:grid-cols-4 gap-5">
              {(stats?.majorIndices || []).map((idx, i) => (
                <motion.div
                  key={idx.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -5, ring: "1px solid rgba(16,185,129,0.3)" }}
                  className="p-6 rounded-[2rem] bg-zinc-950/40 border border-white/5 hover:bg-zinc-900/60 transition-all group/idx relative overflow-hidden"
                >
                  <div className="absolute inset-0 z-0 opacity-5 group-hover/idx:opacity-10 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateIndexTrend(idx.up)}>
                        <Area type="monotone" dataKey="value" stroke={idx.up ? "var(--color-primary)" : "#f43f5e"} fill={idx.up ? "var(--color-primary)" : "#f43f5e"} strokeWidth={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover/idx:text-primary transition-colors">
                        {idx.code}
                      </span>
                      {idx.isFallback && <span className="text-[7px] font-black text-amber-500/50 uppercase">YF</span>}
                    </div>
                    <p className="text-2xl font-black text-white mb-3 font-mono tracking-tighter">{loading ? "---" : idx.value}</p>
                    <Badge variant="ghost" className={cn("text-xs font-black p-0 h-auto", idx.up ? "text-primary" : "text-rose-500")}>
                      {idx.up ? "+" : ""}{idx.change}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* 6. SERVICE CONNECTIVITY MESH - Status Indicators */}
        <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4">
          <Card className="glass-effect ring-1 ring-white/5 border-none rounded-[3rem] flex flex-col justify-between p-10 h-full relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 size-64 bg-primary/5 blur-[80px] rounded-full" />
            
            <div className="flex items-center gap-5 mb-12 relative z-10">
              <div className="size-12 rounded-2xl bg-zinc-900/80 ring-1 ring-white/10 flex items-center justify-center shadow-2xl">
                <Network className="size-6 text-primary" />
              </div>
              <CardTitle className="text-sm font-black text-white uppercase tracking-[0.4em] text-gradient">
                Network Mesh
              </CardTitle>
            </div>

            <div className="grid grid-cols-1 gap-4 relative z-10">
              {[
                { id: "Neural Database", status: telemetry?.services.database_neon, icon: Server },
                { id: "Command Core", status: telemetry?.services.redis_cloud, icon: Activity },
                { id: "Vector Sync", status: telemetry?.services.pinecone_vector, icon: Layers },
              ].map((svc) => (
                <motion.div
                  key={svc.id}
                  whileHover={{ x: 10 }}
                  className="p-5 rounded-2xl bg-zinc-950/50 ring-1 ring-white/5 flex items-center justify-between group/svc transition-all hover:ring-primary/20"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("size-2 rounded-full", svc.status === "Connected" ? "bg-primary shadow-[0_0_12px_rgba(16,185,129,0.8)]" : "bg-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.8)]")} />
                    <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest group-hover/svc:text-white transition-colors">
                      {svc.id}
                    </span>
                  </div>
                  <Badge className={cn("text-[9px] font-black uppercase px-3 py-1 rounded-lg", svc.status === "Connected" ? "bg-primary/10 text-primary border-primary/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20")}>
                    {svc.status === "Connected" ? "ACTIVE" : "OFFLINE"}
                  </Badge>
                </motion.div>
              ))}
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="mt-12 p-6 rounded-[2rem] bg-primary/[0.03] ring-1 ring-primary/20 flex items-center justify-between group/ver relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent -translate-x-full group-hover/ver:translate-x-full transition-transform duration-1000" />
              <div className="flex items-center gap-3 relative z-10">
                <BarChart3 className="size-4 text-primary" />
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Neural Interface</span>
              </div>
              <Badge variant="outline" className="text-[11px] font-mono font-black text-zinc-400 bg-black/60 border-white/10 px-3 py-1 rounded-xl">
                V5.0.0-PRO
              </Badge>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
