"use client";

import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
import {
  AlertCircle,
  Brain,
  Cpu,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function InfrastructureIntelligence() {
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const runAudit = async () => {
    try {
      setLoading(true);
      const result = await adminService.simulateIntelligenceAudit();
      setAuditResult(result.audit_result);
      toast.success("Intelligence Audit Completed");
    } catch (error) {
      toast.error("Failed to run infrastructure audit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950/60 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-zinc-900/50 to-transparent relative z-10">
        <div className="flex items-center gap-6">
          <div className="size-16 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Brain className="size-8 text-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tighter italic">
              System <span className="text-zinc-600">Intelligence</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.3em]">
                Neural Infrastructure Self-Auditing
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={runAudit}
          disabled={loading}
          className="group/btn relative px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          <div className="relative flex items-center gap-3">
            {loading ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Cpu className="size-4" />
            )}
            {loading ? "Analysing..." : "Run Infrastructure Audit"}
          </div>
        </Button>
      </div>

      <div className="p-8 md:p-12 relative z-10">
        {!auditResult ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <AlertCircle className="size-10 text-zinc-700" />
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-zinc-400 mb-2">
                Belum ada Audit yang Berjalan
              </h3>
              <p className="text-sm text-zinc-500">
                Gunakan tombol di atas untuk memerintahkan Neural Core melakukan
                audit mandiri terhadap ketergantungan API Groq.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-4 duration-1000 space-y-12">
            {/* Status Header */}
            <div className="flex flex-wrap items-center gap-4">
              <div
                className={cn(
                  "px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                  auditResult.status === "MIGRATION_RECOMMENDED"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
                )}
              >
                <Zap className="size-3" />
                Status: {auditResult.status.replace("_", " ")}
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Latensi: {auditResult.metrics.avg_latency}s
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Stabilitas Swarm: {auditResult.metrics.hf_swarm_stability * 100}
                %
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pros */}
              <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 space-y-6">
                <div className="flex items-center gap-3 text-emerald-400 font-black text-sm uppercase tracking-tighter">
                  <TrendingUp className="size-5" /> Keunggulan Migrasi (+)
                </div>
                <ul className="space-y-4">
                  {auditResult.recommendation.details.pros.map(
                    (pro: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-zinc-300">
                        <div className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {pro}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-8 rounded-[2rem] bg-rose-500/5 border border-rose-500/10 space-y-6">
                <div className="flex items-center gap-3 text-rose-400 font-black text-sm uppercase tracking-tighter">
                  <AlertCircle className="size-5" /> Risiko & Kendala (-)
                </div>
                <ul className="space-y-4">
                  {auditResult.recommendation.details.cons.map(
                    (con: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-zinc-300">
                        <div className="size-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        {con}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            {/* Recommendation Summary */}
            <div className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <ShieldCheck className="size-20 text-white/5" />
              </div>
              <div className="max-w-2xl space-y-4">
                <h3 className="text-2xl font-black text-white italic tracking-tighter">
                  {auditResult.recommendation.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {auditResult.recommendation.summary}
                </p>
              </div>

              <div className="mt-10 flex gap-4">
                <Button
                  onClick={() =>
                    toast.success("Migrasi Sedang Diproses (Simulation)")
                  }
                  className="px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  Eksekusi Migrasi Sekarang
                </Button>
                <button className="px-10 py-5 bg-zinc-800 text-zinc-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:text-white transition-colors">
                  Tunda Analisis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
