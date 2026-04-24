'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function MarketClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) return null; // Mencegah hydration mismatch

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="flex flex-col items-end gap-1 px-4 py-2 rounded-xl bg-zinc-900/50 border border-emerald-900/20 shadow-lg shadow-emerald-500/5 group hover:border-emerald-500/30 transition-all duration-500">
      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-emerald-400/70 transition-colors">
        <Clock className="w-3 h-3 animate-pulse" />
        Market Session Live
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums tracking-tighter">
          {formatTime(time)}
        </span>
        <span className="text-[10px] font-black font-mono text-emerald-600">
          WIB
        </span>
      </div>

      <div className="text-[11px] font-medium text-zinc-400 tracking-tight">
        {formatDate(time)}
      </div>
    </div>
  );
}

export default MarketClock;
