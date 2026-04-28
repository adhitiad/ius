"use client";
import React, { useState, useEffect } from "react";
import { marketService } from "@/services/marketService";
import { Activity, Cpu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function NeuralPulse() {
  const [pulseData, setPulseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const data = await marketService.getSystemHealth();
        setPulseData(data);
      } catch (err) {
        console.error("Neural pulse failure:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPulse();
    const interval = setInterval(fetchPulse, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !pulseData) return null;

  return (
    <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-black/40 border border-white/5 backdrop-blur-md shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] leading-none mb-1">Neural Core</span>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{pulseData?.status || "CONNECTED"}</span>
        </div>
      </div>

      <div className="h-4 w-px bg-white/10" />

      <div className="flex items-center gap-3">
        <Activity className="size-3.5 text-primary animate-pulse" />
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] leading-none mb-1">Latency</span>
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest font-mono">{pulseData?.brain_latency || "0ms"}</span>
        </div>
      </div>

      <div className="h-4 w-px bg-white/10" />

      <div className="flex items-center gap-3">
        <Cpu className="size-3.5 text-blue-400" />
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] leading-none mb-1">Load</span>
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">{pulseData?.load || "OPTIMAL"}</span>
        </div>
      </div>
    </div>
  );
}
