import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { type PlanType, type RoleType } from "@/lib/rbac";

interface UserSession {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  role: RoleType;
  investmentReturnPercentage: number;
  telegramId?: string;
  subscription?: {
    tier: "Basic" | "Pro" | "VIP";
    status: "active" | "expired" | "none";
    expiryDate: string | null;
  };
}

export interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: number;
  volume?: number;
  high?: number;
  low?: number;
}

export interface PriceData {
  price: number;
  volume: number;
  timestamp: number;
  change?: number; // Opsional: tetap disimpan untuk kompatibilitas UI
  changePercent?: number; // Opsional: tetap disimpan untuk kompatibilitas UI
}

interface MarketState {
  user: UserSession | null;
  token: string | null;
  prices: Record<string, PriceData>;
  language: "id" | "en";
  theme: "dark" | "light" | "aurora" | "cool";
  setUser: (user: UserSession | null) => void;
  setToken: (token: string | null) => void;
  setLanguage: (lang: "id" | "en") => void;
  setTheme: (theme: "dark" | "light" | "aurora" | "cool") => void;
  updateSubscription: (tier: "Basic" | "Pro" | "VIP") => void;
  updatePrices: (newPrices: Record<string, Partial<TickerData>>) => void;
  logout: () => void;
}

export const useMarketStore = create<MarketState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        user: null,
        token: null,
        prices: {},
        language: "id",
        theme: "dark",
        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        setLanguage: (language) => set({ language }),
        setTheme: (theme) => set({ theme }),

        logout: () => {
          set({ user: null, token: null });
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        },
        updateSubscription: (tier) =>
          set((state) => {
            if (!state.user) return state;
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            return {
              user: {
                ...state.user,
                subscription: {
                  tier,
                  status: "active",
                  expiryDate: expiryDate.toISOString(),
                },
              },
            };
          }),
        updatePrices: (newPrices) =>
          set((state) => {
            const nextPrices = { ...state.prices };
            
            Object.entries(newPrices).forEach(([symbol, data]) => {
              const prev = nextPrices[symbol];
              nextPrices[symbol] = {
                price: data.price ?? prev?.price ?? 0,
                volume: data.volume ?? prev?.volume ?? 0,
                timestamp: data.lastUpdate ?? Date.now(),
                // Pertahankan change data untuk UI
                change: data.change ?? prev?.change ?? 0,
                changePercent: data.changePercent ?? prev?.changePercent ?? 0,
              };
            });
            
            return { prices: nextPrices };
          }),
      }),
      {
        name: "market-store",
      }
    )
  )
);
