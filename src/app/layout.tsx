import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BottomNav } from "@/components/BottomNav";
import ThemeHandler from "@/components/ThemeHandler";
import MarketDataProvider from "@/components/MarketDataProvider";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import { TelegramOnboarding } from "@/components/modals/TelegramOnboarding";


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Trading Hub | Financial Intelligence",
  description: "Platform Intelijen Pasar & Sinyal Trading berbasis AI.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Trading Hub",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="dark">
      <body className={cn(inter.variable, outfit.variable, geist.variable, "min-h-screen bg-[#020203] font-sans antialiased text-zinc-400 overflow-x-hidden")}>
          <ThemeHandler />
          <Providers>
            <MarketDataProvider>
              {children}
            </MarketDataProvider>
          </Providers>
          <TelegramOnboarding />
          <Toaster position="bottom-right" richColors theme="dark" closeButton />
      </body>
    </html>
  );
}
