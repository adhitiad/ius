"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Terminal, Sparkles, BrainCircuit, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { marketService } from "@/services/marketService";

interface Message {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  timestamp: string;
}

export function AgentTerminal({ ticker }: { ticker: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Salam, Master. IUS Brain Engine siap menganalisis ${ticker}. Apa yang ingin Anda ketahui?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "memory">("chat");
  const [memoryIndex, setMemoryIndex] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await marketService.askBrain(ticker, input);
      setMemoryIndex(response.mcp_index || "");
      
      const assistantMsg: Message = {
        role: "assistant",
        content: response.recommendation,
        thinking: response.thinking,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
          role: "assistant",
          content: "Mohon maaf Master, terjadi gangguan pada IUS Brain Engine. Silakan coba sesaat lagi.",
          timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-600/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <Bot className="size-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white italic tracking-wider">TERMINAL AGEN <span className="text-brand-500">IUS</span></h3>
            <div className="flex items-center gap-3">
                <div className="relative">
                   <span className="absolute inset-0 size-2 bg-emerald-500/50 blur-sm rounded-full animate-pulse" />
                   <span className="relative block size-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Siklus Penalaran Aktif</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab("chat")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "chat" ? "bg-brand-500 text-black shadow-lg shadow-brand-500/20" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Terminal
            </button>
            <button 
              onClick={() => setActiveTab("memory")}
              className={cn(
                "px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                activeTab === "memory" ? "bg-brand-500 text-black shadow-lg shadow-brand-500/30" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              Memori Otak
            </button>
        </div>
      </div>

      {activeTab === "chat" ? (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide relative">
            {/* Neural Background Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex flex-col gap-2 max-w-[85%] relative z-10",
                msg.role === "user" ? "ml-auto items-end" : "items-start"
              )}>
                {msg.thinking && (
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 mb-1 group/think">
                      <div className="relative">
                        <BrainCircuit className="size-3 text-emerald-400" />
                        <div className="absolute inset-0 blur-[4px] bg-emerald-500/50 animate-pulse" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-300 italic tracking-tighter uppercase">{msg.thinking}</span>
                   </div>
                )}
                <div className={cn(
                  "px-5 py-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap transition-all duration-500",
                  msg.role === "user" 
                    ? "bg-emerald-500 text-black font-black rounded-tr-none shadow-[0_10px_20px_rgba(16,185,129,0.2)]" 
                    : "bg-zinc-900/80 backdrop-blur-xl text-zinc-300 border border-white/5 rounded-tl-none group-hover:bg-zinc-900 group-hover:border-white/10"
                )}>
                  {msg.content}
                </div>
                <div className="flex items-center gap-3 mt-1.5 px-2">
                   <div className={cn("size-1.5 rounded-full", msg.role === 'user' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-800')} />
                   <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-4 px-6 py-3 relative z-10">
                <div className="flex gap-1.5">
                   <div className="size-1.5 bg-emerald-500 rounded-full animate-bounce shadow-[0_0_8px_#10b981]" style={{ animationDelay: '0ms' }} />
                   <div className="size-1.5 bg-emerald-500 rounded-full animate-bounce shadow-[0_0_8px_#10b981]" style={{ animationDelay: '150ms' }} />
                   <div className="size-1.5 bg-emerald-500 rounded-full animate-bounce shadow-[0_0_8px_#10b981]" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 italic animate-pulse">Neural Engine SEDANG MEMPROSES...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-zinc-900/50 border-t border-white/5 backdrop-blur-md">
            <div className="relative group">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-brand-500 transition-colors" />
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Tanya IUS tentang strategi di ${ticker}...`}
                className="pl-12 pr-12 h-14 bg-zinc-950 border-white/10 rounded-2xl focus:ring-brand-500/20 text-white placeholder:text-zinc-700"
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl p-0"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-10 font-mono text-xs text-zinc-400 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-90">
          <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-brand-500/10 border border-brand-500/20 shadow-inner">
            <Activity className="size-5 text-brand-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-400">Indeks Memori (MEMORY.md)</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 leading-[2] whitespace-pre-wrap backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <BrainCircuit className="size-32" />
            </div>
            {memoryIndex || "Brain belum memiliki memori file. Kirim perintah untuk menginisialisasi."}
          </div>
          <div className="grid grid-cols-2 gap-6 pb-10">
             <div className="p-6 rounded-[2rem] bg-zinc-900/60 border border-white/5 hover:border-brand-500/30 transition-colors group">
                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 group-hover:text-brand-500 transition-colors">Jalur Memori</h4>
                <code className="text-zinc-200 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 block">./memory/*.md</code>
             </div>
             <div className="p-6 rounded-[2rem] bg-zinc-900/60 border border-white/5 hover:border-brand-500/30 transition-colors group">
                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 group-hover:text-brand-500 transition-colors">Mode Memori</h4>
                <code className="text-zinc-200 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 block">MCP Persistent</code>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
