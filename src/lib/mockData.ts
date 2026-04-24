/**
 * Mock Data Generator for Smart Money Concepts (SMC)
 * Digunakan untuk visualisasi Charting (OHLC, Order Blocks, Structure Lines)
 */

export interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBlock {
  startX: string;
  endX: string;
  y1: number;
  y2: number;
  type: 'demand' | 'supply';
}

export interface StructureLine {
  x1: string;
  x2: string;
  y: number;
  label: 'BOS' | 'CHoCH';
}

export const generateSMCData = () => {
  const data: OHLCData[] = [];
  let currentPrice = 50000;
  const now = new Date();
  
  // 1. Generate 50 OHLC Candles
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - (50 - i) * 15 * 60 * 1000); // 15m intervals
    const timeStr = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const volatility = 200;
    const open = currentPrice;
    const close = open + (Math.random() - 0.45) * volatility; // Slight bullish bias
    const high = Math.max(open, close) + Math.random() * 50;
    const low = Math.min(open, close) - Math.random() * 50;
    const volume = Math.floor(Math.random() * 1000) + 500;
    
    data.push({
      time: timeStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });
    
    currentPrice = close;
  }

  // 2. Mock Order Blocks
  // Biasanya terletak di area pivot atau breakout
  const orderBlocks: OrderBlock[] = [
    {
      startX: data[10].time,
      endX: data[25].time,
      y1: data[10].low - 100,
      y2: data[10].low + 50,
      type: 'demand'
    },
    {
      startX: data[35].time,
      endX: data[49].time,
      y1: data[35].high - 50,
      y2: data[35].high + 100,
      type: 'supply'
    }
  ];

  // 3. Mock Structure Lines (BOS/CHoCH)
  const structureLines: StructureLine[] = [
    {
      x1: data[15].time,
      x2: data[25].time,
      y: data[15].high,
      label: 'BOS'
    },
    {
      x1: data[40].time,
      x2: data[48].time,
      y: data[40].low,
      label: 'CHoCH'
    }
  ];

  return {
    ohlc: data,
    orderBlocks,
    structureLines
  };
};
