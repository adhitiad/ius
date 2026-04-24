"use client";

import React from "react";

export function TickerSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-zinc-800 rounded" />
          <div className="h-12 w-64 bg-zinc-800 rounded-lg" />
          <div className="h-6 w-32 bg-zinc-800 rounded-full" />
        </div>
        <div className="h-24 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl" />
      </div>

      {/* Chart Skeleton */}
      <div className="h-[500px] w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl" />

      {/* Indicators Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
