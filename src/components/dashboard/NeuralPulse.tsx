"use client";
import React, { useState, useEffect } from "react";
import { marketService } from "@/services/marketService";
import { Activity, Cpu } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export function NeuralPulse() {
  const [pulseData, setPulseData] = useState<any>(null);
  const [pulseHistory, setPulseHistory] = useState<{ val: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPulse = async () => {
      const startTime = performance.now();
      try {
        const data = await marketService.getSystemHealth();
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        setPulseData({
          ...data,
          real_latency: `${latency}ms`,
          // Ambil angka dari "45.2%"
          ram_load: data.diagnostics?.ram_usage || "0%"
        });
        
        // Update riwayat berdasarkan latensi riil
        setPulseHistory(prev => {
          const newHistory = [...prev, { val: latency }];
          if (newHistory.length > 20) return newHistory.slice(1);
          return newHistory;
        });

      } catch (err) {
        console.error("Neural pulse failure:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPulse();
    const interval = setInterval(fetchPulse, 5000); // Sinkronisasi setiap 5 detik
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
          <span className="text-[10px] font-black text-white uppercase tracking-widest">OPERATIONAL</span>
        </div>
      </div>

      <div className="h-4 w-px bg-white/10" />

      {/* Real Latency Pulse Chart */}
      <div className="h-6 w-16 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pulseHistory}>
            <Line 
              type="monotone" 
              dataKey="val" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-4 w-px bg-white/10" />

      <div className="flex items-center gap-3">
        <Activity className="size-3.5 text-primary animate-pulse" />
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] leading-none mb-1">Latency</span>
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest font-mono">{pulseData?.real_latency || "0ms"}</span>
        </div>
      </div>

      <div className="h-4 w-px bg-white/10" />

      <div className="flex items-center gap-3">
        <Cpu className="size-3.5 text-blue-400" />
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] leading-none mb-1">RAM Load</span>
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">{pulseData?.ram_load || "0%"}</span>
        </div>
      </div>
    </div>
  );
}
