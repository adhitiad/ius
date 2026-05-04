import { useState, useEffect } from "react";
import { marketService } from "@/services/marketService";
import { ScreenerItem, SystemHealthResponse, MarketInsights } from "@/types/api";

export interface StockData extends ScreenerItem {}

export interface MarketStats {
  ihsg: { 
    value: string; 
    change: string; 
    up: boolean;
    source?: string;
    isFallback?: boolean;
  };
  majorIndices: { 
    code: string; 
    value: string; 
    change: string; 
    up: boolean;
    source?: string;
    isFallback?: boolean;
  }[];
  activeSignals: number;
  winRate: string;
  topGainerSentiment: string;
  compositeSentiment: string;
  avgRSI: number;
  telemetry: SystemHealthResponse | null;
  synopsis: string;
}

export interface MarketDataState {
  stocks: StockData[];
  stats: MarketStats;
  insights: MarketInsights | null;
}

/**
 * Hook to manage market intelligence data fetching
 */
export function useMarketData(tier?: number, timeframe: string = "daily") {
  const [data, setData] = useState<MarketDataState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch data with graceful error handling per request
        const [
          screenerData, 
          radarData, 
          systemHealth, 
          smartScreener, 
          brainSynopsis,
          insightsData
        ] = await Promise.all([
          (tier ? marketService.getTieredScreener(tier, timeframe) : marketService.getScreener(timeframe)).catch(() => []),
          marketService.getRadar().catch(() => ({ market_indices: [] })),
          marketService.getSystemHealth().catch(() => null),
          marketService.getSmartScreener(timeframe).catch(() => []),
          marketService.getSynopsis().catch(() => ""),
          marketService.getMarketInsights().catch(() => null)
        ]);

        // 2. Map Screener data to StockData
        const stocks: StockData[] = Array.isArray(screenerData) ? screenerData : [];

        // 3. Extract IHSG and Major Indices from Radar
        const ihsgIdx = radarData.market_indices?.find(idx => idx.IndexCode === "IHSG");
        const majorIndices = (radarData.market_indices || [])
          .filter(idx => idx.IndexCode !== "IHSG")
          .map(idx => ({
            code: idx.IndexCode,
            value: idx.Current,
            change: idx.Percent,
            up: !String(idx.Change ?? "0").startsWith("-"),
            source: idx.source,
            isFallback: idx.is_fallback
          }));
        
        // 4. Derived Stats (Using real data where available)
        const stats: MarketStats = {
          ihsg: { 
            value: ihsgIdx?.Current || "0,000.00", 
            change: ihsgIdx?.Percent || "0.00%", 
            up: !String(ihsgIdx?.Change ?? "0").startsWith("-"),
            source: ihsgIdx?.source,
            isFallback: ihsgIdx?.is_fallback
          },
          majorIndices: majorIndices,
          activeSignals: stocks.filter(s => s.signal.includes("BUY")).length,
          winRate: `${stocks.length > 0 ? (stocks.reduce((acc, s) => acc + s.win_rate_prob, 0) / stocks.length * 100).toFixed(1) : "0"}%`,
          topGainerSentiment: "Sektor Perbankan",
          compositeSentiment: smartScreener.length > 0 ? smartScreener[0].label : "NEUTRAL",
          avgRSI: stocks.length > 0 ? (stocks.reduce((acc, s) => acc + s.rsi, 0) / stocks.length) : 0,
          telemetry: systemHealth,
          synopsis: brainSynopsis,
        };

        setData({ stocks, stats, insights: insightsData });
      } catch (err) {
        console.error("Market Data Hub Error:", err);
        setError("Gagal sinkronisasi dengan UIS-OTAK Core");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tier]);

  return { data, loading, error };
}
