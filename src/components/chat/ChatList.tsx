'use client';

import React from 'react';
import { useChatStore } from '@/store/useChatStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const ChatList = () => {
  const { threads, activeThreadId, setActiveThread } = useChatStore();

  return (
    <div className="flex flex-col h-full border-r border-border bg-background/50 backdrop-blur-sm">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Signals & Support
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {threads.map((thread) => {
            const isActive = activeThreadId === thread.id;
            return (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-left",
                  isActive 
                    ? "bg-emerald-500/10 border-emerald-500/20" 
                    : "hover:bg-muted/50 border-transparent",
                  "border"
                )}
              >
                <div className="relative">
                  <Avatar className="size-12 border border-border group-hover:border-emerald-500/50 transition-colors">
                    <AvatarImage src={thread.avatar} alt={thread.name} />
                    <AvatarFallback>{thread.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {thread.unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-emerald-500 text-white border-2 border-background"
                      variant="default"
                    >
                      {thread.unreadCount}
                    </Badge>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={cn(
                      "font-semibold truncate",
                      isActive ? "text-emerald-400" : "text-foreground"
                    )}>
                      {thread.name}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] uppercase tracking-wider py-0 px-1.5",
                        thread.type === 'ai' ? "border-emerald-500/50 text-emerald-400" : "border-blue-500/50 text-blue-400"
                      )}
                    >
                      {thread.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate leading-relaxed">
                    {thread.lastMessage || 'Belum ada pesan'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
