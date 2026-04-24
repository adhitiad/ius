export type UserRole =
  | "user"
  | "admin"
  | "owner"
  | "pengelola"
  | "staff1"
  | "staff2"
  | "staff3"
  | "enterprise";

export type UserPlan = "free" | "pro" | "bisnis" | "enterprise";

export interface ApiUserProfile {
  id: number;
  email: string;
  full_name?: string | null;
  role: UserRole;
  plan: UserPlan;
  telegram_id?: string | null;
  return_percentage?: number | null;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  plan: UserPlan;
  telegramId: string | null;
  returnPercentage: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface NewsTickerResponse {
  headlines: string[];
}

export interface ScreenerItem {
  name: string;
  ticker: string;
  price: number;
  win_rate: number;
}

export interface ScreenerResponse {
  top_20: ScreenerItem[];
}

export interface MarketSignal {
  ticker: string;
  lstm_probability: number;
  sentiment_score: number;
  order_book_status: string;
  recommendation: string;
}

export interface FinanceDashboardResponse {
  total_revenue: number;
  investment_tier_contribution: Record<string, number>;
  api_costs: number;
  net_profit: number;
}

export interface SystemHealthResponse {
  status: string;
  uptime: string;
  diagnostics: {
    cpu: string;
    ram_total: string;
    ram_usage: string;
    gpu: {
      has_gpu: boolean;
      gpu_name: string;
      vram_total: string;
    };
  };
  services: {
    database_neon: string;
    redis_cloud: string;
    pinecone_vector: string;
    external_api: Record<string, string>;
  };
  safety: {
    kill_switch: "ON" | "OFF";
  };
}
