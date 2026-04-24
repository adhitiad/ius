import React from 'react';

/**
 * CandlestickShape
 * Komponen kustom untuk merender candle dalam Recharts.
 * Digunakan sebagai properti `shape` pada komponen <Bar /> atau <Cell />.
 */

interface CandlestickShapeProps {
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  yScale?: (value: number) => number;
}

export const CandlestickShape: React.FC<CandlestickShapeProps> = (props) => {
  const { x, y, width, height, payload, yScale } = props;

  if (!x || !y || !width || !height || !payload || !yScale) {
    return null;
  }

  const { open, high, low, close } = payload;
  const isBullish = close >= open;
  const color = isBullish ? '#22c55e' : '#ef4444';

  // 1. Koordinat Y untuk Sumbu (High & Low)
  const yHigh = yScale(high);
  const yLow = yScale(low);
  const centerX = x + width / 2;

  // 2. Koordinat Y untuk Tubuh (Open & Close)
  const yOpen = yScale(open);
  const yClose = yScale(close);
  const bodyY = Math.min(yOpen, yClose);
  const bodyHeight = Math.abs(yOpen - yClose);

  return (
    <g className="candlestick-group">
      {/* Sumbu (Wick) - High to Low */}
      <path
        d={`M${centerX},${yHigh} L${centerX},${yLow}`}
        stroke={color}
        strokeWidth={1.5}
      />
      
      {/* Tubuh (Body) - Open to Close */}
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={Math.max(bodyHeight, 1)} // Minimal 1px agar tetap terlihat jika Open == Close
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};
