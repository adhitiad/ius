"use client";

import { useEffect, useRef, useCallback } from "react";
import { throttle } from "lodash-es";
import { useMarketStore, TickerData } from "@/store/useMarketStore";

const DEFAULT_MARKET_WS_URL = "wss://ap1.aiuiso.site/api/v1/ws/market-stream";

const toNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const getMarketWebSocketUrl = () => {
  const configuredMarketUrl = process.env.NEXT_PUBLIC_MARKET_WS_URL;
  if (configuredMarketUrl) {
    return configuredMarketUrl.replace(/\/+$/, "");
  }

  const configuredBaseUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (configuredBaseUrl) {
    return `${configuredBaseUrl.replace(/\/+$/, "")}/ws/market-stream`;
  }

  return DEFAULT_MARKET_WS_URL;
};

const normalizeMarketItem = (item: any): Partial<TickerData> | null => {
  // Cek jika ini adalah format baru yang dibungkus metadata
  const isWrapped = item?.ticker && item?.data && item?.metadata;
  const data = isWrapped ? item.data : item;
  const metadata = isWrapped ? item.metadata : null;

  const symbol = data?.symbol ?? data?.ticker ?? data?.code ?? data?.s ?? item?.ticker;
  if (!symbol) return null;

  return {
    symbol: String(symbol).toUpperCase(),
    price: toNumber(data?.price ?? data?.last_price ?? data?.close ?? data?.current ?? data?.c),
    change: toNumber(data?.change ?? data?.price_change ?? data?.p),
    changePercent: toNumber(data?.changePercent ?? data?.change_percent ?? data?.percent ?? data?.P),
    volume: toNumber(data?.volume ?? data?.v),
    lastUpdate: toNumber(data?.lastUpdate ?? data?.timestamp ?? data?.E) ?? Date.now(),
    source: metadata?.source,
    isFallback: metadata?.is_fallback,
    ingestedAt: metadata?.ingested_at,
  };
};

const extractMarketUpdates = (payload: any): Record<string, Partial<TickerData>> => {
  const updates: Record<string, Partial<TickerData>> = {};
  
  // Deteksi format tunggal (wrapped) vs batch
  if (payload?.ticker && payload?.data && payload?.metadata) {
    const normalized = normalizeMarketItem(payload);
    if (normalized?.symbol) {
      updates[normalized.symbol] = normalized;
      return updates;
    }
  }

  const candidate = payload?.data ?? payload?.payload ?? payload?.prices ?? payload?.ticks ?? payload?.items ?? payload;
  const items = Array.isArray(candidate) ? candidate : [candidate];

  for (const item of items) {
    if (!item || typeof item !== "object") continue;

    const normalized = normalizeMarketItem(item);
    if (normalized?.symbol) {
      updates[normalized.symbol] = normalized;
      continue;
    }

    for (const [symbol, value] of Object.entries(item)) {
      if (!value || typeof value !== "object") continue;
      const nested = normalizeMarketItem({ symbol, ...(value as Record<string, unknown>) });
      if (nested?.symbol) {
        updates[nested.symbol] = nested;
      }
    }
  }

  return updates;
};

export function useMarketSocket() {
  const updatePrices = useMarketStore((state) => state.updatePrices);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bufferRef = useRef<Record<string, Partial<TickerData>>>({});
  const retryCountRef = useRef(0);

  // Throttled flush function using lodash
  const throttledUpdate = useCallback(
    throttle((data: Record<string, Partial<TickerData>>) => {
      updatePrices(data);
    }, 500, { leading: false, trailing: true }),
    [updatePrices]
  );

  const connect = useCallback(() => {
    // Avoid double connections in StrictMode if possible, though readyState check is safer
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const marketWsUrl = getMarketWebSocketUrl();
    console.log(`Connecting to WebSocket: ${marketWsUrl}`);
    const socket = new WebSocket(marketWsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      retryCountRef.current = 0;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        const updates = extractMarketUpdates(data);
        if (Object.keys(updates).length > 0) {
          bufferRef.current = { ...bufferRef.current, ...updates };
          throttledUpdate(bufferRef.current);
          bufferRef.current = {};
        }
      } catch (err) {
        console.error("❌ WS Message Parse Error:", err);
      }
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log("ℹ️ WebSocket Closed Cleanly");
      } else {
        console.log("⚠️ WebSocket Connection Lost");
        
        // Exponential backoff reconnect
        const nextRetryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
        console.log(`🔄 Reconnecting in ${nextRetryDelay}ms... (Attempt ${retryCountRef.current + 1})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          retryCountRef.current++;
          connect();
        }, nextRetryDelay);
      }
    };

    socket.onerror = (error) => {
      console.error("Socket Error:", error);
      // Let onclose handle the reconnect
    };
  }, []);

  // Performance Optimization: Lodash Throttling handled in onmessage

  // Lifecycle Management
  useEffect(() => {
    connect();

    return () => {
      console.log("🔌 Cleaning up WebSocket...");
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [connect]);

  return {
    isConnected: socketRef.current?.readyState === WebSocket.OPEN,
    retryCount: retryCountRef.current
  };
}
