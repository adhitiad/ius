"use client";

import { useEffect, useRef, useCallback } from "react";
import { throttle } from "lodash-es";
import { useMarketStore, TickerData } from "@/store/useMarketStore";

const WS_URL = "wss://stream.binance.com:9443/ws/!ticker@arr";

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

    console.log(`Connecting to WebSocket: ${WS_URL}`);
    const socket = new WebSocket(WS_URL);
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
        
        // Binance !ticker@arr returns an array of ticker objects
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.s) {
              const symbol = item.s;
              bufferRef.current[symbol] = {
                symbol,
                price: parseFloat(item.c),
                change: parseFloat(item.p),
                changePercent: parseFloat(item.P),
                volume: parseFloat(item.v),
                lastUpdate: item.E
              };
            }
          });
          
          // Trigger throttled update
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
