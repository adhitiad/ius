import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BottomNav } from "@/components/BottomNav";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      
      <AppSidebar className="hidden md:flex" />
      <SidebarInset className="bg-transparent border-none">
        <Header />
        <main className="flex-1 relative z-10 p-4 md:p-8 lg:p-12 pb-32">
          <div className="mx-auto w-full max-w-[1400px]">
            {children}
          </div>
        </main>
        <BottomNav />
        
        <footer className="relative z-10 py-20 px-8 border-t border-white/[0.05] bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col gap-4 text-center md:text-left">
               <div className="text-sm font-black uppercase tracking-[0.5em] text-white flex items-center gap-3 justify-center md:justify-start">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                  UIS_OTAK Intelligence
               </div>
               <p className="text-[10px] font-bold text-zinc-600 tracking-[0.3em] uppercase">
                  © {new Date().getFullYear()} Autonomous Security Framework.
               </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex flex-col items-center md:items-end gap-1">
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Processing Engine</span>
                  <span className="text-xs font-black text-white tracking-[0.2em] uppercase italic bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">IUS.AI NEURAL V5</span>
               </div>
               <div className="hidden md:block h-12 w-px bg-white/5" />
               <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
                  <a href="/privacy" className="text-zinc-500 hover:text-emerald-500 transition-all duration-300">Privacy</a>
                  <a href="/terms" className="text-zinc-500 hover:text-emerald-500 transition-all duration-300">Terms</a>
                  <a href="/status" className="text-zinc-500 hover:text-emerald-500 transition-all duration-300">System</a>
               </div>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
