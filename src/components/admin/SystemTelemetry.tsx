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
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { SystemHealthResponse } from "@/types/api";
import { toast } from "sonner";

const DEFAULT_TELEMETRY: SystemHealthResponse = {
  status: "unknown",
  uptime: "--:--:--",
  diagnostics: {
    cpu: "Unknown CPU",
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
      { name: "Neon", status: telemetry.services.database_neon, icon: Database },
      { name: "Pinecone", status: telemetry.services.pinecone_vector, icon: Zap },
      { name: "Redis", status: telemetry.services.redis_cloud, icon: HardDrive },
    ],
    [telemetry],
  );

  const handleKillSwitch = () => {
    if (killSwitchStep === 0) {
      setKillSwitchStep(1);
      toast.warning("Konfirmasi 1/2: tekan lagi untuk final warning.");
      return;
    }

    if (killSwitchStep === 1) {
      setKillSwitchStep(2);
      toast.error("Konfirmasi 2/2: tekan sekali lagi untuk eksekusi.");
      return;
    }

    toast.error(
      "Kill switch diminta. Backend endpoint eksekusi belum tersedia, tindakan dihentikan.",
    );
    setKillSwitchStep(0);
  };

  const resetKillSwitch = () => setKillSwitchStep(0);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <div className="bg-zinc-950/90 border border-white/10 p-5 rounded-[2rem] shadow-2xl backdrop-blur-2xl w-[300px] pointer-events-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-2 rounded-full animate-pulse",
                telemetry.status === "operational" ? "bg-emerald-500" : "bg-amber-500",
              )}
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
              System Telemetry
            </span>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase">
            {telemetry.status}
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                <Cpu className="size-2.5" /> CPU
              </div>
              <div className="text-[11px] font-semibold text-zinc-200 leading-tight">
                {telemetry.diagnostics.cpu}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                <HardDrive className="size-2.5" /> RAM
              </div>
              <div className="text-sm font-black font-mono text-white tracking-tight">
                {telemetry.diagnostics.ram_usage}
              </div>
              <div className="text-[9px] text-zinc-600">{telemetry.diagnostics.ram_total}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-2">
            {services.map((service) => {
              const healthy = service.status.toLowerCase() === "connected";
              return (
                <div
                  key={service.name}
                  className="flex justify-between items-center text-[10px] font-bold tracking-tight"
                >
                  <div className="flex items-center gap-2 text-zinc-500">
                    <service.icon className="size-3" /> {service.name}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 uppercase",
                      healthy ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    <div
                      className={cn(
                        "size-1.5 rounded-full",
                        healthy ? "bg-emerald-500" : "bg-rose-500",
                      )}
                    />
                    {service.status}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 flex justify-between items-center opacity-70">
            <span className="text-[8px] font-bold text-zinc-500 uppercase">
              Uptime: {telemetry.uptime}
            </span>
            <span
              className={cn(
                "text-[8px] font-black uppercase tracking-widest",
                telemetry.safety.kill_switch === "ON"
                  ? "text-rose-500"
                  : "text-emerald-500",
              )}
            >
              Kill Switch: {telemetry.safety.kill_switch}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        {killSwitchStep > 0 && (
          <button
            onClick={resetKillSwitch}
            className="h-12 px-5 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest"
          >
            Cancel
          </button>
        )}

        <button
          onClick={handleKillSwitch}
          className={cn(
            "h-12 flex items-center gap-3 px-6 rounded-xl transition-all duration-500 border",
            killSwitchStep === 0 &&
              "bg-rose-950/20 border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white",
            killSwitchStep === 1 && "bg-rose-600 border-rose-500 text-white animate-pulse",
            killSwitchStep === 2 &&
              "bg-rose-800 border-rose-400 text-white shadow-[0_0_35px_rgba(244,63,94,0.55)]",
          )}
        >
          {killSwitchStep === 0 ? (
            <>
              <ShieldAlert className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Kill Switch
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                {killSwitchStep === 1 ? "Confirm" : "Final Confirm"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
