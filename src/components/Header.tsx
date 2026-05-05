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
  LayoutDashboard,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { user: marketUser } = useMarketStore();
  const { user: authUser, logout } = useAuthStore();
  const { totalUnreadCount } = useChatStore();
  const t = useTranslation();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = authUser?.role === "owner" || authUser?.role === "pengelola";

  const navLinks = [
    { title: t.navigation.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { title: t.navigation.intelligence, href: "/intelligence", icon: Brain },
    { title: t.navigation.screener, href: "/screener", icon: Activity },
    { title: t.navigation.security_vault, href: "/security", icon: Shield },
    ...(isAdmin ? [{ title: "Admin", href: "/admin", icon: Settings }] : []),
  ];

  const authT = (t as any).auth || {
    premium_member: "Premium Member",
    logout: "Logout",
    admin_panel: "Admin Panel",
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-black/40 backdrop-blur-3xl border-b border-white/5 h-16 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "bg-transparent border-b border-transparent h-20",
      )}
    >
      {/* Decorative Glows */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-blue-500/[0.02] pointer-events-none" />
      
      <div className="flex h-full items-center px-6 lg:px-10 relative z-10 w-full max-w-[1800px] mx-auto gap-8">
        <div className="flex items-center gap-4 shrink-0">
          <SidebarTrigger
            className="hover:bg-white/5 transition-all duration-300 h-10 w-10 rounded-2xl border border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white active:scale-95"
            aria-label={t.common.open_sidebar}
          />

          <Separator orientation="vertical" className="h-4 bg-white/10" />

          {/* Expanded Desktop Navigation - Modern Glass Style */}
          <nav
            className="hidden xl:flex items-center gap-2 p-1.5 rounded-[1.25rem] bg-zinc-950/20 ring-1 ring-white/5 backdrop-blur-sm"
            role="navigation"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "px-4 h-9 text-[11px] font-black uppercase tracking-widest transition-all duration-500 rounded-xl relative overflow-hidden",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "text-zinc-500 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {link.icon && (
                      <link.icon className={cn("size-3.5 mr-2 transition-transform duration-500", isActive ? "scale-110" : "opacity-40 group-hover:opacity-100 group-hover:scale-110")} />
                    )}
                    {link.title}
                    
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full blur-[2px]"
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 hidden md:flex max-w-md relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Neural Matrix Search..."
            className="pl-10 pr-16 w-full h-11 bg-zinc-950/40 border-white/5 focus:border-primary/30 rounded-2xl text-xs font-medium placeholder:text-zinc-700 focus:ring-0 transition-all backdrop-blur-md"
            aria-label="Search"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Kbd className="bg-zinc-900 border-white/5 text-[9px] text-zinc-500 px-1.5 py-0.5">⌘</Kbd>
            <Kbd className="bg-zinc-900 border-white/5 text-[9px] text-zinc-500 px-1.5 py-0.5">K</Kbd>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 ml-auto">
          {/* Telemetry Status */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-2xl bg-zinc-950/40 ring-1 ring-white/5 backdrop-blur-md">
            <div className="flex flex-col items-end">
              <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Cluster_Status
              </span>
              <span className="text-[9px] font-black text-white tracking-widest italic">
                Singapore-01
              </span>
            </div>
            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Cpu className="size-4 text-primary animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950/40 border border-white/5 backdrop-blur-md">
            <LanguageToggle />
            <ThemeSwitcher />
          </div>

          <div className="flex items-center gap-2">
            <Link href="/chat" className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group active:scale-95 shadow-xl"
              >
                <MessageSquare className="size-5 text-zinc-500 group-hover:text-primary transition-all" />
                <AnimatePresence>
                  {totalUnreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    >
                      {totalUnreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 group transition-all active:scale-95 shadow-xl"
            >
              <Bell className="size-5 text-zinc-500 group-hover:text-amber-500 transition-all" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 p-0 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden group shadow-2xl active:scale-95"
                aria-label={t.common.user_profile}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <User className="size-6 text-zinc-500 group-hover:text-white transition-all duration-500 group-hover:scale-110" />
                </div>
                <span className="absolute bottom-2 right-2 size-3 rounded-full bg-primary border-2 border-zinc-950 shadow-[0_0_10px_var(--color-primary)]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-80 mt-4 rounded-[2.5rem] border-white/10 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl bg-zinc-950/90 border-t-primary/20"
              align="end"
              sideOffset={12}
            >
              <DropdownMenuLabel className="p-5">
                <div className="flex items-center gap-5">
                  <div className="size-14 rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center border border-white/10 relative overflow-hidden group/avatar ring-1 ring-white/5">
                    <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                    <User className="size-7 text-primary relative z-10" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-base font-black tracking-tight leading-none text-white italic">
                      {authUser?.fullName || marketUser?.name || authT.premium_member}
                    </p>
                    <div className="flex flex-col gap-1.5 mt-2.5">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-[8px] font-black uppercase px-2 py-0.5 rounded-lg">
                          {authUser?.plan || "Free"}
                        </Badge>
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                          {authUser?.role || "Neural_Node"}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-500 tracking-tight truncate max-w-[140px]">
                        {authUser?.email || marketUser?.email || "neural_id@ius.ai"}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              <div className="grid gap-1.5 px-1 py-2">
                {[
                  {
                    title: t.navigation.profile,
                    href: "/settings/profile",
                    icon: User,
                    color: "text-blue-400",
                    desc: "System Identity"
                  },
                  ...(isAdmin
                    ? [
                        {
                          title: "Admin Control",
                          href: "/admin",
                          icon: Settings,
                          color: "text-amber-400",
                          desc: "Core Access"
                        },
                      ]
                    : []),
                  {
                    title: t.navigation.security_vault,
                    href: "/security",
                    icon: Shield,
                    color: "text-primary",
                    desc: "Encrypted Node"
                  },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="rounded-2xl p-3 focus:bg-white/5 cursor-pointer group transition-all"
                  >
                    <Link href={item.href} className="flex items-center">
                      <div className="size-11 rounded-[1.25rem] bg-zinc-900 ring-1 ring-white/5 flex items-center justify-center mr-4 group-hover:ring-primary/40 transition-all shadow-inner">
                        <item.icon
                          className={cn(
                            "size-5 transition-all duration-500 group-hover:scale-110",
                            item.color,
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-zinc-300 group-hover:text-white transition-colors uppercase tracking-wider">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-1">
                          {item.desc}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              <div className="p-1">
                <DropdownMenuItem
                  onClick={logout}
                  className="text-rose-500 rounded-[1.5rem] p-4 focus:bg-rose-500/10 cursor-pointer font-black text-[11px] uppercase tracking-[0.3em] flex items-center group/logout transition-all"
                >
                  <div className="size-10 rounded-[1rem] bg-rose-500/10 flex items-center justify-center mr-4 border border-rose-500/10 group-hover/logout:bg-rose-500/30 transition-all shadow-lg shadow-rose-500/5">
                    <Zap className="size-4 text-rose-500" />
                  </div>
                  {authT.logout}
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
