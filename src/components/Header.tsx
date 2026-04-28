"use client"

import * as React from "react"
import { Moon, Sun, User, Settings, Bell, Search, MessageSquare } from "lucide-react"
import { useMarketStore } from "@/store/useMarketStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useChatStore } from "@/store/useChatStore"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { LanguageToggle } from "@/components/LanguageToggle"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { useTranslation } from "@/hooks/useTranslation"

export function Header() {
  const { user } = useMarketStore()
  const { user: authUser, logout } = useAuthStore()
  const { totalUnreadCount } = useChatStore()
  const t = useTranslation()

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center px-4 bg-background/40 backdrop-blur-2xl border-b border-border/40 relative overflow-hidden transition-all duration-700">
      {/* Dynamic Aurora Glow Effects - More prominent in Aurora/Cool themes */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/20 blur-[100px] animate-aurora pointer-events-none mix-blend-screen opacity-50" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-500/10 blur-[100px] animate-aurora [animation-delay:2s] pointer-events-none mix-blend-screen opacity-50" />

      <div className="flex items-center gap-2 relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
          
          <div className="hidden lg:flex items-center ml-4 gap-3 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-sm">
             <div className="relative size-2">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                <div className="relative size-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">
                IUS_BRAIN::LIVE
             </span>
          </div>

          <div className="ml-4 hidden md:flex items-center">
            <div className="h-6 w-[1px] bg-border/60 mx-2 mr-4" />
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-primary/10 hover:text-primary transition-all rounded-full px-5 text-xs font-semibold uppercase tracking-wider")}>
                    <Link href="/dashboard">
                      {t.navigation.dashboard}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-primary/10 hover:text-primary transition-all rounded-full px-5 text-xs font-semibold uppercase tracking-wider")}>
                    <Link href="/screener">
                      {t.navigation.screener}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          <div className="relative hidden lg:flex items-center group">
            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <Input
              type="search"
              placeholder="Cari Saham atau Sinyal..."
              className="w-[250px] pl-10 pr-12 lg:w-[350px] bg-secondary/30 border-border/40 focus:bg-background/80 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all duration-300 placeholder:text-muted-foreground/50 rounded-2xl h-10 text-sm"
            />
            <div className="absolute right-3 flex items-center gap-1 px-1.5 py-1 rounded-md border border-border/40 bg-background/50 text-[10px] font-bold text-muted-foreground/60 pointer-events-none group-focus-within:border-primary/30 group-focus-within:text-primary transition-all">
              <span className="text-[11px]">⌘</span>
              <span>K</span>
            </div>
            
            {/* search aura */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[18px] blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none -z-10" />
          </div>

          <div className="h-4 w-[1px] bg-border/40 mx-1 hidden sm:block" />

          <div className="flex items-center gap-1.5">
            <LanguageToggle />
            <ThemeSwitcher />
          </div>

          <div className="h-4 w-[1px] bg-border/40 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Link href="/chat" className="relative group">
              <Button variant="ghost" size="icon" className="rounded-xl relative hover:bg-primary/10 transition-all duration-300">
                <MessageSquare className="h-5 w-5 transition-transform group-hover:scale-110" />
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-[9px] font-black text-white shadow-lg border-2 border-background ring-1 ring-red-500/20 animate-in zoom-in duration-300">
                    {totalUnreadCount}
                  </span>
                )}
                <span className="sr-only">Chat</span>
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 transition-all duration-300 group">
              <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-xl overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 border border-border/40 hover:border-primary/30 transition-all duration-300 shadow-sm">
                <div className="flex h-full w-full items-center justify-center bg-background/20 backdrop-blur-sm">
                  <User className="h-5 w-5 text-primary/80" />
                </div>
                {/* Active Status Dot */}
                <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background shadow-sm" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mt-2 rounded-2xl border-border/40 p-2 shadow-2xl backdrop-blur-2xl bg-background/90" align="end" forceMount>
              <DropdownMenuLabel className="p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-primary/20">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold tracking-tight">{authUser?.fullName || user?.name || "Premium Member"}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none mt-0.5">
                      {authUser?.email || user?.email || "verified_user@ius.ai"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40 my-2" />
              <div className="grid gap-1">
                <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-primary/10 transition-colors cursor-pointer group">
                  <Link href="/settings/profile" className="flex items-center w-full">
                    <div className="bg-background/80 p-1.5 rounded-lg mr-3 border border-border/40 group-hover:border-primary/30 transition-colors">
                      <User className="h-4 w-4 text-primary/70" />
                    </div>
                    <span className="text-sm font-medium">{t.navigation.profile}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-primary/10 transition-colors cursor-pointer group">
                  <Link href="/settings/profile" className="flex items-center w-full">
                    <div className="bg-background/80 p-1.5 rounded-lg mr-3 border border-border/40 group-hover:border-primary/30 transition-colors">
                      <Settings className="h-4 w-4 text-primary/70" />
                    </div>
                    <span className="text-sm font-medium">{t.navigation.settings}</span>
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-border/40 my-2" />
              <DropdownMenuItem onClick={logout} className="text-rose-500 rounded-xl p-3 focus:bg-rose-500/10 focus:text-rose-500 transition-colors cursor-pointer font-bold text-sm flex items-center">
                 <div className="bg-rose-500/5 p-1.5 rounded-lg mr-3 border border-rose-500/20">
                   <Moon className="h-4 w-4 rotate-90" />
                 </div>
                 Keluar Sesi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
