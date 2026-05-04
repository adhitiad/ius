'use client';

import React from 'react';
import { Brain, Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIThinkingBubbleProps {
  text?: string;
}

export const AIThinkingBubble = ({ text }: AIThinkingBubbleProps) => {
  const sensors = [
    { label: 'Vision', status: 'Syncing' },
    { label: 'Hearing', status: 'Analysis' },
    { label: 'Whale', status: 'Tracking' },
    { label: 'Intuition', status: 'Correlating' },
    { label: 'Sixth Sense', status: 'Predicting' }
  ];

  return (
    <div className="flex flex-col gap-3 max-w-fit mr-auto mb-8 ml-1 animate-in fade-in slide-in-from-left-4 duration-700 ease-out font-outfit">
      <div className={cn(
        "flex items-center gap-5 px-7 py-5 rounded-3xl border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden",
        "bg-black/80 backdrop-blur-3xl ring-1 ring-inset ring-white/5 group"
      )}>
        {/* Glowing Neural Core */}
        <div className="absolute -left-20 -top-20 size-60 bg-emerald-500/10 blur-[80px] pointer-events-none animate-pulse" />
        
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <Brain className="size-7 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.9)]" />
          </div>
        </div>
        
        <div className="flex flex-col relative z-10 min-w-[240px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase flex items-center gap-1.5">
              <Zap className="size-3 fill-emerald-500/20" />
              Neural Cycle Active
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="size-1.5 rounded-full bg-emerald-500/60 animate-pulse" 
                  style={{ animationDelay: `${i * 0.2}s` }} 
                />
              ))}
            </div>
          </div>
          
          <span className="text-base font-semibold text-white tracking-tight leading-tight">
            {text || "UIS sedang mensintesis anomali pasar..."}
          </span>
          
          <div className="flex gap-2 mt-4 overflow-hidden">
            {sensors.map((s, i) => (
              <div 
                key={s.label}
                className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/5 animate-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-tighter">{s.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className="size-1 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[9px] font-medium text-white/40">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Matrix Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>
    </div>
  );
};
