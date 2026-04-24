import api from "@/lib/api";
import {
  MarketSignal,
  NewsTickerResponse,
  ScreenerItem,
  ScreenerResponse,
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
   * Get market screener top picks.
   */
  getScreener: async (): Promise<ScreenerItem[]> => {
    const response = await api.get<ScreenerResponse>("/market/screener");
    return response.data.top_20 ?? [];
  },

  /**
   * Get technical signal for a specific ticker
   */
  getMarketSignal: async (ticker: string): Promise<MarketSignal> => {
    const response = await api.get<MarketSignal>(`/market/signal/${ticker}`);
    return response.data;
  },
};
