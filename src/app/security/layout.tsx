import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";

const SecurityLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SidebarProvider>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)] pointer-events-none" />
        <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

        <AppSidebar className="hidden md:flex" />
        <SidebarInset className="bg-transparent border-none">
          <Header />
          <main className="flex-1 relative z-10 p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1400px]">{children}</div>
          </main>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
      <hr className="border-border" />
      <footer className="w-full max-w-[1400px] mx-auto py-8 px-6 flex justify-between items-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} UIS Brain. All rights reserved.</p>
        <div className="flex gap-4">
          <Link
            href="/security/privacy-policy"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/security/terms-of-service"
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default SecurityLayout;
