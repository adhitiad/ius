"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-red-500/20 flex items-center justify-center text-red-500 mb-8 mx-auto shadow-lg shadow-red-500/10 border border-red-500/20">
            <AlertTriangle size={40} strokeWidth={1.5} />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              An unexpected error occurred while processing your request. 
              But don&apos;t worry, we&apos;ve been notified.
            </p>
            {error.digest && (
              <p className="mt-4 font-mono text-[10px] text-gray-600 uppercase tracking-widest">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => reset()}
              className="group flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>
            
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-3 bg-white/5 text-white font-bold py-4 px-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
            >
              <Home size={18} />
              Return Home
              <ChevronRight size={16} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500">
              Need immediate assistance? <a href="#" className="text-red-400 hover:underline">Contact Support Team</a>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-700 text-xs font-medium uppercase tracking-[0.2em]">
          Powered by Antigravity AI Infrastructure
        </p>
      </div>
    </div>
  );
}
