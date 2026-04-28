"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Search, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/useTranslation"

export function BottomNav() {
  const pathname = usePathname()
  const t = useTranslation()

  const navItems = [
    {
      title: t.navigation.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t.navigation.screener,
      href: "/screener",
      icon: Search,
    },
    {
      title: t.navigation.signals,
      href: "/signals",
      icon: Bell,
    },
    {
      title: t.navigation.profile,
      href: "/settings/profile",
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around bg-zinc-950/80 pb-safe backdrop-blur-2xl border-t border-white/5 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1.5 min-w-[72px] h-full transition-all duration-500",
              isActive ? "text-primary scale-110" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <div className="relative">
              <Icon className={cn("h-5 w-5 transition-transform duration-500", isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]")} />
              {isActive && (
                <div className="absolute -inset-2 bg-primary/10 rounded-full blur-md -z-10 animate-pulse" />
              )}
            </div>
            <span className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "text-primary" : "text-zinc-600")}>
              {item.title}
            </span>
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
