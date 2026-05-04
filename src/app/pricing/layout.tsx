import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paket Berlangganan",
  description:
    "Pilih paket investasi yang sesuai dengan kebutuhan Anda. Mulai dari free tier hingga akses institusi VIP dengan intelijen AI.",
  openGraph: {
    title: "Pricing & Plans | AI Trading Hub",
    description:
      "Buka potensi profit maksimal dengan sinyal trading bertenaga AI.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {" "}
      <SidebarProvider>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)] pointer-events-none" />
        <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

        <AppSidebar className="hidden md:flex" />
        <SidebarInset className="bg-transparent border-none">
          <Header />
          <main className="flex-1 relative z-10 p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1400px]">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
