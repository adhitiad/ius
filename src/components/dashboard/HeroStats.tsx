import React from "react";
import { TrendingUp, Activity, Target, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MarketStats } from "@/hooks/useMarketData";
import { cn } from "@/lib/utils";

interface HeroStatsProps {
  stats: MarketStats;
}

export function HeroStats({ stats }: HeroStatsProps) {
  const items = [
    {
      label: "IHSG Hari Ini",
      value: stats.ihsg.value,
      subValue: stats.ihsg.change,
      icon: TrendingUp,
      color: "blue",
      up: stats.ihsg.up,
    },
    {
      label: "Total Sinyal Aktif",
      value: stats.activeSignals.toString(),
      subValue: "+5 baru",
      icon: Activity,
      color: "indigo",
      up: true,
    },
    {
      label: "Akurasi Win-Rate",
      value: stats.winRate,
      subValue: "Global Avg",
      icon: Target,
      color: "emerald",
      up: true,
    },
    {
      label: "Top Sentiment",
      value: stats.topGainerSentiment,
      subValue: "Sektor Bullish",
      icon: Zap,
      color: "amber",
      up: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "relative overflow-hidden p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-all group",
            "animate-fade-in-up fill-mode-both",
            i === 0 && "animate-stagger-1",
            i === 1 && "animate-stagger-2",
            i === 2 && "animate-stagger-3",
            i === 3 && "animate-stagger-4"
          )}
        >
          {/* Background Glow */}
          <div className={cn(
            "absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
            item.color === "blue" && "bg-blue-500",
            item.color === "indigo" && "bg-indigo-500",
            item.color === "emerald" && "bg-emerald-500",
            item.color === "amber" && "bg-amber-500"
          )} />

          <div className="flex justify-between items-start mb-4">
            <div className={cn(
              "p-2.5 rounded-xl bg-zinc-800/50 text-zinc-400 group-hover:scale-110 transition-transform duration-300",
              item.color === "blue" && "group-hover:text-blue-400",
              item.color === "indigo" && "group-hover:text-indigo-400",
              item.color === "emerald" && "group-hover:text-emerald-400",
              item.color === "amber" && "group-hover:text-amber-400"
            )}>
              <item.icon className="w-5 h-5" />
            </div>
            {item.subValue && (
              <div className={cn(
                "flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full",
                item.up ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}>
                {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {item.subValue}
              </div>
            )}
          </div>

          <div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
