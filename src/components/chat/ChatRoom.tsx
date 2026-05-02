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
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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

    // Validasi tipe file
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
        const data = await response.json();
        // Beritahu user di chat bahwa file berhasil diunggah
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
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-background/30 backdrop-blur-sm animate-fade-in">
        <div className="bg-muted/50 p-6 rounded-full mb-6 ring-1 ring-border shadow-inner">
          <MessageSquareOff className="size-16 text-muted-foreground opacity-20" />
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-foreground/80">
          Command Center Chat
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Pilih salah satu asisten AI atau staf kami untuk memulai konsultasi
          strategi trading Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border bg-background/50 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setActiveThread(null)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Avatar className="size-10 border border-border">
          <AvatarImage src={activeThread.avatar} alt={activeThread.name} />
          <AvatarFallback>
            {activeThread.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{activeThread.name}</h3>
          <p className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online - Trading Asisstant
          </p>
        </div>
        
        {/* MCP Settings Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "text-muted-foreground transition-colors",
                mcpConfig.enabled ? "text-emerald-500 bg-emerald-500/10" : ""
              )}
              title="MCP Configuration"
            >
              <Settings className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-border bg-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="size-5 text-emerald-500" />
                Konfigurasi MCP
              </DialogTitle>
              <DialogDescription>
                Model Context Protocol (MCP) memungkinkan AI mengakses basis data atau sumber daya eksternal secara real-time.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Gunakan MCP</p>
                  <p className="text-xs text-muted-foreground">Aktifkan untuk memberikan konteks tambahan ke AI</p>
                </div>
                <input 
                  type="checkbox"
                  className="size-5 accent-emerald-500 cursor-pointer"
                  checked={mcpConfig.enabled}
                  onChange={(e) => updateMcpConfig({ enabled: e.target.checked })}
                />
              </div>

              {mcpConfig.enabled && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Sumber MCP</p>
                    <Select 
                      value={mcpConfig.type} 
                      onValueChange={(val: 'internal' | 'external') => updateMcpConfig({ type: val })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Sumber" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">MCP Bawaan (Internal Memory)</SelectItem>
                        <SelectItem value="external">MCP Eksternal (Custom URL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {mcpConfig.type === 'external' && (
                    <div className="space-y-2 animate-in fade-in zoom-in-95">
                      <p className="text-sm font-medium">URL MCP Eksternal</p>
                      <Input 
                        placeholder="https://api.example.com/mcp"
                        value={mcpConfig.customUrl}
                        onChange={(e) => updateMcpConfig({ customUrl: e.target.value })}
                        className="bg-muted/50 border-border/50 focus:border-emerald-500/50"
                      />
                      <p className="text-[10px] text-muted-foreground px-1">
                        AI akan mencoba mengambil data dari URL ini setiap kali Anda mengirim pesan.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <MoreVertical className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive gap-2 cursor-pointer"
              onClick={() => clearHistory(activeThreadId)}
            >
              <Eraser className="size-4" />
              Bersihkan Histori
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {/* E2EE Badge */}
          <div className="flex justify-center mb-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 max-w-md text-center flex items-start gap-2 animate-fade-in">
              <Lock className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Pesan dienkripsi secara end-to-end. Tidak ada seorang pun di
                luar obrolan ini, bahkan sistem, yang dapat membacanya.
              </p>
            </div>
          </div>

          {activeMessages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-[85%] sm:max-w-[75%] group animate-fade-in-up",
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto",
                )}
              >
                {!msg.isDeleted && (
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0 border border-border/50 shadow-sm",
                      isUser
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {msg.sender === "ai" ? (
                      <Bot className="size-4" />
                    ) : msg.sender === "staff" ? (
                      <Headset className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                )}

                <div
                  className={cn(
                    "flex flex-col gap-1 relative",
                    isUser ? "items-end" : "items-start",
                  )}
                >
                  {msg.isDeleted ? (
                    <div className="p-3 rounded-2xl border border-border/30 bg-transparent flex items-center gap-2 italic text-muted-foreground/60 text-xs transition-all duration-500 animate-in fade-in">
                      <Trash2 className="size-3" />
                      Pesan ini telah dihapus
                    </div>
                  ) : (
                    <>
                      <div
                        className={cn(
                          "p-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all group-hover:shadow-emerald-500/5 relative",
                          isUser
                            ? "bg-emerald-600 text-white rounded-tr-none px-4 pr-10"
                            : "bg-muted/80 text-foreground rounded-tl-none border border-border/50 px-4",
                        )}
                      >
                        {(() => {
                          const thinkingMatch = msg.text.match(
                            /<thinking>([\s\S]*?)<\/thinking>/,
                          );
                          const textWithoutThinking = msg.text
                            .replace(/<thinking>[\s\S]*?<\/thinking>/, "")
                            .trim();

                          return (
                            <>
                              {thinkingMatch && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-2 font-mono text-[10px] text-emerald-400 italic">
                                  <Bot className="size-3" />
                                  <span>Brain is reasoning...</span>
                                </div>
                              )}
                              <div className="whitespace-pre-wrap">
                                {textWithoutThinking}
                              </div>
                            </>
                          );
                        })()}

                        {/* Hover Action for User */}
                        {isUser && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="text-white/60 hover:text-white transition-colors">
                                  <ChevronDown className="size-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="p-1">
                                <DropdownMenuItem
                                  onClick={() => deleteMessage(msg.id)}
                                  className="text-destructive focus:text-destructive gap-2 text-xs py-1.5 cursor-pointer"
                                >
                                  <Trash2 className="size-3.5" />
                                  Hapus Pesan
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground",
                          isUser ? "flex-row-reverse" : "",
                        )}
                      >
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isUser && msg.status && (
                          <span className="flex items-center">
                            {msg.status === "sending" && (
                              <Clock className="size-[12px] opacity-40" />
                            )}
                            {msg.status === "sent" && (
                              <Check className="size-[14px] text-muted-foreground/60" />
                            )}
                            {msg.status === "read" && (
                              <CheckCheck className="size-[14px] text-blue-400" />
                            )}
                            {msg.status === "failed" && (
                              <XCircle className="size-[14px] text-red-500" />
                            )}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Activity Indicator (Thinking or Typing) */}
          {activeThreadId &&
            isTyping[activeThreadId] &&
            (isTyping[activeThreadId] === "thinking" ? (
              <AIThinkingBubble />
            ) : (
              <StaffTypingBubble
                avatar={activeThread.avatar}
                name={activeThread.name}
                status={isTyping[activeThreadId]}
              />
            ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="flex items-center gap-2 max-w-4xl mx-auto bg-muted/30 rounded-2xl p-1.5 border border-border/50">
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
              "text-muted-foreground hover:text-emerald-500 shrink-0",
              isUploading && "animate-pulse text-emerald-500",
            )}
            onClick={handleFileClick}
            disabled={isUploading}
          >
            <Paperclip className="size-5" />
          </Button>
          <Input
            placeholder="Tulis pesan..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1 shadow-none"
          />
          <Button
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl size-9 shrink-0 shadow-lg shadow-emerald-500/20"
            size="icon"
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
