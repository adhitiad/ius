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
  refresh_token?: string;
  token_type: string;
}

export interface NewsTickerResponse {
  headlines: string[];
}

export interface ScreenerItem {
  ticker: string;
  price: number;
  change: number;
  ema_200: number;
  rsi: number;
  win_rate_prob: number;
  bandar_score: number;
  bandar_label: string;
  spike_ratio: number;
  signal: string;
  sl?: number;

  winrate?: string;
  order_type?: string;
  whale_accumulation_score?: number;
}

export interface ScreenerResponse {
  top_20: ScreenerItem[];
}

export interface SmartScreenerItem {
  ticker: string;
  composite_score: number;
  rank: number;
  label: string;
  fundamental_score: number;
  momentum_score: number;
  price: number;
}

export interface RSIResponse {
  ticker: string;
  rsi: number;
  current_rsi?: number | null;
  sector_avg_rsi: number;
  sector_average_rsi?: number;
  status: string;
  sector?: string;
  period?: number;
}

export interface MarketSignal {
  ticker: string;
  lstm_probability: number;
  sentiment_score: number;
  order_book_status: string;
  recommendation: string;
}

export interface ChartDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBlock {
  price: number;
  type: "bullish" | "bearish";
  coordinates: {
    start: string;
    end: string;
  };
}

export interface ChartResponse {
  ticker: string;
  data: ChartDataPoint[];
  order_blocks: OrderBlock[];
}

export interface BacktestHistoryItem {
  date: string;
  capital: number;
  profit_loss: number;
}

export interface BacktestResponse {
  history: BacktestHistoryItem[];
  final_profit_pct: number;
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

export interface RadarNewsItem {
  source: string;
  title: string;
  link: string;
  published: string;
  summary: string;
  ai_relevance?: number;
  ai_sentiment?: "positive" | "negative" | "neutral";
  ai_reason?: string;
}

export interface MarketIndex {
  IndexCode: string;
  Name: string;
  Closing: string;
  Change: string;
  Percent: string;
  Current: string;
  Time: string;
}

export interface RadarResponse {
  daily_summary: string;
  telegram_score: number;
  last_update: string | null;
  rss_news: RadarNewsItem[];
  market_indices?: MarketIndex[];
}

export interface SynopsisResponse {
  synopsis: string;
}

export interface InsightMovers {
  ticker: string;
  change: number;
  change_p: number;
  price: number;
}

export interface InsightForeign {
  ticker: string;
  foreign_net: number;
  price: number;
}

export interface MarketInsights {
  top_gainers: InsightMovers[];
  top_losers: InsightMovers[];
  top_value: InsightMovers[];
  top_foreign: InsightForeign[];
  last_update: string;
}
