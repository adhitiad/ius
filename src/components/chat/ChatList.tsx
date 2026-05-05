"use client";

import React from 'react';
import { useChatStore } from '@/store/useChatStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Bot, Headset, Sparkles, Activity } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

export const ChatList = () => {
  const { threads, activeThreadId, setActiveThread } = useChatStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="flex flex-col h-full border-r border-white/5 bg-zinc-950/20 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/10 relative z-10">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">
            Neural Nodes
          </h2>
          <div className="flex items-center gap-2">
            <Activity className="size-3 text-emerald-500" />
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Network Synchronized</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="size-10 rounded-xl hover:bg-primary/10 hover:text-primary border border-white/5 transition-all duration-300">
              <Plus className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-zinc-900/90 backdrop-blur-2xl border-white/5 rounded-2xl p-2 shadow-2xl">
            <DropdownMenuItem 
              className="gap-3 cursor-pointer rounded-xl h-12 px-4 font-black text-[10px] uppercase tracking-widest focus:bg-primary/10 focus:text-primary transition-all"
              onClick={() => {
                const { addThread, setActiveThread } = useChatStore.getState();
                const newThread = {
                  id: 'ius_ai',
                  name: 'Agen IUS (AI)',
                  type: 'ai' as const,
                  avatar: '/avatars/ai-bot.png',
                  unreadCount: 0,
                };
                addThread(newThread);
                setActiveThread(newThread.id);
              }}
            >
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Bot className="size-4 text-primary" />
              </div>
              Initialize AI Node
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="gap-3 cursor-pointer rounded-xl h-12 px-4 font-black text-[10px] uppercase tracking-widest focus:bg-blue-500/10 focus:text-blue-400 mt-1 transition-all"
              onClick={() => {
                const { addThread, setActiveThread } = useChatStore.getState();
                const id = `staff_${Date.now()}`;
                const newThread = {
                  id,
                  name: 'Human Intelligence',
                  type: 'staff' as const,
                  avatar: '/avatars/staff.png',
                  unreadCount: 0,
                };
                addThread(newThread);
                setActiveThread(newThread.id);
              }}
            >
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Headset className="size-4 text-blue-400" />
              </div>
              Connect Support Node
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2 p-4"
        >
          {threads.map((thread) => {
            const isActive = activeThreadId === thread.id;
            return (
              <motion.button
                variants={itemVariants}
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group text-left relative overflow-hidden",
                  isActive 
                    ? "bg-white/[0.03] border-white/10 shadow-2xl ring-1 ring-primary/30" 
                    : "hover:bg-white/[0.02] border-transparent hover:border-white/5",
                  "border"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50" 
                  />
                )}
                
                <div className="relative shrink-0">
                  <div className={cn(
                    "absolute -inset-1 rounded-2xl blur-md opacity-0 transition-opacity duration-500",
                    isActive ? "bg-primary/20 opacity-100" : "group-hover:bg-primary/10 group-hover:opacity-100"
                  )} />
                  <Avatar className="size-12 rounded-2xl border border-white/10 bg-zinc-900 group-hover:scale-105 transition-transform duration-500 relative z-10">
                    <AvatarImage src={thread.avatar} alt={thread.name} className="object-cover" />
                    <AvatarFallback className="bg-zinc-900 font-black text-xs text-zinc-600">
                      {thread.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {thread.unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 size-6 flex items-center justify-center p-0 bg-primary text-black font-black text-[10px] border-2 border-zinc-950 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-bounce z-20"
                      variant="default"
                    >
                      {thread.unreadCount}
                    </Badge>
                  )}
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={cn(
                      "text-xs font-black uppercase tracking-widest truncate transition-colors duration-500",
                      isActive ? "text-primary" : "text-zinc-400 group-hover:text-white"
                    )}>
                      {thread.name}
                    </span>
                    <div className={cn(
                      "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border transition-colors",
                      thread.type === 'ai' 
                        ? "bg-primary/5 border-primary/20 text-primary" 
                        : "bg-blue-500/5 border-blue-500/20 text-blue-400"
                    )}>
                      {thread.type === 'ai' ? 'NEURAL' : 'HUMAN'}
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider truncate leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {thread.lastMessage || 'Signal waiting...'}
                  </p>
                </div>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]" 
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </ScrollArea>
      
      <div className="p-6 bg-black/20 border-t border-white/5 relative z-10">
        <div className="flex items-center justify-center gap-3 py-2 px-4 rounded-xl bg-white/[0.02] border border-white/5">
          <Sparkles className="size-3 text-primary animate-pulse" />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Quantum Intelligence v4.0</span>
        </div>
      </div>
    </div>
  );
};
