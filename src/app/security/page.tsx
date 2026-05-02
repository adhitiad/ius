"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { SystemHealthResponse } from "@/types/api.d";
import {
  Activity,
  Cpu,
  Eye,
  Fingerprint,
  Key,
  Loader2,
  Lock,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SecurityPage() {
  const t = useTranslation();
  const [scanProgress, setScanProgress] = useState(0);
  const [healthData, setHealthData] = useState<SystemHealthResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const { token, user } = useAuthStore();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchHealth = useCallback(async () => {
    if (!token) return;

    try {
      // Backend prefix is /system for health.router
      const res = await fetch(`${apiUrl}/api/v1/system/health`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Health check failed");

      const data = (await res.json()) as SystemHealthResponse;
      setHealthData(data);

      // Add dynamic log entry
      const timestamp = new Date().toLocaleTimeString();
      const newLog = `[${timestamp}] HEALTH_OK: ${data.status.toUpperCase()} | CPU: ${data.diagnostics.cpu_usage} | RAM: ${data.diagnostics.ram_usage}`;
      setLogs((prev) => [newLog, ...prev].slice(0, 15));
    } catch (error) {
      console.error("Failed to fetch health data", error);
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) =>
        [
          `[${timestamp}] ERROR: Neural connection failed. Re-authenticating...`,
          ...prev,
        ].slice(0, 15),
      );
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchHealth();
    const pollInterval = setInterval(fetchHealth, 10000); // Poll every 10s

    const scanInterval = setInterval(() => {
      setScanProgress((p) => (p + 1) % 101);
    }, 150);

    return () => {
      clearInterval(pollInterval);
      clearInterval(scanInterval);
    };
  }, [fetchHealth]);

  const toggleKillSwitch = async () => {
    if (!token || isToggling) return;

    // Role check (backend also enforces this)
    if (user?.role !== "owner" && user?.role !== "pengelola") {
      toast.error(t.security.caution + ": Unauthorized Access Level");
      return;
    }

    setIsToggling(true);
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) =>
      [
        `[${timestamp}] CRITICAL: Initializing Kill Switch Protocol...`,
        ...prev,
      ].slice(0, 15),
    );

    try {
      const res = await fetch(`${apiUrl}/api/v1/system/kill-switch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        toast.success(`Kill Switch: ${data.kill_switch}`);
        fetchHealth();
        setLogs((prev) =>
          [
            `[${timestamp}] SECURE: Kill Switch toggled to ${data.kill_switch}`,
            ...prev,
          ].slice(0, 15),
        );
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (error) {
      toast.error("Connection error during protocol execution");
    } finally {
      setIsToggling(false);
    }
  };

  const isOperational = healthData?.status === "operational";
  const killSwitchStatus = healthData?.safety?.kill_switch || "OFF";

  // Helpers
  const isConnected = (status?: string) => status === "Connected";
  const isPresent = (status?: string) => status === "Present";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent animate-scan" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_60%)]" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1600px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                Protokol Quantum_Vault v2.6
              </span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-none">
              {t.security.title.split(" ")[0]}{" "}
              <span className="text-zinc-800 uppercase italic">
                {t.security.title.split(" ")[1]}
              </span>
            </h1>
            <p className="text-zinc-500 font-medium text-xl max-w-xl leading-tight tracking-tight">
              {t.security.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-6 bg-zinc-900/40 p-2 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl">
            <div className="pl-8 pr-4 py-4 space-y-0.5">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                {t.security.shield_status}
              </p>
              <p
                className={cn(
                  "text-4xl font-black italic tracking-tighter leading-none",
                  isOperational ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {isOperational ? t.security.protected : t.security.caution}
              </p>
            </div>
            <div
              className={cn(
                "size-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-2xl",
                isOperational
                  ? "bg-emerald-500 text-black shadow-emerald-500/20"
                  : "bg-rose-500 text-white shadow-rose-500/20",
              )}
            >
              {loading ? (
                <Loader2 className="size-10 animate-spin" />
              ) : (
                <ShieldCheck className="size-10" />
              )}
            </div>
          </div>
        </div>

        {/* Top Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Biometric & Scanner */}
          <div className="lg:col-span-1 p-10 rounded-[3rem] bg-zinc-900/20 border border-white/5 flex flex-col items-center justify-center gap-8 relative group overflow-hidden h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.02] to-transparent" />
            <div className="relative size-56">
              <div className="absolute inset-0 border-2 border-emerald-500/10 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 border border-emerald-500/20 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Fingerprint className="size-16 text-emerald-500 mb-2 animate-pulse" />
                <span className="text-5xl font-black italic tracking-tighter text-emerald-500">
                  {scanProgress}%
                </span>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">
                  {t.security.authenticating}
                </span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-zinc-400">
                Uptime:{" "}
                <span className="text-emerald-500 font-mono">
                  {healthData?.uptime || "00:00:00"}
                </span>
              </p>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                Active AES-256 Session
              </p>
            </div>
          </div>

          {/* Hardware Diagnostics */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CPU & RAM */}
            <div className="p-10 rounded-[3rem] bg-zinc-900/20 border border-white/5 space-y-8">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Cpu className="size-6" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-xl font-black italic tracking-tighter truncate">
                    {t.security.core_diagnostics}
                  </h3>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest truncate">
                    {healthData?.diagnostics?.cpu || "Hardware Intel"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-zinc-500">CPU LOAD</span>
                    <span className="text-emerald-500">
                      {healthData?.diagnostics?.cpu_usage || "0%"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-1000"
                      style={{ width: healthData?.diagnostics?.cpu_usage || "0%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-zinc-500">
                      RAM USAGE ({healthData?.diagnostics?.ram_total})
                    </span>
                    <span className="text-emerald-500">
                      {healthData?.diagnostics?.ram_usage || "0%"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-1000"
                      style={{
                        width: healthData?.diagnostics?.ram_usage || "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* GPU Section */}
            <div className="p-10 rounded-[3rem] bg-zinc-900/20 border border-white/5 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Zap className="size-24 text-amber-500" />
              </div>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Activity className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tighter">
                    {t.security.neural_engine}
                  </h3>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                    {t.security.gpu_acceleration}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    GPU Status
                  </span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                      healthData?.diagnostics?.gpu?.has_gpu === true
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500",
                    )}
                  >
                    {healthData?.diagnostics?.gpu?.has_gpu === true
                      ? t.security.active
                      : t.security.emulated}
                  </span>
                </div>
                <p className="text-2xl font-black italic tracking-tighter text-white truncate">
                  {healthData?.diagnostics?.gpu?.gpu_name || "CPU Emulation"}
                </p>
                <div className="pt-2">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                    {t.security.vram_available}
                  </p>
                  <p className={cn(
                    "text-lg font-black",
                    healthData?.diagnostics?.gpu?.has_gpu === true ? "text-amber-500" : "text-zinc-700"
                  )}>
                    {healthData?.diagnostics?.gpu?.vram_total || "0 GB"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Terminal Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* API Keys & External */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8">
              <h3 className="text-xl font-black italic tracking-tighter flex items-center gap-3">
                <Key className="size-5 text-zinc-500" />
                {t.security.api_auth_tokens}
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: "GROQ_LLM_KEY",
                    status: healthData?.services?.external_api?.groq_api_key,
                  },
                  {
                    name: "EXA_SEARCH_KEY",
                    status: healthData?.services?.external_api?.exa_api_key,
                  },
                  {
                    name: "PINECONE_VEC_KEY",
                    status:
                      healthData?.services?.external_api?.pinecone_api_key,
                  },
                ].map((key, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5"
                  >
                    <span className="text-[10px] font-black text-zinc-400 font-mono tracking-wider">
                      {key.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "size-1.5 rounded-full",
                          isPresent(key.status)
                            ? "bg-emerald-500"
                            : "bg-rose-500",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          isPresent(key.status)
                            ? "text-emerald-500"
                            : "text-rose-500",
                        )}
                      >
                        {key.status || "Missing"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kill Switch Interactive */}
            <button
              onClick={toggleKillSwitch}
              disabled={isToggling}
              className={cn(
                "w-full text-left p-10 rounded-[3rem] border transition-all duration-500 relative group overflow-hidden",
                killSwitchStatus === "OFF"
                  ? "bg-zinc-900/20 border-white/5 hover:border-zinc-700"
                  : "bg-rose-500/10 border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.1)]",
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black italic tracking-tighter">
                  {t.security.emergency_kill}
                </h3>
                <ShieldAlert
                  className={cn(
                    "size-6 transition-all",
                    killSwitchStatus === "OFF"
                      ? "text-zinc-600"
                      : "text-rose-500 animate-pulse scale-125",
                    isToggling && "animate-spin",
                  )}
                />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight leading-relaxed mb-6">
                {t.security.kill_switch_desc}
              </p>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex-1 h-12 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                    killSwitchStatus === "OFF"
                      ? "bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700"
                      : "bg-rose-500 text-white",
                  )}
                >
                  {isToggling
                    ? t.security.processing
                    : `Status: ${killSwitchStatus === "OFF" ? t.security.standby : t.security.triggered}`}
                </div>
              </div>
              {killSwitchStatus === "ON" && (
                <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none" />
              )}
            </button>
          </div>

          {/* Central Terminal & Services */}
          <div className="lg:col-span-8 space-y-8">
            <div className="p-8 rounded-[3rem] bg-black border border-white/5 relative overflow-hidden group min-h-[400px]">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Terminal className="size-48 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="size-2 rounded-full bg-rose-500/50" />
                    <div className="size-2 rounded-full bg-amber-500/50" />
                    <div className="size-2 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">
                    {t.security.audit_console}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="size-3 text-emerald-500" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                    {t.security.network_secure}
                  </span>
                </div>
              </div>

              <div className="font-mono text-[11px] space-y-2 relative z-10">
                {logs.length === 0 ? (
                  <p className="text-zinc-700 animate-pulse">
                    {t.security.initializing_audit}
                  </p>
                ) : (
                  logs.map((log, i) => (
                    <p
                      key={i}
                      className={cn(
                        "transition-all duration-500",
                        i === 0
                          ? "text-emerald-400"
                          : "text-zinc-600 opacity-80",
                      )}
                    >
                      {log}
                    </p>
                  ))
                )}
                <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">
                      Database Layer
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white italic">
                        Neon_Postgres
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-black",
                          isConnected(healthData?.services?.database_neon)
                            ? "text-emerald-500"
                            : "text-rose-500",
                        )}
                      >
                        {healthData?.services?.database_neon || "---"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">
                      Memory Stream
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white italic">
                        Redis_Cloud
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-black",
                          isConnected(healthData?.services?.redis_cloud)
                            ? "text-emerald-500"
                            : "text-rose-500",
                        )}
                      >
                        {healthData?.services?.redis_cloud || "---"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">
                      Vector Neural
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white italic">
                        Pinecone_DB
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-black",
                          isConnected(healthData?.services?.pinecone_vector)
                            ? "text-emerald-500"
                            : "text-rose-500",
                        )}
                      >
                        {healthData?.services?.pinecone_vector || "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Security Features */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "IP Isolation",
              icon: Wifi,
              value: "Active",
              desc: "Access locked to secure VPN",
            },
            {
              title: "SSL Integrity",
              icon: Lock,
              value: "TLS 1.3",
              desc: "End-to-end tunnel encryption",
            },
            {
              title: "Threat Detection",
              icon: Eye,
              value: "Neural",
              desc: "Real-time pattern analysis",
            },
            {
              title: "Server Node",
              icon: Server,
              value: "Primary",
              desc: "Distributed infrastructure",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center gap-6 group hover:bg-white/[0.04] transition-all"
            >
              <div className="size-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-emerald-500 transition-colors">
                <item.icon className="size-6" />
              </div>
              <div>
                <h3 className="text-sm font-black italic tracking-tighter uppercase">
                  {item.title}
                </h3>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mt-1">
                  {item.value}
                </p>
                <p className="text-[9px] font-bold text-zinc-700 mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="py-20 px-12 border-t border-white/5 bg-black/80 backdrop-blur-3xl">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <Shield className="size-8 text-zinc-800" />
            <span className="font-black tracking-tighter text-3xl text-zinc-800 uppercase italic tracking-[0.2em]">
              Quantum_Vault_Protocol
            </span>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                {t.security.auth_level}
              </span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                {user?.role?.toUpperCase() || "VISITOR"} /{" "}
                {user?.role === "owner"
                  ? "SUPER_ADMIN"
                  : user?.role === "pengelola"
                    ? "ADMINISTRATOR"
                    : "OPERATOR"}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                {t.security.system_time}
              </span>
              <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono">
                {new Date().toISOString()}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
