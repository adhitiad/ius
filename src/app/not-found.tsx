import React from 'react';
import Link from 'next/link';
import { Radar, ArrowLeft, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6 relative overflow-hidden">
      {/* Background Radar Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <Radar className="w-[600px] h-[600px] text-emerald-500/30 animate-[spin_10s_linear_infinite]" />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        {/* Floating Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative animate-bounce duration-[3000ms]">
            <Radar className="w-20 h-20 text-emerald-500 opacity-50" />
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* 404 Text with Crosshair */}
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-9xl font-black tracking-tighter font-outfit bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
            4
          </h1>
          <div className="relative">
            <Crosshair className="w-24 h-24 text-emerald-400 animate-pulse stroke-[3]" />
            <div className="absolute inset-0 bg-emerald-400/20 blur-lg rounded-full animate-pulse translate-y-2"></div>
          </div>
          <h1 className="text-9xl font-black tracking-tighter font-outfit bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
            4
          </h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-emerald-400 tracking-wider uppercase">
            Sinyal Tidak Ditemukan
          </h2>
          <p className="text-slate-400 leading-relaxed text-lg italic font-light tracking-wide">
            "Koordinat URL yang Anda tuju berada di luar jangkauan radar pasar. <br/>
            Frekuensi terputus atau aset telah dihapus dari sistem."
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-8">
          <Button 
            asChild
            className="px-8 py-7 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] group"
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Command Center
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
    </div>
  );
}
