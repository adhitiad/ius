"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useChatNotifier } from "@/hooks/useChatNotifier";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Global chat notification hook
  useChatNotifier();

  // Inisialisasi QueryClient hanya sekali
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data dianggap stale setelah 1 menit (60 detik)
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <ThemeProvider 
      defaultTheme="dark" 
      enableSystem={false} 
      disableTransitionOnChange
      themes={["light", "dark", "aurora", "cool"]}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
