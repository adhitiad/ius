"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useMarketStore } from "@/store/useMarketStore";
import { 
  CreditCard, 
  Calendar, 
  BadgeCheck, 
  AlertCircle, 
  ArrowUpCircle,
  History,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentModal from "@/components/pricing/PaymentModal";
import { type PlanType } from "@/lib/rbac";

const PLAN_LABELS: Record<PlanType, string> = {
  free: "Basic",
  pro: "Pro",
  bisnis: "Bisnis",
  enterprise: "Enterprise",
  owner: "Owner",
  pengelola: "Pengelola",
};

const PLAN_PRICES: Record<PlanType, string> = {
  free: "Free",
  pro: "IDR 149k",
  bisnis: "IDR 499k",
  enterprise: "Custom",
  owner: "Custom",
  pengelola: "Custom",
};

const BillingPage = () => {
  const { user: marketUser, updateSubscription } = useMarketStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sub = marketUser?.subscription || {
    tier: "free" as const,
    status: "active",
    expiryDate: null
  };
  const planLabel = PLAN_LABELS[sub.tier];
  const planPrice = PLAN_PRICES[sub.tier];

  const formateDate = (dateStr: string | null) => {
    if (!dateStr) return "Lifetime";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRenew = () => {
    setIsModalOpen(true);
  };

  const confirmUpgrade = () => {
    updateSubscription(sub.tier);
    setIsModalOpen(false);
    // Add success notification logic here if needed
  };

  const invoices = [
    { id: "INV-2024-001", date: "2024-03-22", amount: "IDR 149,000", status: "Paid" },
    { id: "INV-2024-002", date: "2024-02-22", amount: "IDR 149,000", status: "Paid" },
    { id: "INV-2024-003", date: "2024-01-22", amount: "IDR 149,000", status: "Paid" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
            <p className="text-gray-400">Manage your plan, billing information and view invoices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Current Plan Card */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-700 animate-stagger-1 fill-mode-both">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-gray-400 text-sm font-medium mb-1">Current Plan</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-white">{planLabel}</span>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                        {sub.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
                    <BadgeCheck size={28} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Calendar size={18} className="text-blue-400" />
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Next Billing Date</p>
                      <p className="text-sm text-white">{formateDate(sub.expiryDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <CreditCard size={18} className="text-blue-400" />
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Payment Method</p>
                      <p className="text-sm text-white">•••• 4242</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleRenew}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 transition-all active:scale-95"
                  >
                    <ArrowUpCircle size={18} />
                    Upgrade / Renew Plan
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-all active:scale-95">
                    Cancel Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-700 animate-stagger-2 fill-mode-both">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                  <AlertCircle size={20} />
                </div>
                <h3 className="text-white font-bold mb-2">Usage Limit</h3>
                <p className="text-xs text-blue-200/60 leading-relaxed mb-6">
                  You have used 85% of your AI signal scanning quota for this month.
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-blue-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-blue-400">
                  <span>850 / 1000 SCAN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice History */}
          <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 animate-stagger-3 fill-mode-both">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <History size={20} className="text-gray-400" />
              <h3 className="text-lg font-bold text-white">Billing History</h3>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b border-white/5">
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Billing Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((inv, i) => (
                    <tr 
                      key={inv.id} 
                      className={cn(
                        "text-sm text-gray-300 hover:bg-white/5 transition-colors group",
                        "animate-in fade-in slide-in-from-right-2 duration-500 fill-mode-both"
                      )}
                      style={{ animationDelay: `${(i + 1) * 100}ms` }}
                    >
                      <td className="px-6 py-4 text-white font-medium">{inv.id}</td>
                      <td className="px-6 py-4">{inv.date}</td>
                      <td className="px-6 py-4">{inv.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs text-nowrap">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white transition-all text-gray-400 active:scale-90">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tier={planLabel}
        price={planPrice}
        onConfirm={confirmUpgrade}
      />
    </div>
  );
};

export default BillingPage;
