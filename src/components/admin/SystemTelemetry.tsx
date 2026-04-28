"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Zap,
  Cpu,
  HardDrive,
  Database,
  ShieldAlert,
  AlertTriangle,
  Activity,
  Server,
  Globe
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { SystemHealthResponse } from "@/types/api";
import { toast } from "sonner";

const DEFAULT_TELEMETRY: SystemHealthResponse = {
  status: "unknown",
  uptime: "--:--:--",
  diagnostics: {
    cpu: "Detecting CPU...",
    ram_total: "0 GB",
    ram_usage: "0%",
    gpu: {
      has_gpu: false,
      gpu_name: "N/A",
      vram_total: "0 GB",
    },
  },
  services: {
    database_neon: "Disconnected",
    redis_cloud: "Disconnected",
    pinecone_vector: "Disconnected",
    external_api: {},
  },
  safety: {
    kill_switch: "OFF",
  },
};

export function SystemTelemetry() {
  const [telemetry, setTelemetry] =
    useState<SystemHealthResponse>(DEFAULT_TELEMETRY);
  const [killSwitchStep, setKillSwitchStep] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchHealth = async () => {
      try {
        const response = await adminService.getSystemHealth();
        if (!mounted) return;
        setTelemetry(response);
      } catch {
        if (!mounted) return;
        setTelemetry(DEFAULT_TELEMETRY);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 12_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const services = useMemo(
    () => [
      { name: "Neon SQL", status: telemetry.services.database_neon, icon: Database },
      { name: "Vector AI", status: telemetry.services.pinecone_vector, icon: Zap },
      { name: "Global Cache", status: telemetry.services.redis_cloud, icon: Globe },
    ],
    [telemetry],
  );

  const handleKillSwitch = () => {
    if (killSwitchStep === 0) {
      setKillSwitchStep(1);
      toast.warning("Confirm Level 1: Re-authenticate to initiate shutdown.");
      return;
    }

    if (killSwitchStep === 1) {
      setKillSwitchStep(2);
      toast.error("FINAL WARNING: Systematic purge will begin on next trigger.");
      return;
    }

    toast.error(
      "Purge sequence initiated. Redirecting to safe-mode protocols...",
    );
    setKillSwitchStep(0);
  };

  const resetKillSwitch = () => setKillSwitchStep(0);

  return (
    <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-6 pointer-events-none">
      <div className="bg-zinc-950/80 border border-white/10 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl w-[320px] pointer-events-auto relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "size-2.5 rounded-full shadow-[0_0_10px]",
                  telemetry.status === "operational" 
                    ? "bg-emerald-500 shadow-emerald-500/50 animate-pulse" 
                    : "bg-amber-500 shadow-amber-500/50",
                )}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                Live Telemetry
              </span>
            </div>
            <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black text-zinc-500 uppercase tracking-widest">
              SECURE
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                <Cpu className="size-3" /> Processor
              </div>
              <div className="text-xs font-black text-white leading-tight truncate">
                {telemetry.diagnostics.cpu}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                <Activity className="size-3" /> Memory
              </div>
              <div className="flex items-baseline gap-1">
                 <span className="text-xl font-mono font-black text-white">{telemetry.diagnostics.ram_usage}</span>
                 <span className="text-[8px] font-bold text-zinc-600">USED</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/5">
            {services.map((service) => {
              const healthy = service.status.toLowerCase() === "connected";
              return (
                <div
                  key={service.name}
                  className="flex justify-between items-center group/item"
                >
                  <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 group-hover/item:text-white transition-colors">
                    <service.icon className="size-3.5 opacity-40" /> {service.name}
                  </div>
                  <div
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest flex items-center gap-2",
                      healthy ? "text-emerald-400" : "text-rose-500",
                    )}
                  >
                    {service.status}
                    <div className={cn("size-1 rounded-full", healthy ? "bg-emerald-500" : "bg-rose-500")} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 flex justify-between items-center opacity-40">
            <div className="flex items-center gap-2">
               <Server className="size-3" />
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">
                 UP: {telemetry.uptime}
               </span>
            </div>
            <div className="h-1 w-12 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pointer-events-auto">
        {killSwitchStep > 0 && (
          <button
            onClick={resetKillSwitch}
            className="h-14 px-8 bg-zinc-950/80 border border-white/10 rounded-[2rem] text-[10px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.3em] backdrop-blur-xl"
          >
            Abort Purge
          </button>
        )}

        <button
          onClick={handleKillSwitch}
          className={cn(
            "h-14 flex items-center gap-4 px-10 rounded-[2rem] transition-all duration-700 border backdrop-blur-xl",
            killSwitchStep === 0 &&
              "bg-rose-950/20 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]",
            killSwitchStep === 1 && "bg-rose-600 border-rose-500 text-white animate-pulse shadow-[0_0_40px_rgba(244,63,94,0.5)]",
            killSwitchStep === 2 &&
              "bg-rose-900 border-rose-400 text-white shadow-[0_0_60px_rgba(244,63,94,0.8)] scale-110",
          )}
        >
          {killSwitchStep === 0 ? (
            <>
              <ShieldAlert className="size-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                System Purge
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="size-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {killSwitchStep === 1 ? "Confirm Shutdown" : "Final Authorization"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
