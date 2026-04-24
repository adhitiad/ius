import React from 'react';
import { Activity } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617]/40 backdrop-blur-md">
      {/* Container untuk Ikon dengan Efek Glow */}
      <div className="relative group mb-8">
        {/* Glow Effect / Ambient Light */}
        <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl animate-pulse group-hover:bg-emerald-500/30 transition-all duration-1000"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/40 to-teal-500/40 rounded-full blur opacity-75 animate-pulse"></div>
        
        {/* Main Icon */}
        <div className="relative bg-[#0f172a] p-6 rounded-full border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <Activity className="w-16 h-16 text-emerald-400 animate-pulse stroke-[1.5]" />
        </div>
      </div>

      {/* Loading Text dengan Animasi */}
      <div className="flex flex-col items-center space-y-2 pointer-events-none">
        <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase animate-in fade-in slide-in-from-bottom-2 duration-1000 font-outfit">
          AI Trading Hub
        </h2>
        <div className="flex items-center gap-2 overflow-hidden">
          <p className="text-emerald-400/80 text-sm font-medium tracking-widest animate-pulse">
            Menyinkronkan Data Pasar
          </p>
          <span className="flex gap-1">
            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></span>
          </span>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-delay:2s]"></div>
    </div>
  );
}
