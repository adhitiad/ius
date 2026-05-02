import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import MarketDataProvider from "@/components/MarketDataProvider";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import { TelegramOnboarding } from "@/components/modals/TelegramOnboarding";
import LanguageHandler from "@/components/LanguageHandler";
import ThemeHandler from "@/components/ThemeHandler";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
  metadataBase: new URL("https://aiuiso.site"),
  title: {
    default: "AI Trading Hub | Platform Intelijen Pasar Masa Depan",
    template: "%s | AI Trading Hub",
  },
  description: "Dapatkan sinyal trading akurat, analisis sentimen pasar, dan intelijen keuangan bertenaga AI secara real-time.",
  keywords: ["AI Trading", "Sinyal Saham", "Analisis Pasar", "Fintech Indonesia", "Trading Bot", "Smart Screener", "UIS-OTAK"],
  authors: [{ name: "UIS-OTAK Team" }],
  creator: "UIS-OTAK",
  publisher: "UIS-OTAK",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://aiuiso.site",
    title: "AI Trading Hub | Platform Intelijen Pasar Masa Depan",
    description: "Transformasi cara Anda trading dengan intelijen AI. Sinyal akurat, data real-time, dan strategi cerdas.",
    siteName: "AI Trading Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Trading Hub Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Trading Hub | Platform Intelijen Pasar Masa Depan",
    description: "Transformasi cara Anda trading dengan intelijen AI. Sinyal akurat dan analisis real-time.",
    images: ["/og-image.png"],
    creator: "@aiuiso",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
      <body className={cn(inter.variable, outfit.variable, geist.variable, "min-h-screen bg-[#020203] font-sans antialiased text-zinc-400 overflow-x-hidden")}>
          <Providers>
            <LanguageHandler />
            <ThemeHandler />
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
