"use client";

import React, { useState, useEffect } from "react";
import { Shield, Lock, Eye, Key, ShieldAlert, ShieldCheck, Fingerprint, Terminal, Wifi, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SecurityPage() {
  const [scanProgress, setScanProgress] = useState(0);
  const [status, setStatus] = useState("ENCRYPTED");

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(p => (p + 1) % 101);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Security Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent animate-scan" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#10b98105,transparent_70%)]" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
        
        {/* Security Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
               <ShieldCheck className="size-4 text-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">
                 Protokol Keamanan Level 5
               </span>
            </div>
            <h1 className="text-8xl font-black tracking-tighter leading-[0.8]">
              Security <span className="text-zinc-800 uppercase italic">Vault</span>
            </h1>
            <p className="text-zinc-600 font-bold text-2xl max-w-2xl leading-tight tracking-tight uppercase">
               Enkripsi data strategi dan pelindungan identitas institusional secara end-to-end.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
             <div className="px-10 py-6 rounded-3xl bg-zinc-900/50 border border-emerald-500/20 flex items-center gap-6 backdrop-blur-3xl shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)]">
                <div className="space-y-1 text-right">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Status Sistem</p>
                   <p className="text-3xl font-black text-emerald-500 italic tracking-tighter">{status}</p>
                </div>
                <div className="size-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-black">
                   <Lock className="size-8" />
                </div>
             </div>
          </div>
        </div>

        {/* Security Monitoring Bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
           
           {/* Active Scanner */}
           <div className="md:col-span-5 p-12 rounded-[4rem] bg-zinc-900/20 border border-white/5 relative overflow-hidden group flex flex-col justify-between h-[600px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b98105,transparent_50%)] animate-pulse" />
              
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <Fingerprint className="size-10 text-emerald-500" />
                    <h2 className="text-3xl font-black italic tracking-tighter">Biometric Scan</h2>
                 </div>
                 <div className="relative size-64 mx-auto">
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full animate-ping" />
                    <div className="absolute inset-4 border-2 border-emerald-500/40 rounded-full animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-6xl font-black italic tracking-tighter text-emerald-500">{scanProgress}%</span>
                    </div>
                    {/* Scanning line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_15px_#10b981] animate-scan-slow" />
                 </div>
              </div>

              <div className="relative z-10 space-y-4">
                 <div className="flex justify-between items-end text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <span>Integritas Paket Data</span>
                    <span className="text-emerald-500 italic">Terverifikasi</span>
                 </div>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: '99.8%' }} />
                 </div>
                 <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest text-center">AES-256-GCM Encryption Active</p>
              </div>
           </div>

           {/* Security Grid Logs */}
           <div className="md:col-span-7 space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { label: "IP ISOLATION", value: "ENABLED", icon: Wifi, desc: "Akses hanya dari jaringan terenkripsi VPN." },
                  { label: "CLOUD PROTECTION", value: "MAXIMUM", icon: Cloud, desc: "Penyebaran redundan di multi-region." }
                ].map((item, i) => (
                  <div key={i} className="p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                     <div className="size-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors mb-8">
                        <item.icon className="size-6" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">{item.label}</p>
                        <p className="text-4xl font-black text-white italic tracking-tighter leading-none mb-4">{item.value}</p>
                        <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-tight leading-relaxed">{item.desc}</p>
                     </div>
                  </div>
                ))}
              </div>

              {/* Terminal Logs */}
              <div className="p-10 rounded-[3.5rem] bg-black border border-white/5 font-mono text-[11px] space-y-3 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Terminal className="size-32" />
                 </div>
                 <p className="text-emerald-500/60">[SYSTEM] Initializing security handshake...</p>
                 <p className="text-zinc-600">[AUTH] User verified via hardware token ID_8821</p>
                 <p className="text-zinc-600">[SHIELD] Deep packet inspection enabled on Node_A</p>
                 <p className="text-emerald-500">[ENCRYPT] All outbound analytics have been obfuscated</p>
                 <p className="text-amber-500/60">[WARN] Attempted unauthorized access from IP 192.162.x.x BLOCKED</p>
                 <div className="pt-4 flex items-center gap-2">
                    <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-zinc-800 uppercase tracking-widest font-black">Monitoring Active...</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Security Features */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { title: "Vault", icon: Lock, status: "Active" },
             { title: "Firewall", icon: Shield, status: "Normal" },
             { title: "Audit", icon: Eye, status: "Logging" },
             { title: "Key Management", icon: Key, status: "Rotated" }
           ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-6 hover:bg-white/[0.04] transition-all">
                 <div className="size-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500">
                    <item.icon className="size-6" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black italic tracking-tighter leading-none mb-1">{item.title}</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{item.status}</p>
                 </div>
              </div>
           ))}
        </section>

      </main>

      <footer className="py-20 px-12 border-t border-white/5 bg-zinc-950 mt-32">
         <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <span className="font-black tracking-tighter text-3xl text-zinc-800 uppercase italic tracking-[0.2em]">SECURITY_PROTOCOL_6</span>
            <div className="flex gap-16">
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Enkripsi</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">TLS 1.3 / AES-256</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Audit Trail</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
