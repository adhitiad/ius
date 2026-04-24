"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Sparkles, Snowflake } from "lucide-react"
import { useTheme } from "next-themes"
import { useMarketStore } from "@/store/useMarketStore"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()
  const setStoreTheme = useMarketStore((state) => state.setTheme)

  const handleThemeChange = (theme: "light" | "dark" | "system" | "aurora" | "cool") => {
    setTheme(theme)
    if (theme !== "system") {
      setStoreTheme(theme)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")} className="flex items-center gap-2 py-3 cursor-pointer">
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="flex items-center gap-2 py-3 cursor-pointer">
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")} className="flex items-center gap-2 py-3 cursor-pointer">
          <Monitor className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("aurora")} className="flex items-center gap-2 py-3 cursor-pointer">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span>Aurora</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("cool")} className="flex items-center gap-2 py-3 cursor-pointer">
          <Snowflake className="h-4 w-4 text-blue-400" />
          <span>Cool</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
