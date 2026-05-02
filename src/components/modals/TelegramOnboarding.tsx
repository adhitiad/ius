"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Link from "next/link";

/**
 * Modal onboarding Telegram saat pertama login dan telegram_id belum terisi.
 */
export function TelegramOnboarding() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [telegramId, setTelegramId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const shouldOpen = useMemo(
    () => isAuthenticated && !!user && !user.telegramId,
    [isAuthenticated, user],
  );

  useEffect(() => {
    if (shouldOpen) {
      setIsOpen(true);
    }
  }, [shouldOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = telegramId.trim();
    if (!trimmed) return;
    if (!/^\d+$/.test(trimmed)) {
      toast.error("Telegram ID harus berupa angka.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await authService.updateTelegramId(trimmed);
      updateUser({ telegramId: updatedUser.telegramId });
      toast.success("Telegram ID berhasil ditautkan.");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Gagal menautkan Telegram ID.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[20px] animate-in fade-in duration-500">
      <div className="relative bg-zinc-950/40 border border-white/10 rounded-[3rem] p-10 max-w-md w-full shadow-[0_0_100px_-20px_rgba(16,185,129,0.2)] overflow-hidden backdrop-blur-3xl">
        {/* Dynamic Glows */}
        <div className="absolute -top-[20%] -right-[20%] size-64 bg-emerald-500/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-[20%] -left-[20%] size-64 bg-blue-500/10 rounded-full blur-[80px]" />

        <div className="relative space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-2">
              <div className="size-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                Identity Protocol
              </span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-white leading-none uppercase italic">
              Connect <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Telegram</span>
            </h2>
            <p className="text-zinc-400 font-medium text-sm leading-relaxed">
               Aktifkan jalur data prioritas. Dapatkan **Whale Alerts** dan sinyal sistem langsung di genggaman Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    Neural Address (ID)
                 </label>
                 <Link href="https://t.me/userinfobot" target="_blank" className="text-[9px] font-black uppercase text-emerald-500/70 hover:text-emerald-400 underline tracking-widest transition-colors">
                    Get ID via @userinfobot
                 </Link>
              </div>
              <div className="relative group">
                <Input
                  placeholder="ID: 123456789"
                  className="bg-white/5 border-white/5 h-16 rounded-2xl focus-visible:ring-emerald-500/20 text-xl font-mono text-center tracking-[0.2em] text-white focus:bg-white/[0.08] transition-all"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
                <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !telegramId.trim()}
              className={cn(
                "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] transition-all mt-4 flex items-center justify-center gap-4 text-xs overflow-hidden relative group",
                isLoading || !telegramId.trim()
                  ? "bg-zinc-800 text-zinc-600"
                  : "bg-white text-black hover:bg-emerald-500 hover:text-white"
              )}
            >
              {isLoading ? (
                "Synchronizing..."
              ) : (
                <>
                  Establish Connection
                  <CheckCircle2 className="size-5 transition-transform group-hover:scale-110" />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10" />
            </button>
          </form>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-[10px] font-black text-zinc-600 hover:text-zinc-400 uppercase tracking-[0.4em] transition-colors py-2 italic"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
