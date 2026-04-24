import { useState, useEffect } from "react";
import axios from "axios";

export interface StockData {
  ticker: string;
  price: number;
  change: number;
  volumeSpike: string;
  sentiment: "Positive" | "Negative";
}

export interface MarketStats {
  ihsg: { value: string; change: string; up: boolean };
  activeSignals: number;
  winRate: string;
  topGainerSentiment: string;
}

export function useMarketData() {
  const [data, setData] = useState<{ stocks: StockData[]; stats: MarketStats } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulasi fetch data dari API (nantinya akan ke endpoint Python)
        // const response = await axios.get("/api/market-hub");
        
        // Data Dummy untuk sementara
        const dummyStocks: StockData[] = [
          { ticker: "BBCA", price: 10150, change: 0.75, volumeSpike: "1.2x", sentiment: "Positive" },
          { ticker: "BBRI", price: 4780, change: -1.2, volumeSpike: "0.8x", sentiment: "Negative" },
          { ticker: "TLKM", price: 3820, change: 1.5, volumeSpike: "2.1x", sentiment: "Positive" },
          { ticker: "ASII", price: 5125, change: -0.5, volumeSpike: "1.0x", sentiment: "Negative" },
          { ticker: "GOTO", price: 68, change: 4.2, volumeSpike: "3.5x", sentiment: "Positive" },
          { ticker: "BMRI", price: 6950, change: 0.3, volumeSpike: "0.9x", sentiment: "Positive" },
          { ticker: "AMMN", price: 8900, change: -2.1, volumeSpike: "1.5x", sentiment: "Negative" },
          { ticker: "BBNI", price: 5200, change: 0.1, volumeSpike: "0.7x", sentiment: "Positive" },
          { ticker: "UNVR", price: 3120, change: -0.8, volumeSpike: "1.1x", sentiment: "Negative" },
          { ticker: "BRPT", price: 980, change: 5.6, volumeSpike: "4.2x", sentiment: "Positive" },
        ];

        const dummyStats: MarketStats = {
          ihsg: { value: "7,125.40", change: "+0.45%", up: true },
          activeSignals: 24,
          winRate: "72.8%",
          topGainerSentiment: "Sektor Perbankan",
        };

        // Simulasi network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        setData({ stocks: dummyStocks, stats: dummyStats });
      } catch (err) {
        setError("Gagal memuat data pasar");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
