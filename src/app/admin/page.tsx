"use client";

import React, { useEffect, useMemo, useState } from "react";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { SystemTelemetry } from "@/components/admin/SystemTelemetry";
import { ExportButtonGroup } from "@/components/admin/ExportButtonGroup";
import { adminService } from "@/services/adminService";
import { UserProfile } from "@/types/api";
import { Lock, Users, Wallet, TrendingDown, TrendingUp } from "lucide-react";

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
    () => users.filter((user) => user.plan === "bisnis" || user.plan === "enterprise").length,
    [users],
  );

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-[1400px] mx-auto w-full space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
            <Lock className="size-3 text-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
              Owner Tools
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white italic">
            Command <span className="text-zinc-500">Center</span>
          </h1>
          <p className="text-zinc-500 font-medium text-base lg:text-lg">
            Manajemen user, telemetry infrastruktur, dan kontrol finansial platform.
          </p>
        </div>

        <ExportButtonGroup />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Total Revenue",
            value: formatIDR(finance.total_revenue),
            detail: "Ringkasan revenue platform",
            icon: Wallet,
            color: "text-emerald-400",
          },
          {
            label: "API Costs",
            value: formatIDR(finance.api_costs),
            detail: "Pengeluaran API + infra",
            icon: TrendingDown,
            color: "text-rose-400",
          },
          {
            label: "Net Profit",
            value: formatIDR(finance.net_profit),
            detail: "Revenue - burn rate",
            icon: TrendingUp,
            color: "text-blue-400",
          },
          {
            label: "Premium Users",
            value: `${paidUsers}`,
            detail: `Total user: ${users.length}`,
            icon: Users,
            color: "text-amber-300",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-zinc-950/50 border border-white/10 p-6 rounded-3xl backdrop-blur-md"
          >
            <div className="size-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 mb-4">
              <stat.icon className="size-5" />
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <h3 className={`text-2xl font-black tracking-tight ${stat.color}`}>
              {stat.value}
            </h3>
            <p className="text-[10px] text-zinc-500 mt-2">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950/60 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-transparent">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
              <Users className="size-5 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                User Management
              </h2>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                Inline Role/Plan Control
              </p>
            </div>
          </div>
        </div>
        <UserManagementTable initialUsers={users} isLoading={isUsersLoading} />
      </div>

      <SystemTelemetry />
    </div>
  );
}
