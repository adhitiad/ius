"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Search,
  History,
  Zap,
  ShieldCheck,
  CreditCard,
  Settings,
  TrendingUp,
  LogOut,
  ChevronRight,
  User,
  MessageSquare,
  Brain,
  Shield,
  Send,
  Sparkles,
} from "lucide-react"
import { useChatStore } from "@/store/useChatStore"
import { motion, AnimatePresence } from "framer-motion"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useMarketStore } from "@/store/useMarketStore"
import { useAuthStore } from "@/store/useAuthStore"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { logout } = useMarketStore()
  const { user, logout: logoutAuth } = useAuthStore()
  const { totalUnreadCount } = useChatStore()
  const t = useTranslation()

  const navMain = [
    {
      title: t.navigation.dashboard,
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      title: t.navigation.intelligence,
      url: "/intelligence",
      icon: Brain,
      isActive: pathname.startsWith("/intelligence"),
    },
    {
      title: "Neural Picks",
      url: "/intelligence/top-picks",
      icon: Sparkles,
      isActive: pathname === "/intelligence/top-picks",
    },
    {
      title: t.navigation.chat,
      url: "/chat",
      icon: MessageSquare,
      isActive: pathname === "/chat",
      badge: totalUnreadCount > 0 ? totalUnreadCount : null,
    },
    {
      title: t.navigation.market,
      url: "#",
      icon: Search,
      items: [
        {
          title: t.navigation.screener,
          url: "/screener",
        },
        {
          title: t.navigation.signals,
          url: "/signals",
        },
      ],
    },
    {
      title: t.navigation.tools,
      url: "#",
      icon: History,
      items: [
        {
          title: t.navigation.backtester,
          url: "/backtester",
        },
        {
          title: t.navigation.strategy_builder,
          url: "/strategy-builder",
        },
      ],
    },
  ]

  const navSecondary = [
    {
      title: t.navigation.security_vault,
      url: "/security",
      icon: Shield,
    },
    {
      title: t.navigation.pricing,
      url: "/pricing",
      icon: CreditCard,
    },
    {
      title: t.navigation.admin_panel,
      url: "/admin",
      icon: ShieldCheck,
      roles: ["owner", "pengelola"],
    },
    {
      title: t.navigation.telegram_alerts,
      url: "/admin#telegram-config",
      icon: Send,
      roles: ["owner"],
    },
  ]

  const handleLogout = () => {
    logoutAuth()
    logout()
  }

  return (
    <Sidebar 
      variant="inset" 
      className="border-r border-white/5 bg-zinc-950/20 backdrop-blur-xl" 
      {...props}
    >
      <SidebarHeader className="p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link href="/dashboard" className="group">
                <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-700 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/20">
                  <TrendingUp className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-black text-white uppercase tracking-[0.2em]">Antigravity</span>
                  <span className="truncate text-[10px] font-bold text-primary/70 uppercase tracking-widest mt-0.5">Quantum Neural Core</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">
            {t.navigation.platform}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {item.items ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className="h-11 rounded-xl hover:bg-white/5 transition-all group-data-[state=open]/collapsible:bg-white/[0.03]"
                        >
                          {item.icon && <item.icon className="size-4.5 text-zinc-500 group-hover:text-primary transition-colors" />}
                          <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">{item.title}</span>
                          <ChevronRight className="ml-auto size-4 text-zinc-600 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 border-l border-white/5 pl-4 mt-1 gap-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url} className="h-9 rounded-lg hover:bg-white/5">
                                <Link href={subItem.url} className="text-[11px] font-medium text-zinc-500 hover:text-white transition-colors">
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title} 
                      isActive={item.isActive}
                      className={cn(
                        "h-11 rounded-xl transition-all duration-300 relative group/btn overflow-hidden",
                        item.isActive 
                          ? "bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                          : "hover:bg-white/5 text-zinc-400 hover:text-white"
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        {item.icon && <item.icon className={cn("size-4.5 transition-transform duration-500", item.isActive ? "scale-110" : "group-hover/btn:scale-110 group-hover/btn:text-primary")} />}
                        <span className="text-xs font-bold uppercase tracking-wider">{item.title}</span>
                        
                        {item.isActive && (
                          <motion.div 
                            layoutId="sidebarActive"
                            className="absolute left-0 w-1 h-5 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]" 
                          />
                        )}

                        <AnimatePresence>
                          {item.badge && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-lg bg-primary px-1.5 text-[9px] font-black text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            >
                              {item.badge}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">
            {t.navigation.management}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navSecondary
              .filter(item => !item.roles || (user && item.roles.includes(user.role)))
              .map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      size="sm" 
                      isActive={isActive}
                      className={cn(
                        "h-10 rounded-xl transition-all duration-300",
                        isActive ? "bg-white/5 text-white ring-1 ring-white/10" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="size-4 opacity-50 group-hover:opacity-100" />
                        <span className="text-[11px] font-semibold">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="p-4 rounded-[1.5rem] bg-zinc-900/40 ring-1 ring-white/5 backdrop-blur-md">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="hover:bg-transparent p-0 h-auto">
                <div className="flex items-center gap-3">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/5 shadow-inner">
                    <User className="size-5 text-zinc-500" />
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-xs font-black text-white uppercase tracking-wider">{user?.fullName || "Neural_Node"}</span>
                    <span className="truncate text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{user?.role || "Free Access"}</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem className="mt-4">
              <Button 
                variant="ghost"
                onClick={handleLogout}
                className="w-full h-10 justify-start px-3 rounded-xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all group/logout"
              >
                <LogOut className="size-4 mr-3 transition-transform group-hover/logout:-translate-x-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.navigation.sign_out}</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
