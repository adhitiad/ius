"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  Zap, 
  Settings, 
  Menu, 
  X,
  CreditCard,
  TrendingUp,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/screener", label: "Screener", icon: Search },
  { href: "/backtester", label: "Backtester", icon: BarChart3 },
  { href: "/signals", label: "Signals", icon: Zap },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/settings/billing", label: "Billing", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useMarketStore();
  const { user: authUser, logout: logoutAuth } = useAuthStore();

  const handleLogout = async () => {
    logoutAuth();
    logout();
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 md:hidden hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-md",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full px-4 py-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Antigravity
            </span>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-200"
                  )} />
                  <span className="font-medium text-[15px]">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="px-3 py-4 rounded-xl bg-gradient-to-b from-zinc-900/50 to-zinc-950 border border-zinc-800/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-400">
                  {authUser?.fullName?.substring(0, 2).toUpperCase() || "JD"}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-200 truncate max-w-[120px]">
                    {authUser?.fullName || "John Doe"}
                  </p>
                  <p className="text-[10px] text-zinc-500">{authUser ? "Active Sessions" : "Pro Trader"}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-zinc-100 hover:bg-white text-black rounded-lg transition-colors">
                  <CreditCard className="w-3.5 h-3.5" />
                  Dukung Kami
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-400/5 hover:border-rose-400/20 rounded-lg transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
