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
    <html lang="id" suppressHydrationWarning>
      <body className={cn(inter.variable, outfit.variable, geist.variable, "min-h-screen bg-background font-sans antialiased selection:bg-blue-500/30")}>
          <Providers>
          <MarketDataProvider>
            <SidebarProvider>
              <AppSidebar className="hidden md:flex" />
              <SidebarInset>
                <Header />
                <main className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6">
                  <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                    {children}
                  </div>
                </main>
                <BottomNav />
              </SidebarInset>
            </SidebarProvider>
          </MarketDataProvider>
        </Providers>
        <TelegramOnboarding />
        <Toaster position="bottom-right" richColors theme="system" />
        <footer className="border-t border-zinc-800 bg-zinc-950/50 py-6 px-4">
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
            <p>© {new Date().getFullYear()} AI Trading Hub. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Ketentuan Umum
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>

  );
}
