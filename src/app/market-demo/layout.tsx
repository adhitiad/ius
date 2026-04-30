import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Market Demo",
  description: "Lihat kecanggihan algoritma UIS-OTAK dalam mendeteksi aliran modal Whale secara real-time di Bursa Efek Indonesia.",
  openGraph: {
    title: "Market Intelligence Demo | AI Trading Hub",
    description: "Demo interaktif surveilans pasar modal berbasis AI.",
  },
};

export default function MarketDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
