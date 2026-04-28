import api from "@/lib/api";
import {
  MarketSignal,
  NewsTickerResponse,
  ScreenerItem,
  ScreenerResponse,
  ChartResponse,
  BacktestResponse,
  RadarResponse,
  SystemHealthResponse,
  SmartScreenerItem,
  RSIResponse,
  SynopsisResponse,
} from "@/types/api";


/**
 * Market Intelligence Service
 */
export const marketService = {
  /**
   * Get latest news ticker items
   */
  getNewsTicker: async (): Promise<string[]> => {
    const response = await api.get<NewsTickerResponse>("/market/news-ticker");
    return response.data.headlines ?? [];
  },

  /**
   * Helper for deterministic mock values based on ticker string
   */
  _pseudoRandom: (ticker: string) => {
    let hash = 0;
    for (let i = 0; i < ticker.length; i++) hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash);
  },

  /**
   * Get market screener top picks.
   */
  getScreener: async (): Promise<ScreenerItem[]> => {
    const response = await api.get<any>("/market/screener");
    // Backend returns {top_20: [...]} or direct array
    const raw = response.data?.top_20 ?? response.data?.results ?? response.data;
    const data: any[] = Array.isArray(raw) ? raw : [];
    // Ensure all items have required properties
    return data.map(item => {
      // mapping "BUY/BULLISH" etc snippet
      const signalRaw = item.action ?? "HOLD";
      const signalClean = signalRaw.includes("/") ? signalRaw.split("/")[0] : signalRaw;
      
      return {
        ticker: item.ticker ?? "",
        price: item.trade_plan?.entry ?? item.price ?? 0,
        change: item.change ?? 0, 
        ema_200: item.ema_200 ?? 0,
        rsi: item.rsi ?? 0,
        win_rate_prob: item.confidence ?? item.win_rate_prob ?? 0,
        bandar_score: item.analysis?.foreign_flow === "Accumulation" ? 85 : item.analysis?.foreign_flow === "Distribution" ? 25 : item.bandar_score ?? 50,
        bandar_label: item.analysis?.foreign_flow ?? item.bandar_label ?? "NETRAL",
        spike_ratio: item.spike_ratio ?? 0,
        signal: signalClean,
        tp: item.trade_plan?.tp ?? undefined,
        sl: item.trade_plan?.sl ?? undefined,
        winrate: item.trade_plan?.winrate ?? undefined,
        order_type: item.trade_plan?.order_type ?? undefined,
      };
    });
  },

  /**
   * Get smart composite ranked screener picks.
   */
  getSmartScreener: async (weights?: string): Promise<SmartScreenerItem[]> => {
    const response = await api.get<any>("/market/screener/smart", {
      params: weights ? { weights } : {}
    });
    const raw = response.data?.results ?? response.data;
    const data = Array.isArray(raw) ? raw : [];
    return data.map(item => {
      return {
        ticker: item.ticker ?? "",
        composite_score: item.composite_score ?? 0.5,
        rank: item.rank ?? 0,
        label: (item.composite_score || 0) > 0.7 ? "STRONG BUY" : (item.composite_score || 0) > 0.5 ? "BUY" : "HOLD",
        fundamental_score: item.value_score ?? item.fundamental_score ?? 0,
        momentum_score: item.momentum_score ?? 0,
        price: item.price ?? 0,
      };
    });
  },

  /**
   * Get RSI and sector-relative RSI for a ticker
   */
  getTechnicalRSI: async (ticker: string): Promise<RSIResponse> => {
    const response = await api.get<RSIResponse>(`/market/technical/rsi/${ticker}`);
    return response.data;
  },


  /**
   * Get technical signal for a specific ticker
   */
  getMarketSignal: async (ticker: string): Promise<MarketSignal> => {
    const response = await api.get<MarketSignal>(`/market/signal/${ticker}`);
    return response.data;
  },

  /**
   * Get chart data for a specific ticker with Order Blocks
   */
  getChart: async (ticker: string, interval: string = "1d"): Promise<ChartResponse> => {
    const response = await api.get<ChartResponse>(`/market/chart/${ticker}`, {
      params: { interval },
    });
    return response.data;
  },

  /**
   * Run backtest simulation
   */
  runBacktest: async (ticker: string, initial_capital: number): Promise<BacktestResponse> => {
    const response = await api.post<BacktestResponse>("/market/backtest", {
      ticker,
      initial_capital,
    });
    return response.data;
  },

  /**
   * Get EarsRadar market intelligence context
   */
  getRadar: async (): Promise<RadarResponse> => {
    const response = await api.get<RadarResponse>("/market/radar");
    return response.data;
  },
  /**
   * Ask the IUS Brain Engine (Reasoning Loop)
   */
  askBrain: async (ticker: string, query: string): Promise<any> => {
    const response = await api.post("/market/brain", {
      ticker,
      query,
    });
    return response.data;
  },

  /**
   * Get intelligence synopsis/summary for the current market state
   */
  getSynopsis: async (): Promise<string> => {
    const response = await api.get<SynopsisResponse>("/market/synopsis");
    return response.data.synopsis ?? "";
  },

  /**
   * Get comprehensive system health and telemetry
   */
  getSystemHealth: async (): Promise<SystemHealthResponse> => {
    const response = await api.get<SystemHealthResponse>("/system/health");
    return response.data;
  },

  /**
   * Get intelligence context (Voted Decision & Scenarios)
   */
  getMarketIntelligence: async (ticker: string): Promise<any> => {
    const response = await api.get(`/market/intelligence/${ticker}`);
    return response.data;
  },

  /**
   * Get screener results by Tier
   */
  getTieredScreener: async (tier: number): Promise<ScreenerItem[]> => {
    const response = await api.get<any>(`/market/screener/tier/${tier}`);
    // Backend returns {tier, category, count, results: [...]}
    const raw = response.data?.results ?? response.data?.top_20 ?? response.data;
    const data = Array.isArray(raw) ? raw : [];
    return data.map(item => {
      const signalRaw = item.action ?? "HOLD";
      const signalClean = signalRaw.includes("/") ? signalRaw.split("/")[0] : signalRaw;

      return {
        ticker: item.ticker ?? "",
        price: item.trade_plan?.entry ?? item.price ?? 0,
        change: item.change ?? 0,
        ema_200: item.ema_200 ?? 0,
        rsi: item.rsi ?? 0,
        win_rate_prob: item.confidence ?? item.win_rate_prob ?? 0,
        bandar_score: item.analysis?.foreign_flow === "Accumulation" ? 85 : item.analysis?.foreign_flow === "Distribution" ? 25 : item.bandar_score ?? 50,
        bandar_label: item.analysis?.foreign_flow ?? item.bandar_label ?? "NETRAL",
        spike_ratio: item.spike_ratio ?? 0,
        signal: signalClean,
        tp: item.trade_plan?.tp ?? undefined,
        sl: item.trade_plan?.sl ?? undefined,
        winrate: item.trade_plan?.winrate ?? undefined,
        order_type: item.trade_plan?.order_type ?? undefined,
      };
    });
  },
};
