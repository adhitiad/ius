import { z } from "zod";

/**
 * Konfigurasi RBAC (Role-Based Access Control)
 * Menentukan hak akses dan skema user profile untuk IUS Platform.
 */

// 1. Tipe Dasar untuk Arsitektur SaaS (Disesuaikan dengan Backend UIS-OTAK)
export type PlanType =
  | "free"
  | "pro"
  | "bisnis"
  | "enterprise"
  | "owner"
  | "pengelola";

export type RoleType =
  | "user"
  | "admin"
  | "owner"
  | "pengelola"
  | "staff1"
  | "staff2"
  | "staff3"
  | "investment";

// 2. Skema User Profile menggunakan Zod
export const UserProfileSchema = z.object({
  id: z.number(), // Backend menggunakan integer ID
  name: z.string().nullable(),
  email: z.string().email(),
  plan: z.enum(["free", "pro", "bisnis", "enterprise", "owner", "pengelola"]),
  role: z.enum([
    "user",
    "admin",
    "owner",
    "pengelola",
    "staff1",
    "staff2",
    "staff3",
    "investment",
  ]),
  returnPercentage: z.number().optional(),
  telegramId: z.string().nullable().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * Logika Auto-Upgrade: Menaikkan tier user secara otomatis berdasarkan performa investasi.
 */
export function evaluateUserTier(user: UserProfile): UserProfile {
  // Jika user plan adalah 'free' dan return investasi > 11.5%
  if (user.plan === "free" && (user.returnPercentage ?? 0) > 11.5) {
    return {
      ...user,
      role: "investment", // Naik ke role tertinggi secara otomatis
    };
  }
  return user;
}

/**
 * Fungsi Otorisasi: Mengecek izin pengelolaan user.
 * @param currentUserRole - Role dari user yang sedang login.
 * @param action - Aksi yang ingin dilakukan.
 */
export function canManageUsers(
  currentUserRole: RoleType,
  action: "read" | "update" | "create" | "delete",
): boolean {
  // Pemilik/Owner memiliki akses penuh (Full Access)
  if (currentUserRole === "owner") {
    return true;
  }

  // Pengelola hanya diizinkan membaca dan memperbarui data
  if (currentUserRole === "pengelola") {
    return action === "read" || action === "update";
  }

  // Selain itu dilarang mengelola user
  return false;
}
