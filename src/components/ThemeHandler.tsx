"use client";

import { useEffect } from "react";
import { useMarketStore } from "@/store/useMarketStore";

export default function ThemeHandler() {
  const theme = useMarketStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    // Hapus semua class tema sebelum menambahkan yang baru
    root.classList.remove("light", "dark", "aurora", "cool");
    root.classList.add(theme);
    
    // Financial apps usually look better with a slight blue/gray tint in dark mode
    if (theme === "dark") {
      document.body.style.backgroundColor = "#020617"; // zinc-950
    } else if (theme === "aurora") {
      document.body.style.backgroundColor = "oklch(0.12 0.03 260)";
    } else if (theme === "cool") {
      document.body.style.backgroundColor = "oklch(0.15 0.02 240)";
    } else {
      document.body.style.backgroundColor = "#ffffff";
    }
  }, [theme]);

  return null;
}
