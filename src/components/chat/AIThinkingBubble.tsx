'use client';

import React from 'react';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AIThinkingBubble = () => {
  return (
    <div className="flex items-center gap-3 max-w-fit mr-auto mb-6 ml-1 animate-in fade-in slide-in-from-left-4 duration-700 ease-out">
      <div className={cn(
        "flex items-center gap-4 px-6 py-4 rounded-2xl border border-emerald-500/30 shadow-2xl relative overflow-hidden",
        "bg-black/40 backdrop-blur-xl ring-1 ring-inset ring-white/10 group"
      )}>
        {/* Glowing Background Effect */}
        <div className="absolute -left-10 -top-10 size-32 bg-emerald-500/10 blur-[50px] pointer-events-none" />
        
        <div className="relative shrink-0">
          <Brain className="size-6 text-emerald-400 animate-pulse drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
          <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full scale-150 animate-pulse opacity-50" />
        </div>
        
        <div className="flex flex-col relative z-10">
          <span className="text-sm font-semibold tracking-wider text-emerald-50/90 animate-shine uppercase">
            IUS sedang menganalisis pasar...
          </span>
          <div className="h-[2px] w-full mt-1.5 rounded-full bg-emerald-500/10 overflow-hidden">
            <div className="h-full w-1/3 bg-emerald-500/60 animate-marquee" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        {/* Scanner Line Effect */}
        <div className="absolute inset-y-0 left-0 w-[2px] bg-emerald-500/20 blur-sm animate-[marquee_3s_linear_infinite]" />
      </div>
    </div>
  );
};
