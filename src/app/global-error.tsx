'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ke layanan monitoring (misal Sentry)
    console.error('Fatal Application Error:', error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#020617] text-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-25 animate-pulse"></div>
            <div className="relative bg-[#0f172a] border border-slate-800 p-8 rounded-xl shadow-2xl">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
                Sistem Crash
              </h1>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Terjadi kesalahan fatal yang tidak terduga pada AI Trading Hub. Sinkronisasi data utama terputus.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => reset()}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-900/20"
                >
                  Inisialisasi Ulang Hub
                </Button>
                
                <p className="text-xs text-slate-500 italic">
                  ID Kesalahan: {error.digest || 'UNKNOWN_SIG'}
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="text-sm text-slate-500 hover:text-white transition-colors"
          >
            Selesaikan paksa & muat ulang
          </button>
        </div>
      </body>
    </html>
  );
}
