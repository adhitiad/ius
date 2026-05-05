"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Send, Save, Loader2, Lock, Phone } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProfileSettingsPage() {
  const { user } = useAuthStore();
  const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();
  const t = useTranslation();
  
  // Local Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    telegramId: "",
    whatsappId: "",
  });
  
  // Sync dengan store saat load
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        telegramId: user.telegramId || "",
        whatsappId: user.whatsappId || "",
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi WhatsApp: Harus angka saja dan dimulai dengan 62
    if (formData.whatsappId && !/^(62)[0-9]{9,15}$/.test(formData.whatsappId)) {
      toast.error("Format nomor WhatsApp tidak valid. Gunakan format internasional (628...) tanpa tanda + atau spasi.");
      return;
    }

    toast.promise(
      updateProfile({
        telegramId: formData.telegramId,
        whatsappId: formData.whatsappId,
      }),
      {
        loading: t.common.saving,
        success: t.profile.success,
        error: (err) => err.response?.data?.error || t.profile.error,
      }
    );
  };

  if (!user) return <div className="p-10 text-center">{t.common.loading}</div>;

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">{t.profile.title}</h1>
        <p className="text-zinc-400">{t.profile.subtitle}</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800 backdrop-blur-sm">
        {/* Nama Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <User className="w-4 h-4" /> {t.profile.full_name}
          </label>
          <Input 
            value={formData.fullName}
            disabled
            className="bg-zinc-900 border-zinc-800 h-11 opacity-50 cursor-not-allowed"
            placeholder={t.profile.full_name}
          />
          <p className="text-[10px] text-zinc-500 italic flex items-center gap-1">
            <Lock className="w-3 h-3" /> Nama mengikuti profil akun backend.
          </p>
        </div>

        {/* Email Input (Read-only) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Mail className="w-4 h-4" /> {t.profile.email}
          </label>
          <Input 
            value={formData.email}
            disabled
            className="bg-zinc-900 border-zinc-800 h-11 opacity-50 cursor-not-allowed"
          />
          <p className="text-[10px] text-zinc-500 italic">{t.profile.email_help}</p>
        </div>

        {/* Telegram ID Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Send className="w-4 h-4" /> {t.profile.telegram_id}
          </label>
          <div className="relative">
            <Input 
              type="text"
              value={formData.telegramId}
              onChange={(e) => setFormData(prev => ({ ...prev, telegramId: e.target.value }))}
              className="bg-zinc-950 border-zinc-800 h-11 focus:ring-blue-500/20"
              placeholder="Contoh: 12345678"
            />
          </div>
          <p className="text-[11px] text-blue-400/80">
            {t.profile.telegram_help}
          </p>
        </div>

        {/* WhatsApp ID Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Phone className="w-4 h-4" /> WhatsApp Number
          </label>
          <div className="relative">
            <Input 
              type="text"
              value={formData.whatsappId}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsappId: e.target.value }))}
              className="bg-zinc-950 border-zinc-800 h-11 focus:ring-emerald-500/20"
              placeholder="Contoh: 628123456789"
            />
          </div>
          <p className="text-[11px] text-emerald-400/80">
            Gunakan format internasional (628...). Digunakan untuk notifikasi sinyal via WhatsApp.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-blue-600/10 transition-all active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.common.saving}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t.common.save}
              </>
            )}
          </Button>
        </div>
      </form>
      
      {/* Quick Access Logic */}
      <div className="flex justify-center">
        <Button variant="ghost" asChild className="text-zinc-500 hover:text-zinc-300 text-xs h-11 px-6">
          <Link href="/dashboard">{t.common.back_to_dashboard}</Link>
        </Button>
      </div>
    </div>
  );
}

