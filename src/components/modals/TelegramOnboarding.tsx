"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-zinc-950 border border-white/10 rounded-[2.2rem] p-8 max-w-md w-full shadow-[0_0_50px_rgba(16,185,129,0.08)] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] size-32 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
              <Send className="size-3 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                First Login Setup
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white italic">
              Connect <span className="text-emerald-500">Telegram</span>
            </h2>
            <p className="text-zinc-500 font-medium text-sm">
              Masukkan Telegram ID agar Whale Alert, sinyal pasar, dan notifikasi sistem dikirim otomatis.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                Telegram ID
              </label>
              <Input
                placeholder="Contoh: 123456789"
                className="bg-zinc-900/50 border-white/5 h-12 rounded-xl focus-visible:ring-emerald-500/20 text-base font-mono text-center"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              <p className="text-[10px] text-zinc-600 italic">
                Dapatkan ID dari bot Telegram: <span className="text-zinc-400">@userinfobot</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !telegramId.trim()}
              className={cn(
                "w-full h-12 rounded-xl font-black uppercase tracking-widest transition-all mt-3 flex items-center justify-center gap-3",
                isLoading || !telegramId.trim()
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  : "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.01]",
              )}
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <CheckCircle2 className="size-5" />
                  Simpan Telegram ID
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-[10px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors py-2"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
