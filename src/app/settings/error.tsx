"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Settings page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="relative group overflow-hidden rounded-xl border border-red-900/30 bg-[#0f172a] p-8 text-center max-w-md animate-in fade-in duration-500">
        {/* Aksen Aurora Merah untuk Error */}
        <div className="absolute -inset-1 bg-linear-to-r from-red-500/10 to-orange-500/10 blur opacity-50 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-900/20 flex items-center justify-center border border-red-500/30">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">
              Pengaturan Gagal Dimuat
            </h3>
            <p className="text-sm text-slate-400">
              Terjadi kesalahan saat memuat halaman Settings.
            </p>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="bg-transparent border-slate-800 hover:bg-slate-800 hover:text-white transition-all gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-transparent border-slate-800 hover:bg-slate-800 hover:text-white transition-all gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <p className="text-[10px] text-red-400 font-mono mt-4 opacity-50 wrap-break-word">
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
