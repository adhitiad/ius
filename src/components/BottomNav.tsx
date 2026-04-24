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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 pb-safe backdrop-blur md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "animate-in zoom-in-75 duration-300")} />
            <span className="text-[10px] font-medium leading-none">{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
