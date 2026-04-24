import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/types/api";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setSession: (user: UserProfile, token: string) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  logout: () => void;
  clearAuth: () => void;
}

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

const setTokenCookie = (token: string) => {
  if (typeof document === "undefined") return;
  const isSecure = location.protocol === "https:";
  document.cookie = `auth_token=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict${isSecure ? "; Secure" : ""}`;
};

const clearTokenCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

/**
 * Authentication Store (Zustand)
 * Manages user session, JWT token, and profile data (plan, role).
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setSession: (user, token) => {
        set({ user, token, isAuthenticated: true });
        setTokenCookie(token);
      },

      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof document !== "undefined") {
          clearTokenCookie();
          window.location.href = "/login";
        }
      },

      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
        clearTokenCookie();
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
