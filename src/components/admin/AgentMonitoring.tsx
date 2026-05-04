"use client";

import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
import {
  Activity,
  AlertTriangle,
  ArrowRightLeft,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AgentLog {
  id: number;
  level: string;
  message: string;
  metadata_json: any;
  created_at: string;
}

interface TopPick {
  ticker: string;
  name: string;
  final_intelligence_score: number;
  health_status: string;
  agent_conviction: string;
  price: number;
  change: number;
}

export function AgentMonitoring() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [topPicks, setTopPicks] = useState<TopPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("logs");
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">(
    "daily",
  );
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs, autoScroll, activeTab]);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [logsData, statusData, picksData] = await Promise.all([
        adminService.getAgentLogs(40),
        adminService.getAgentStatus(),
        adminService.getAgentTopPicks(timeframe),
      ]);
      setLogs(logsData);
      setStatus(statusData);
      setTopPicks(picksData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStartAgent = async () => {
    try {
      await adminService.startAgent();
      toast.success("Neural Core Activated", {
        description: "Agen otonom sekarang sedang memindai pasar untuk mencari Alpha.",
      });
      fetchData(true);
    } catch (error) {
      toast.error("Gagal mengaktifkan Agen");
    }
  };

  const handleStopAgent = async () => {
    try {
      await adminService.stopAgent();
      toast.warning("Neural Core Deactivated", {
        description: "Agen telah dihentikan secara manual.",
      });
      fetchData(true);
    } catch (error) {
      toast.error("Gagal menghentikan Agen");
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus seluruh riwayat log patroli?")) return;
    try {
      await adminService.clearAgentLogs();
      setLogs([]);
      toast.success("Memory Purged", {
        description: "Seluruh log aktivitas agen telah dibersihkan dari database.",
      });
    } catch (error) {
      toast.error("Gagal membersihkan log");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 15000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchData(true);
    toast.success("Neural Cache Purged & Synchronized");
  };

  const handleNotifyOwner = async () => {
    try {
      await adminService.notifyLLMMigration();
      toast.success("Notifikasi Terkirim", {
        description: "Owner telah diberitahu mengenai status migrasi LLM via email ai@aiuiso.site & notifikasi sistem.",
      });
    } catch (error) {
      toast.error("Gagal mengirim notifikasi");
    }
  };

  const handlePurgeGroq = async () => {
    if (!confirm("PERINGATAN: Tindakan ini akan menghapus seluruh dependensi Groq secara permanen. Lanjutkan?")) return;
    try {
      await adminService.purgeGroq();
      toast.success("Groq Infrastructure Purged", {
        description: "Infrastruktur Groq telah dihapus secara permanen dari sistem.",
      });
      fetchData(true);
    } catch (error) {
      toast.error("Gagal melakukan purge Groq");
    }
  };

  const getLevelStyles = (level: string) => {
    switch (level.toUpperCase()) {
      case "GOLDEN":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "SUCCESS":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "ERROR":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "WARNING":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level.toUpperCase()) {
      case "GOLDEN":
        return <Zap className="size-3 animate-pulse" />;
      case "SUCCESS":
        return <CheckCircle2 className="size-3" />;
      case "ERROR":
        return <AlertTriangle className="size-3" />;
      default:
        return <Activity className="size-3" />;
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-32 w-full rounded-[2rem] bg-zinc-900/50" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Skeleton className="lg:col-span-3 h-64 rounded-[3rem] bg-zinc-900/50" />
          <Skeleton className="h-64 rounded-[3rem] bg-zinc-900/50" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-[3rem] bg-zinc-900/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* MIGRATION NOTICE */}
      <Alert className="bg-gradient-to-r from-blue-600/20 via-zinc-900/40 to-emerald-600/20 border-white/10 rounded-[2rem] p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -left-24 size-48 bg-blue-500/10 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 size-48 bg-emerald-500/10 blur-[100px]" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 w-full">
          <div className="flex items-center gap-6">
            <div className="size-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <ArrowRightLeft className="size-6 text-blue-400" />
            </div>
            <div>
              <AlertTitle className="text-white font-black italic tracking-tighter text-lg mb-1">
                Status Migrasi LLM: <span className="text-blue-400">DeepSeek-V3 Optimized</span>
              </AlertTitle>
              <AlertDescription className="text-zinc-400 text-xs font-medium">
                Efisiensi biaya +15% & Latensi -30%. Groq (Llama-3) sudah bisa di-purge secara permanen.
              </AlertDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase px-4 h-11"
              onClick={handleNotifyOwner}
            >
              <Mail className="size-3.5 mr-2" /> Hubungi Owner
            </Button>
            <Button
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase px-6 h-11 shadow-lg shadow-blue-500/20"
              onClick={handlePurgeGroq}
            >
              Konfirmasi Purge Groq
            </Button>
          </div>
        </div>
      </Alert>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 bg-zinc-950/60 border-white/10 rounded-[3rem] p-8 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000">
            <ShieldCheck className="size-48 text-emerald-500" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-[1.25rem] bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-0 opacity-20",
                      status?.is_running ? "bg-emerald-500/20" : "bg-rose-500/20",
                    )}
                  />
                  <Activity
                    className={cn(
                      "size-7 relative z-10",
                      status?.is_running ? "text-emerald-500" : "text-rose-500",
                    )}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white italic tracking-tighter leading-none mb-2">
                    {status?.agent_name || "UIS-Autonomous-Alpha"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        status?.is_running
                          ? "bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"
                          : "bg-rose-500",
                      )}
                    />
                    <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.2em]">
                      {status?.is_running ? "Agen Aktif & Memindai Alpha" : "Inti Neural Terputus"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 group/stat transition-colors hover:bg-white/10">
                  <Search className="size-4 text-blue-500" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">
                      Dipindai
                    </p>
                    <p className="text-sm text-white font-black tracking-tight leading-none">
                      {status?.telemetry?.scanned_stocks?.toLocaleString() || "0"}{" "}
                      <span className="text-[10px] text-zinc-600 font-medium">Saham</span>
                    </p>
                  </div>
                </div>
                <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 group/stat transition-colors hover:bg-white/10">
                  <Clock className="size-4 text-emerald-500" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">
                      Sinkronisasi Terakhir
                    </p>
                    <p className="text-sm text-white font-black tracking-tight leading-none">
                      {status?.last_patrol ? new Date(status.last_patrol).toLocaleTimeString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 group/stat transition-colors hover:bg-white/10">
                  <TrendingUp className="size-4 text-amber-500" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">
                      Peluang Hari Ini
                    </p>
                    <p className="text-sm text-white font-black tracking-tight leading-none">
                      {status?.telemetry?.alpha_alerts_today || "0"}{" "}
                      <span className="text-[10px] text-zinc-600 font-medium">Golden</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleManualRefresh}
                disabled={refreshing}
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-2xl px-6 h-14 font-black text-[10px] uppercase tracking-widest"
              >
                <RefreshCw className={cn("size-4 mr-3", refreshing && "animate-spin")} />
                Refresh Data
              </Button>
              <Button
                onClick={status?.is_running ? handleStopAgent : handleStartAgent}
                className={cn(
                  "rounded-2xl px-8 h-14 font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95",
                  status?.is_running
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20",
                )}
              >
                {status?.is_running ? "Hentikan Agen" : "Aktifkan Agen"}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-zinc-950/60 border-white/10 rounded-[3rem] p-8 backdrop-blur-3xl flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute -bottom-10 -right-10 size-32 bg-amber-500/10 blur-3xl rounded-full" />
          <div className="space-y-6 relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Confidence Score</p>
              <div className="flex items-end gap-2">
                <h3 className="text-5xl font-black text-blue-500 italic tracking-tighter leading-none">
                  {status?.telemetry?.confidence_score || "0"}<span className="text-xl">%</span>
                </h3>
                <TrendingUp className="size-5 text-emerald-500 mb-1" />
              </div>
            </div>
            <div className="h-px bg-white/5" />
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Alpha Alerts</p>
              <h3 className="text-5xl font-black text-amber-500 italic tracking-tighter leading-none">
                {status?.telemetry?.alpha_alerts_today || "0"}
              </h3>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Sinyal Golden Proprietary</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="logs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <TabsList className="bg-zinc-950/80 border-white/5 p-1.5 h-14 rounded-2xl">
            <TabsTrigger value="logs" className="px-6 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black">
              Aliran Neural (Logs)
            </TabsTrigger>
            <TabsTrigger value="picks" className="px-6 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black">
              Top 20 Intelligence
            </TabsTrigger>
            <TabsTrigger value="system" className="px-6 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black">
              Konfigurasi Agen
            </TabsTrigger>
          </TabsList>

          {activeTab === "picks" && (
            <div className="flex p-1 bg-zinc-950/80 border border-white/5 rounded-xl">
              {[
                { id: "daily", label: "Harian" },
                { id: "weekly", label: "Mingguan" },
                { id: "monthly", label: "Bulanan" },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    timeframe === tf.id ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white",
                  )}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-zinc-950/60 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative min-h-[500px]">
          <TabsContent value="logs" className="m-0 border-none outline-none">
            <div className="p-8 border-b border-white/5 bg-zinc-900/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-inner">
                  <Terminal className="size-6 text-blue-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter">
                    Neural Stream <span className="text-zinc-600">V3.5</span>
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Log Aktivitas Patroli Otonom Real-Time</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleClearLogs}
                  variant="ghost"
                  className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl"
                >
                  Bersihkan Log
                </Button>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900 border border-white/5">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Auto-Scroll</span>
                  <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
                </div>
              </div>
            </div>

            <ScrollArea ref={scrollRef} className="h-[600px] w-full relative">
              <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent z-20 pointer-events-none animate-[scan_4s_linear_infinite]" />
              <div className="p-8 space-y-4">
                {logs.length === 0 ? (
                  <div className="py-32 flex flex-col items-center justify-center text-center opacity-50">
                    <BrainCircuit className="size-20 text-zinc-800 mb-6 animate-pulse" />
                    <p className="text-zinc-600 font-bold italic text-lg tracking-tight">
                      Inti neural sedang idle. Menunggu urutan patroli...
                    </p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="group flex flex-col md:flex-row items-start gap-6 p-6 rounded-3xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/5 transition-all animate-in fade-in slide-in-from-left-4 duration-500"
                    >
                      <div className="flex items-center gap-4 shrink-0 mt-1">
                        <span className="text-[10px] font-mono text-zinc-600 w-20">
                          {new Date(log.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                        <div
                          className={cn(
                            "px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase flex items-center gap-2.5",
                            getLevelStyles(log.level),
                          )}
                        >
                          {getLevelIcon(log.level)}
                          {log.level}
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="text-[13px] text-zinc-300 font-medium leading-relaxed tracking-tight group-hover:text-white transition-colors">
                          {log.message}
                        </p>
                      </div>

                      {log.metadata_json && (
                        <div className="shrink-0 flex items-center gap-3">
                          {log.metadata_json.ticker && (
                            <Badge
                              variant="outline"
                              className="bg-zinc-900 border-white/10 text-zinc-500 font-black px-3 py-1 text-[10px] rounded-lg"
                            >
                              ${log.metadata_json.ticker}
                            </Badge>
                          )}
                          <div className="size-8 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/5 cursor-pointer">
                            <ChevronRight className="size-4 text-zinc-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="picks" className="m-0 border-none outline-none">
            <div className="p-8 border-b border-white/5 bg-zinc-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-inner">
                  <TrendingUp className="size-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter">
                    Top 20 Inteligensi{" "}
                    <span className="text-zinc-600 uppercase text-xs tracking-widest">
                      {timeframe === "daily" ? "Harian" : timeframe === "weekly" ? "Mingguan" : "Bulanan"}
                    </span>
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Sintesis Alpha Tertinggi dari Agen</p>
                </div>
              </div>

              <div className="flex items-center p-1 bg-black/40 border border-white/5 rounded-2xl">
                <button
                  onClick={() => setTimeframe("daily")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    timeframe === "daily" ? "bg-white/10 text-white shadow-xl" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  Harian
                </button>
                <button
                  onClick={() => setTimeframe("weekly")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    timeframe === "weekly" ? "bg-white/10 text-white shadow-xl" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  Mingguan
                </button>
                <button
                  onClick={() => setTimeframe("monthly")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    timeframe === "monthly" ? "bg-white/10 text-white shadow-xl" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  Bulanan
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {topPicks.length === 0 ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-3xl bg-zinc-900/50" />
                  ))
                ) : (
                  topPicks.map((pick, i) => (
                    <Card
                      key={pick.ticker}
                      className="bg-white/[0.02] border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all group animate-in zoom-in-95 duration-500"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="size-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center font-black text-white italic tracking-tighter shadow-xl">
                          {pick.ticker.substring(0, 4)}
                        </div>
                        <Badge
                          className={cn(
                            "text-[9px] font-black rounded-lg border",
                            pick.agent_conviction === "HIGH"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20",
                          )}
                        >
                          {pick.agent_conviction} CONVICTION
                        </Badge>
                      </div>

                      <div className="space-y-1 mb-4">
                        <h4 className="text-lg font-black text-white italic tracking-tighter leading-none">${pick.ticker}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold truncate uppercase tracking-widest">{pick.name}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Kesehatan</p>
                          <p className={cn("text-xs font-black italic", pick.health_status === "PRIME" ? "text-emerald-500" : "text-amber-500")}>
                            {pick.health_status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Neural Score</p>
                          <p className="text-xs text-white font-black italic">{pick.final_intelligence_score}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="m-0 border-none outline-none">
            <div className="p-12 lg:p-20 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="size-20 text-zinc-800 mb-6" />
              <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2">Kontrol Operasional & Keamanan</h3>
              <p className="text-zinc-600 text-sm max-w-md mx-auto mb-10 font-medium italic">
                Alat konfigurasi agen tingkat lanjut dan manajemen memori untuk inti alpha otonom.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <Card className="p-8 rounded-[2rem] bg-white/[0.02] border-white/5 space-y-6 text-left shadow-2xl">
                  <div>
                    <h4 className="text-white font-black italic tracking-tight text-lg">Neural Memory</h4>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Hapus seluruh riwayat aktivitas</p>
                  </div>
                  <Button
                    onClick={handleClearLogs}
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10"
                  >
                    Purge Memory Cache
                  </Button>
                </Card>

                <Card className="p-8 rounded-[2rem] bg-white/[0.02] border-white/5 space-y-6 text-left shadow-2xl">
                  <div>
                    <h4 className="text-white font-black italic tracking-tight text-lg">Agent Lifecycle</h4>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Kontrol eksekusi otonom</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleStartAgent}
                      disabled={status?.is_running}
                      variant="outline"
                      className="flex-1 h-14 rounded-2xl border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10"
                    >
                      Start
                    </Button>
                    <Button
                      onClick={handleStopAgent}
                      disabled={!status?.is_running}
                      variant="outline"
                      className="flex-1 h-14 rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10"
                    >
                      Stop
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="p-8 bg-zinc-900/40 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] italic">
          Neural Core ID: UIS-ALPHA-V3.82 // Node Terenkripsi
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
              Latensi Log: {status?.telemetry?.latency_ms || "24"}ms
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
              Kesehatan Sinkronisasi: {status?.telemetry?.sync_health || "100"}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
