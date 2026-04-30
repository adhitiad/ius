import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paket Berlangganan",
  description: "Pilih paket investasi yang sesuai dengan kebutuhan Anda. Mulai dari free tier hingga akses institusi VIP dengan intelijen AI.",
  openGraph: {
    title: "Pricing & Plans | AI Trading Hub",
    description: "Buka potensi profit maksimal dengan sinyal trading bertenaga AI.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
