"use client";

import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useMarketStore } from "@/store/useMarketStore";
import {
  Activity,
  Bell,
  Brain,
  MessageSquare,
  Search,
  Settings,
  Shield,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const { user: marketUser } = useMarketStore();
  const { user: authUser, logout } = useAuthStore();
  const { totalUnreadCount } = useChatStore();
  const t = useTranslation();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = authUser?.role === "owner" || authUser?.role === "pengelola";

  const navLinks = [
    { title: t.navigation.dashboard, href: "/dashboard" },
    { title: t.navigation.intelligence, href: "/intelligence", icon: Brain },
    { title: t.navigation.screener, href: "/screener" },
    { title: t.navigation.security_vault, href: "/security", icon: Shield },
    ...(isAdmin ? [{ title: "Admin", href: "/admin", icon: Settings }] : []),
  ];

  // Helper to safely access auth translations
  const authT = (t as any).auth || {
    premium_member: "Premium Member",
    logout: "Logout",
    admin_panel: "Admin Panel",
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        scrolled
          ? "bg-black/60 backdrop-blur-2xl border-b border-white/10 h-16"
          : "bg-transparent border-b border-transparent",
      )}
    >
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] via-transparent to-blue-500/[0.03] pointer-events-none" />

      <div className="flex items-center gap-6 relative z-10 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 shrink-0">
          <SidebarTrigger
            className="hover:bg-white/5 transition-colors h-10 w-10 rounded-xl border border-white/5 bg-zinc-900/40 text-zinc-400 hover:text-white"
            aria-label={t.common.open_sidebar}
          />

          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Expanded Desktop Navigation */}
          <nav
            className="hidden xl:flex items-center gap-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "text-zinc-500 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {link.icon && (
                      <link.icon className="size-3 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                    {link.title}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-emerald-500 rounded-full blur-[2px]" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] lg:w-[280px] h-9 bg-secondary border-none"
              aria-label="Search"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <Kbd>⌘/Ctrl</Kbd>
              <Kbd>K</Kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <div className="hidden lg:flex items-center gap-3 mr-2">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                Server_Cluster
              </span>
              <span className="text-[10px] font-bold text-white tracking-tighter">
                Singapore-01
              </span>
            </div>
            <Activity className="size-4 text-emerald-500/40" />
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-2xl bg-zinc-900/40 border border-white/5">
            <LanguageToggle />
            <ThemeSwitcher />
          </div>

          <div className="h-6 w-px bg-white/5 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Link href="/chat" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-emerald-500/10 group transition-all"
              >
                <MessageSquare className="size-4.5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-black shadow-lg shadow-emerald-500/20">
                    {totalUnreadCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-amber-500/10 group transition-all"
            >
              <Bell className="size-4.5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-11 w-11 p-0 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden group shadow-2xl"
                aria-label={t.common.user_profile}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <User className="size-5 text-zinc-400 group-hover:text-emerald-500 transition-all duration-500" />
                <span className="absolute bottom-1.5 right-1.5 size-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_8px_#10b981]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 mt-3 rounded-[2rem] border-white/10 p-2 shadow-2xl backdrop-blur-3xl bg-zinc-950/90 border-t-emerald-500/20"
              align="end"
            >
              <DropdownMenuLabel className="p-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 relative overflow-hidden group/avatar">
                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                    <User className="size-6 text-emerald-500 relative z-10" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-black tracking-tight leading-none text-white">
                      {authUser?.fullName ||
                        marketUser?.name ||
                        authT.premium_member}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">
                          {authUser?.role || "Neural_Node"}
                        </span>
                      </div>
                      <p className="text-[9px] font-bold text-zinc-600 tracking-tighter truncate max-w-32">
                        {authUser?.email ||
                          marketUser?.email ||
                          "neural_id@ius.ai"}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 my-2" />
              <div className="grid gap-1">
                {[
                  {
                    title: t.navigation.profile,
                    href: "/settings/profile",
                    icon: User,
                    color: "text-blue-400",
                  },
                  ...(isAdmin
                    ? [
                        {
                          title: "Admin Control",
                          href: "/admin",
                          icon: Settings,
                          color: "text-amber-400",
                        },
                      ]
                    : []),
                  {
                    title: t.navigation.security_vault,
                    href: "/security",
                    icon: Shield,
                    color: "text-emerald-400",
                  },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="rounded-2xl p-3 focus:bg-white/5 cursor-pointer group"
                  >
                    <Link href={item.href} className="flex items-center">
                      <div className="size-9 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center mr-3 group-hover:border-emerald-500/30 transition-all shadow-inner">
                        <item.icon
                          className={cn(
                            "size-4 transition-all group-hover:scale-110",
                            item.color,
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[8px] font-medium text-zinc-600 uppercase tracking-widest mt-0.5">
                          Access System
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-white/5 my-2" />
              <DropdownMenuItem
                onClick={logout}
                className="text-rose-500 rounded-2xl p-3 focus:bg-rose-500/10 cursor-pointer font-black text-[10px] uppercase tracking-widest flex items-center group/logout"
              >
                <div className="size-9 rounded-xl bg-rose-500/5 flex items-center justify-center mr-3 border border-rose-500/10 group-hover/logout:bg-rose-500/20 transition-all">
                  <Zap className="size-4 text-rose-500" />
                </div>
                {authT.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
