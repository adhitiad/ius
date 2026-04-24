"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2, AlertCircle, TrendingUp } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await authService.login(data);
      setSession(session.user, session.token);
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Gagal masuk");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
          <TrendingUp className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold font-outfit text-white tracking-tight">Selamat Datang</h2>
        <p className="text-zinc-500 text-sm">Masuk untuk mengakses Dashboard Finansial Anda</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl animate-in zoom-in-95">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="nama@perusahaan.com"
              className={cn(
                "w-full px-4 py-3 bg-zinc-950 border rounded-xl text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                errors.email ? "border-rose-500/50" : "border-zinc-800 focus:border-zinc-700"
              )}
            />
            {errors.email && (
              <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Password</label>
              <button type="button" className="text-[10px] font-bold text-blue-400 hover:text-blue-300">Lupa Password?</button>
            </div>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={cn(
                "w-full px-4 py-3 bg-zinc-950 border rounded-xl text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                errors.password ? "border-rose-500/50" : "border-zinc-800 focus:border-zinc-700"
              )}
            />
            {errors.password && (
              <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Masuk Sekarang
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-zinc-500 text-sm">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
            Daftar Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
