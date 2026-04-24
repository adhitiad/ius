"use client";

import { useMarketSocket } from "@/hooks/useMarketSocket";

export default function MarketDataProvider({ children }: { children: React.ReactNode }) {
  // Initialize the real-time websocket connection
  useMarketSocket();

  return <>{children}</>;
}
