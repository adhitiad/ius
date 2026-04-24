"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mendaftar");
      }

      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md p-10 text-center space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl animate-in zoom-in-95 duration-500">
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white font-outfit">Pendaftaran Berhasil!</h2>
        <p className="text-zinc-500">Akun Anda telah dibuat. Mengalihkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
          <TrendingUp className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold font-outfit text-white tracking-tight">Buat Akun</h2>
        <p className="text-zinc-500 text-sm">Mulai perjalanan investasi Anda bersama Antigravity</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="flex items-center gap-3 p-4 text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl animate-in zoom-in-95">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
            <input
              {...register("name")}
              type="text"
              placeholder="John Doe"
              className={cn(
                "w-full px-4 py-2.5 bg-zinc-950 border rounded-xl text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                errors.name ? "border-rose-500/50" : "border-zinc-800 focus:border-zinc-700"
              )}
            />
            {errors.name && (
              <p className="text-[9px] font-bold text-rose-500 ml-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="nama@perusahaan.com"
              className={cn(
                "w-full px-4 py-2.5 bg-zinc-950 border rounded-xl text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                errors.email ? "border-rose-500/50" : "border-zinc-800 focus:border-zinc-700"
              )}
            />
            {errors.email && (
              <p className="text-[9px] font-bold text-rose-500 ml-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={cn(
                  "w-full px-4 py-2.5 bg-zinc-950 border rounded-xl text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                  errors.password ? "border-rose-500/50" : "border-zinc-800 focus:border-zinc-700"
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Konfirmasi</label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className={cn(
                  "w-full px-4 py-2.5 bg-zinc-950 border rounded-xl text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                  errors.confirmPassword ? "border-rose-500/50" : "border-zinc-800 focus:border-zinc-700"
                )}
              />
            </div>
          </div>
          {errors.password && (
            <p className="text-[9px] font-bold text-rose-500 ml-1">{errors.password.message}</p>
          )}
          {errors.confirmPassword && (
            <p className="text-[9px] font-bold text-rose-500 ml-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl transition-all shadow-lg active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Daftar Sekarang
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-zinc-500 text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
