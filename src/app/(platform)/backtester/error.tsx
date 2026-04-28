'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function BacktesterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Backtester page error:', error);
  }, [error]);

  return (
    <div className="p-8 max-w-400 mx-auto min-h-screen flex items-center justify-center">
      <div className="relative group overflow-hidden rounded-xl border border-red-900/30 bg-[#0f172a] p-8 text-center max-w-md animate-in fade-in duration-500">
        {/* Aksen Aurora Merah untuk Error */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="relative space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-900/20 flex items-center justify-center border border-red-500/30">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">
              Backtester Gagal Dimuat
            </h3>
            <p className="text-sm text-slate-400">
              Terjadi kesalahan saat memuat halaman Strategy Backtester.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="bg-transparent border-slate-800 hover:bg-slate-800 hover:text-white transition-all gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </Button>
          
          {process.env.NODE_ENV === 'development' && (
            <p className="text-[10px] text-red-400 font-mono mt-4 opacity-50 break-words">
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
