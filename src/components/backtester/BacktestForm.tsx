"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Calendar, Play, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const backtestSchema = z.object({
  ticker: z.string().min(1, "Ticker harus diisi"),
  startDate: z.string().min(1, "Tanggal mulai harus diisi"),
  endDate: z.string().min(1, "Tanggal selesai harus diisi"),
  strategy: z.string().min(1, "Rencana strategi harus dipilih"),
  initialCapital: z.number().min(1000000, "Modal minimal Rp 1.000.000"),
});

type BacktestFormValues = z.infer<typeof backtestSchema>;

interface BacktestFormProps {
  onRun: (data: BacktestFormValues) => void;
  isLoading?: boolean;
}

export function BacktestForm({ onRun, isLoading }: BacktestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BacktestFormValues>({
    resolver: zodResolver(backtestSchema),
    defaultValues: {
      ticker: "BBCA",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      strategy: "Mean Reversion",
      initialCapital: 10000000,
    },
  });

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 h-full shadow-xl">
      <div className="flex items-center gap-2 mb-8 text-zinc-100">
        <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20">
          <BarChart3 size={20} className="text-blue-400" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Configuration</h2>
      </div>

      <form onSubmit={handleSubmit(onRun)} className="space-y-6">
        {/* Ticker Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Ticker Symbol</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              {...register("ticker")}
              className={cn(
                "w-full bg-zinc-950 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 transition-all",
                errors.ticker ? "border-rose-500/50 focus:ring-rose-500/20" : "border-zinc-800 focus:ring-blue-500/20"
              )}
              placeholder="e.g. BBRI, ASII..."
            />
          </div>
          {errors.ticker && <p className="text-[10px] text-rose-500 mt-1 pl-1">{errors.ticker.message}</p>}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="date"
                {...register("startDate")}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="date"
                {...register("endDate")}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Strategy Choice */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Strategy Type</label>
          <select
            {...register("strategy")}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
          >
            <option value="Mean Reversion">Mean Reversion (RSI/Bollinger)</option>
            <option value="Trend Following">Trend Following (EMA 20/50)</option>
            <option value="Breakout">Channel Breakout</option>
            <option value="Volume Profile">AI Volume Flow Analysis</option>
          </select>
        </div>

        {/* Initial Capital */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Initial Capital (IDR)</label>
          <input
            type="number"
            {...register("initialCapital", { valueAsNumber: true })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {errors.initialCapital && <p className="text-[10px] text-rose-500 mt-1 pl-1">{errors.initialCapital.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300",
            isLoading
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95"
          )}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              <span>Run Simulation</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
