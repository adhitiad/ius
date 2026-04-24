'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface StaffTypingBubbleProps {
  avatar?: string;
  name?: string;
  status?: 'typing' | 'thinking' | null;
}

export const StaffTypingBubble = ({ avatar, name, status = 'typing' }: StaffTypingBubbleProps) => {
  if (!status) return null;

  return (
    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%] animate-fade-in-up mr-auto mb-4 group">
      <Avatar className="size-6 border border-border/50 shrink-0 shadow-sm">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-[8px] bg-muted">{name?.substring(0, 2).toUpperCase() || 'ST'}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-1 items-start">
        <div className={cn(
          "p-3 rounded-2xl bg-muted/80 border border-border/50 rounded-tl-none flex items-center gap-1.5 min-w-[56px] shadow-sm ring-1 ring-white/5",
          "after:content-[''] after:absolute after:left-[-6px] after:top-0 after:border-t-[8px] after:border-t-muted/80 after:border-l-[8px] after:border-l-transparent"
        )}>
          <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-typing-dot" />
          <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-typing-dot" style={{ animationDelay: '0.2s' }} />
          <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-typing-dot" style={{ animationDelay: '0.4s' }} />
        </div>
        <span className="px-1 text-[9px] font-medium text-muted-foreground/60 italic animate-pulse">
          {status === 'thinking' ? 'Aurora is thinking...' : 'Staff is typing...'}
        </span>
      </div>
    </div>
  );
};
