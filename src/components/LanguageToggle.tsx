"use client";

import * as React from "react";
import { Languages, Check } from "lucide-react";
import { useMarketStore } from "@/store/useMarketStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { language, setLanguage } = useMarketStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900">
          <Languages className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-400">
        <DropdownMenuItem 
          onClick={() => setLanguage("id")}
          className="flex items-center justify-between cursor-pointer focus:bg-zinc-900 focus:text-white py-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">🇮🇩 Bahasa Indonesia</span>
          </div>
          {language === "id" && <Check className="h-4 w-4 text-blue-500" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className="flex items-center justify-between cursor-pointer focus:bg-zinc-900 focus:text-white py-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">🇺🇸 English</span>
          </div>
          {language === "en" && <Check className="h-4 w-4 text-blue-500" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
