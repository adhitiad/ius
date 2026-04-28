"use client";

import React from "react";

export function ChartSkeleton() {
  return (
    <div className="w-full h-[500px] bg-zinc-950/50 backdrop-blur-md rounded-3xl border border-zinc-800 p-6 shadow-2xl relative overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-4 bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-12 bg-zinc-900 border border-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-16 bg-zinc-900 rounded animate-pulse" />
          <div className="h-4 w-16 bg-zinc-900 rounded animate-pulse" />
        </div>
      </div>

      {/* Main Chart Body Skeleton */}
      <div className="relative h-[300px] w-full mt-12 flex items-end justify-between gap-2 px-4">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="w-full bg-zinc-900/40 rounded-sm animate-pulse" 
            style={{ 
              height: `${20 + (i * 7) % 60}%`,
              animationDelay: `${i * 0.05}s`
            }} 
          />
        ))}
        
        {/* Fake Grid lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-zinc-900/50" />
        <div className="absolute inset-x-0 top-1/3 h-px bg-zinc-900/50" />
        <div className="absolute inset-x-0 top-2/3 h-px bg-zinc-900/50" />
      </div>

      {/* Footer / Axes Skeleton */}
      <div className="mt-8 flex justify-between px-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-2 w-10 bg-zinc-900 animate-pulse" />
        ))}
      </div>
      
      {/* Glare effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
    </div>
  );
}
