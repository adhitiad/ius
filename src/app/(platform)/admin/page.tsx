"use client";

import { ConfigManagement } from "@/components/admin/ConfigManagement";
import { ExportButtonGroup } from "@/components/admin/ExportButtonGroup";
import { SystemTelemetry } from "@/components/admin/SystemTelemetry";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
import { UserProfile } from "@/types/api";
import {
  Activity,
  Database,
  Lock,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [finance, setFinance] = useState({
    total_revenue: 0,
    api_costs: 0,
    net_profit: 0,
    investment_tier_contribution: {} as Record<string, number>,
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setIsUsersLoading(true);
        const [allUsers, dashboard] = await Promise.all([
          adminService.getAllUsers().catch(() => []),
          adminService.getFinanceDashboard().catch(() => ({
            total_revenue: 0,
            api_costs: 0,
            net_profit: 0,
            investment_tier_contribution: {},
          })),
        ]);

        if (!mounted) return;
        setUsers(allUsers);
        setFinance(dashboard);
      } finally {
        if (mounted) setIsUsersLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const formatIDR = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const paidUsers = useMemo(
    () =>
      users.filter(
        (user) => user.plan === "bisnis" || user.plan === "enterprise",
      ).length,
    [users],
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden aurora">
      <div className="bg-noise absolute inset-0 opacity-[0.03] pointer-events-none" />

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <main className="relative z-10 p-6 lg:p-12 max-w-[1600px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <Lock className="size-3 text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
                Authorized: Owner Command Center
              </span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white italic leading-none">
              Command <span className="text-zinc-700 not-italic">Center</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                v4.0.2-BETA
              </div>
              <p className="text-zinc-500 font-bold text-sm lg:text-base uppercase tracking-tight">
                Intelligence Infrastructure & Financial Oversight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ExportButtonGroup />
            <div className="size-14 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white transition-colors cursor-help">
              <Activity className="size-6" />
            </div>
          </div>
        </div>

        {/* Financial Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              label: "Kekayaan Platform",
              value: formatIDR(finance.total_revenue),
              detail: "Total Revenue Akumulasi",
              icon: Wallet,
              gradient: "from-emerald-500/10 via-transparent to-transparent",
              accent: "text-emerald-400",
              border: "border-emerald-500/20",
            },
            {
              label: "Biaya Operasional",
              value: formatIDR(finance.api_costs),
              detail: "Burn Rate (API + Infrastruktur)",
              icon: TrendingDown,
              gradient: "from-rose-500/10 via-transparent to-transparent",
              accent: "text-rose-400",
              border: "border-rose-500/20",
            },
            {
              label: "Profit Bersih",
              value: formatIDR(finance.net_profit),
              detail: "Laba Bersih Setelah Biaya",
              icon: TrendingUp,
              gradient: "from-blue-500/10 via-transparent to-transparent",
              accent: "text-blue-400",
              border: "border-blue-500/20",
            },
            {
              label: "Pasukan Premium",
              value: `${paidUsers}`,
              detail: `Dari total ${users.length} personil aktif`,
              icon: ShieldCheck,
              gradient: "from-amber-500/10 via-transparent to-transparent",
              accent: "text-amber-400",
              border: "border-amber-500/20",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "group relative bg-zinc-950/40 border p-8 rounded-[2.5rem] backdrop-blur-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl",
                stat.border,
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50",
                  stat.gradient,
                )}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="size-14 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <stat.icon className="size-6" />
                  </div>
                  <div className="h-px w-12 bg-white/5 mt-7" />
                </div>

                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">
                  {stat.label}
                </p>
                <h3
                  className={cn(
                    "text-3xl lg:text-4xl font-black tracking-tighter mb-4",
                    stat.accent,
                  )}
                >
                  {stat.value}
                </h3>
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-tight mt-auto">
                  {stat.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* User Intelligence Section */}
        <div className="bg-zinc-950/60 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

          <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-zinc-900/50 to-transparent relative z-10">
            <div className="flex items-center gap-6">
              <div className="size-16 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Database className="size-8 text-zinc-500" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-white tracking-tighter italic">
                  User <span className="text-zinc-600">Inventory</span>
                </h2>
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.3em]">
                    Neural Intelligence Node Access Control
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="px-6 py-4 rounded-[1.5rem] bg-black/40 border border-white/5 text-center">
                <span className="text-[9px] font-black text-zinc-600 uppercase block mb-1">
                  Active Persistence
                </span>
                <span className="text-xl font-black text-white font-mono">
                  {users.length}
                </span>
              </div>
              <div className="px-6 py-4 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/10 text-center">
                <span className="text-[9px] font-black text-emerald-500/40 uppercase block mb-1">
                  Premium Rate
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {users.length
                    ? Math.round((paidUsers / users.length) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <UserManagementTable
              initialUsers={users}
              isLoading={isUsersLoading}
            />
          </div>
        </div>

        {/* Global System Telemetry */}
        <SystemTelemetry />

        {/* System Configuration (Telegram, Bot IDs, etc) */}
        <ConfigManagement />

        {/* Footer Accent */}
        <div className="pt-12 pb-6 text-center">
          <p className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em]">
            Antigravity Strategic Infrastructure • Secure Connection Optimized
          </p>
        </div>
      </main>
    </div>
  );
}
