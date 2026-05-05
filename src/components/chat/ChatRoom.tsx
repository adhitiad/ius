"use client";

import { AIThinkingBubble } from "@/components/chat/AIThinkingBubble";
import { StaffTypingBubble } from "@/components/chat/StaffTypingBubble";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import {
  ArrowLeft,
  Bot,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Eraser,
  Headset,
  Lock,
  MessageSquareOff,
  MoreVertical,
  Paperclip,
  Send,
  Settings,
  Globe,
  Trash2,
  User,
  XCircle,
  Cpu,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ChatRoom = () => {
  const {
    threads,
    messages,
    activeThreadId,
    setActiveThread,
    sendMessage,
    deleteMessage,
    clearHistory,
    isTyping,
    mcpConfig,
    updateMcpConfig,
  } = useChatStore();

  const [inputText, setInputText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId);
  const activeMessages = messages.filter((m) => m.threadId === activeThreadId);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [activeMessages.length, activeThreadId, isTyping[activeThreadId || ""]]);

  const handleSend = () => {
    if (inputText.trim() && activeThreadId) {
      sendMessage(activeThreadId, inputText.trim());
      setInputText("");
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeThreadId) return;

    const allowedTypes = [
      "text/csv",
      "application/json",
      "application/pdf",
      "application/javascript",
    ];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !["csv", "json", "jsonp", "pdf"].includes(ext || "")
    ) {
      alert("Tipe file tidak diizinkan. Gunakan: .csv, .json, .jsonp, .pdf");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://ap1.aiuiso.site/api/v1";
      const response = await fetch(
        `${baseUrl}/chat/upload?thread_id=${activeThreadId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-storage") ? JSON.parse(localStorage.getItem("auth-storage")!).state?.token : ""}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        sendMessage(
          activeThreadId,
          `[File Uploaded: ${file.name}] Saya telah mengunggah file ini. Tolong analisis isinya.`,
        );
      } else {
        const err = await response.json();
        alert(`Gagal mengunggah: ${err.detail || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      console.error("File upload error:", error);
      alert("Gagal mengunggah file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!activeThreadId || !activeThread) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full text-center p-8 bg-zinc-950/20 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
        <div className="relative z-10">
          <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-8 group ring-1 ring-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <MessageSquareOff className="size-16 text-zinc-700 group-hover:text-primary transition-colors duration-500" />
          </div>
          <h3 className="text-3xl font-black mb-3 text-white uppercase tracking-[0.2em]">Neural Command</h3>
          <p className="text-zinc-500 max-w-sm font-medium leading-relaxed">
            Pilih node asisten untuk inisialisasi protokol konsultasi strategi trading Anda.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950/20 backdrop-blur-xl relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-white/5 bg-black/20 backdrop-blur-md z-20">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-zinc-400"
          onClick={() => setActiveThread(null)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="relative group">
          <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <Avatar className="size-12 border-2 border-white/10 ring-2 ring-primary/20">
            <AvatarImage src={activeThread.avatar} alt={activeThread.name} />
            <AvatarFallback className="bg-zinc-900 font-black text-xs">
              {activeThread.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-white uppercase tracking-wider text-sm">{activeThread.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Active</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-10 rounded-xl transition-all duration-300",
                  mcpConfig.enabled 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <Cpu className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] border-white/5 bg-zinc-900/90 backdrop-blur-2xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-white font-black uppercase tracking-widest">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <Globe className="size-5 text-primary" />
                  </div>
                  MCP Core Sync
                </DialogTitle>
                <DialogDescription className="text-zinc-500 font-medium">
                  Model Context Protocol memungkinkan Neural Core mengakses dataset eksternal secara real-time.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white uppercase tracking-wider">Sync Protocol</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Enable Real-time Context Injection</p>
                  </div>
                  <input 
                    type="checkbox"
                    className="size-6 accent-primary cursor-pointer rounded-lg"
                    checked={mcpConfig.enabled}
                    onChange={(e) => updateMcpConfig({ enabled: e.target.checked })}
                  />
                </div>

                {mcpConfig.enabled && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Source Node</p>
                      <Select 
                        value={mcpConfig.type} 
                        onValueChange={(val: 'internal' | 'external') => updateMcpConfig({ type: val })}
                      >
                        <SelectTrigger className="w-full h-12 bg-white/[0.02] border-white/5 rounded-xl text-white">
                          <SelectValue placeholder="Select Node" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/5 rounded-xl">
                          <SelectItem value="internal">INTERNAL_V1 (Global Memory)</SelectItem>
                          <SelectItem value="external">EXTERNAL_REMOTE (Custom URL)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {mcpConfig.type === 'external' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3"
                      >
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Remote Node URL</p>
                        <Input 
                          placeholder="wss://api.neural-core.io/sync"
                          value={mcpConfig.customUrl}
                          onChange={(e) => updateMcpConfig({ customUrl: e.target.value })}
                          className="h-12 bg-white/[0.02] border-white/5 rounded-xl text-primary focus:border-primary/50"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5"
              >
                <MoreVertical className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900/90 backdrop-blur-xl border-white/5 rounded-2xl p-2 min-w-[200px]">
              <DropdownMenuItem
                className="text-rose-500 focus:text-rose-400 focus:bg-rose-500/10 gap-3 cursor-pointer rounded-xl h-11 px-4 font-black text-[10px] uppercase tracking-widest"
                onClick={() => clearHistory(activeThreadId)}
              >
                <Eraser className="size-4" />
                Flush Neural Cache
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6" ref={scrollRef}>
        <div className="flex flex-col gap-6 max-w-5xl mx-auto py-10">
          {/* E2EE Badge */}
          <div className="flex justify-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-3xl p-4 max-w-lg text-center flex items-center gap-4 group hover:bg-emerald-500/[0.05] transition-all duration-500"
            >
              <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldCheck className="size-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">Secure Neural Channel</p>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                  Semua transmisi data dienkripsi dengan protokol Quantum-Safe AES-256. Node eksternal tidak dapat menyadap sinyal.
                </p>
              </div>
            </motion.div>
          </div>

          <AnimatePresence initial={false}>
            {activeMessages.map((msg, idx) => {
              const isUser = msg.sender === "user";
              const thinkingMatch = msg.text.match(/<thinking>([\s\S]*?)<\/thinking>/);
              const textWithoutThinking = msg.text
                .replace(/<thinking>[\s\S]*?<\/thinking>/, "")
                .trim();

              return (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  className={cn(
                    "flex gap-4 max-w-[85%] sm:max-w-[80%] group",
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto",
                  )}
                >
                  {!msg.isDeleted && (
                    <div className="shrink-0 mt-1">
                      <div
                        className={cn(
                          "size-10 rounded-2xl flex items-center justify-center border transition-all duration-500",
                          isUser
                            ? "bg-primary text-white border-white/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : "bg-zinc-900 text-zinc-400 border-white/5",
                        )}
                      >
                        {msg.sender === "ai" ? (
                          <Sparkles className="size-5" />
                        ) : msg.sender === "staff" ? (
                          <Headset className="size-5" />
                        ) : (
                          <User className="size-5" />
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex flex-col gap-2 relative",
                      isUser ? "items-end" : "items-start",
                    )}
                  >
                    {msg.isDeleted ? (
                      <div className="p-4 rounded-3xl border border-white/5 bg-zinc-900/50 flex items-center gap-3 italic text-zinc-600 text-[11px] font-black uppercase tracking-widest">
                        <Trash2 className="size-3.5" />
                        Signal Terminated
                      </div>
                    ) : (
                      <>
                        <div
                          className={cn(
                            "p-5 rounded-[2rem] text-sm leading-relaxed transition-all relative overflow-hidden group-hover:shadow-2xl",
                            isUser
                              ? "bg-gradient-to-br from-primary to-emerald-700 text-white rounded-tr-none shadow-[0_0_30px_rgba(16,185,129,0.1)] border border-white/10"
                              : "bg-zinc-900/80 backdrop-blur-md text-zinc-100 rounded-tl-none border border-white/5"
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          
                          <div className="flex flex-col gap-4 relative z-10">
                            {thinkingMatch && (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 font-black text-[9px] text-primary uppercase tracking-[0.2em] w-fit">
                                <motion.div 
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                >
                                  <Cpu className="size-3" />
                                </motion.div>
                                Neural Reasoning Engine Active
                              </div>
                            )}
                            
                            <div className={cn(
                              "whitespace-pre-wrap leading-relaxed font-medium",
                              isUser ? "text-white" : "text-zinc-200"
                            )}>
                              {textWithoutThinking}
                            </div>
                            
                            {msg.text.includes("<thinking>") && (
                              <details className="mt-2 group border-t border-white/10 pt-4">
                                <summary className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 cursor-pointer hover:text-primary transition-all list-none outline-none">
                                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                                  Access Reasoning Logs
                                </summary>
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  className="mt-4 p-5 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-emerald-100/40 font-mono leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar italic"
                                >
                                  {thinkingMatch?.[1] || "Reasoning data purged for security."}
                                </motion.div>
                              </details>
                            )}
                          </div>

                          {/* Hover Action for User */}
                          {isUser && (
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="text-white/40 hover:text-white transition-colors p-1">
                                    <MoreVertical className="size-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-zinc-900 border-white/5 rounded-xl">
                                  <DropdownMenuItem
                                    onClick={() => deleteMessage(msg.id)}
                                    className="text-rose-500 focus:text-rose-400 gap-2 text-[10px] font-black uppercase tracking-widest py-2 cursor-pointer"
                                  >
                                    <Trash2 className="size-3.5" />
                                    Purge
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                        
                        <div
                          className={cn(
                            "flex items-center gap-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600",
                            isUser ? "flex-row-reverse" : "",
                          )}
                        >
                          <span className="tabular-nums">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit"
                            })}
                          </span>
                          {isUser && msg.status && (
                            <div className="flex items-center">
                              {msg.status === "sending" && (
                                <motion.div 
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                  <Clock className="size-3.5" />
                                </motion.div>
                              )}
                              {msg.status === "sent" && (
                                <Check className="size-4 opacity-40" />
                              )}
                              {msg.status === "read" && (
                                <CheckCheck className="size-4 text-primary shadow-[0_0_8px_var(--color-primary)]" />
                              )}
                              {msg.status === "failed" && (
                                <XCircle className="size-4 text-rose-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Activity Indicator */}
          {activeThreadId && isTyping[activeThreadId] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-auto"
            >
              {activeThread.type === "ai" ? (
                <AIThinkingBubble text={isTyping[activeThreadId] || undefined} />
              ) : (
                <StaffTypingBubble
                  avatar={activeThread.avatar}
                  name={activeThread.name}
                  status={isTyping[activeThreadId] as any}
                />
              )}
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-2xl z-20">
        <div className="flex items-center gap-4 max-w-5xl mx-auto bg-zinc-900/50 rounded-[2.5rem] p-2 pl-4 border border-white/10 shadow-2xl focus-within:border-primary/30 transition-colors">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".csv,.json,.jsonp,.pdf"
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-12 rounded-2xl text-zinc-500 hover:text-primary transition-all duration-300",
              isUploading && "animate-pulse text-primary bg-primary/10",
            )}
            onClick={handleFileClick}
            disabled={isUploading}
          >
            <Paperclip className="size-6" />
          </Button>
          <Input
            placeholder="Transmit command to Neural Core..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none text-white font-medium placeholder:text-zinc-700 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em] text-sm"
          />
          <Button
            className="bg-primary hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-[2rem] h-12 px-8 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all group/send overflow-hidden relative"
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/send:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              Send <Send className="size-4 transition-transform group-hover/send:translate-x-1 group-hover/send:-translate-y-1" />
            </span>
          </Button>
        </div>
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2 text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">
            <Lock className="size-2.5" /> AES_256_ACTIVE
          </div>
          <div className="flex items-center gap-2 text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">
            <Cpu className="size-2.5" /> QUANTUM_SAFE_SYNC
          </div>
          <div className="flex items-center gap-2 text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">
            <Globe className="size-2.5" /> GLOBAL_NODE_STABLE
          </div>
        </div>
      </div>
    </div>
  );
};
