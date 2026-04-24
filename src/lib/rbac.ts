import { z } from "zod";

/**
 * Konfigurasi RBAC (Role-Based Access Control)
 * Menentukan hak akses dan skema user profile untuk IUS Platform.
 */

// 1. Tipe Dasar untuk Arsitektur SaaS
export type PlanType = "user" | "pengelola" | "pemilik" | "investment";

export type RoleType =
  | "owner"
  | "staff1"
  | "staff2"
  | "staff3"
  | "free"
  | "pro"
  | "bisnis"
  | "enterprise";

// 2. Skema User Profile menggunakan Zod
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  plan: z.enum(["user", "pengelola", "pemilik", "investment"]),
  role: z.enum([
    "owner",
    "staff1",
    "staff2",
    "staff3",
    "free",
    "pro",
    "bisnis",
    "enterprise",
  ]),
  investmentReturnPercentage: z.number(),
  telegramId: z.string().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * Logika Auto-Upgrade: Menaikkan tier user secara otomatis berdasarkan performa investasi.
 */
export function evaluateUserTier(user: UserProfile): UserProfile {
  // Jika user plan adalah 'user' dan return investasi > 11.5%
  if (user.plan === "user" && user.investmentReturnPercentage > 11.5) {
    return {
      ...user,
      role: "enterprise", // Naik ke role tertinggi secara otomatis
    };
  }
  return user;
}

/**
 * Fungsi Otorisasi: Mengecek izin pengelolaan user.
 * @param currentUserPlan - Plan dari user yang sedang login.
 * @param action - Aksi yang ingin dilakukan.
 */
export function canManageUsers(
  currentUserPlan: PlanType,
  action: "read" | "update" | "create" | "delete"
): boolean {
  // Pemilik memiliki akses penuh (Full Access)
  if (currentUserPlan === "pemilik") {
    return true;
  }

  // Pengelola hanya diizinkan membaca dan memperbarui data
  if (currentUserPlan === "pengelola") {
    return action === "read" || action === "update";
  }

  // Selain itu (user/investment) dilarang mengelola user
  return false;
}
