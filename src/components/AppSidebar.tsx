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
} from "lucide-react"
import { useChatStore } from "@/store/useChatStore"

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
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
      isActive: pathname === "/chat",
    },
    {
      title: "Market",
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
      title: "Tools",
      url: "#",
      icon: History,
      items: [
        {
          title: t.navigation.backtester,
          url: "/backtester",
        },
        {
          title: "Strategy Builder",
          url: "/strategy-builder",
        },
      ],
    },
  ]

  const navSecondary = [
    {
      title: "Pricing",
      url: "/pricing",
      icon: CreditCard,
    },
    {
      title: t.navigation.admin_panel,
      url: "/admin",
      icon: ShieldCheck,
      roles: ["owner", "pengelola"],
    },
  ]

  const handleLogout = () => {
    logoutAuth()
    logout()
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TrendingUp className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">Antigravity</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">Quantum IUS</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
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
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                      <Link href={item.url} className="relative flex-1">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.title === "Chat" && totalUnreadCount > 0 && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white animate-bounce shadow-sm">
                            {totalUnreadCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {navSecondary
              .filter(item => !item.roles || (user && item.roles.includes(user.role)))
              .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm" isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent">
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-primary">
                  <User className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.fullName || "User"}</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">{user?.role || "Free Plan"}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton 
               onClick={handleLogout}
               className="text-sidebar-foreground hover:text-rose-400 hover:bg-rose-400/10"
             >
               <LogOut className="size-4" />
               <span>Sign Out</span>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
