"use client";

import { useEffect } from "react";
import { useMarketStore } from "@/store/useMarketStore";

export default function LanguageHandler() {
  const language = useMarketStore((state) => state.language);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  return null;
}
