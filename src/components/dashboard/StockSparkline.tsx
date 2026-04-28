"use client";

import React from "react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

interface StockSparklineProps {
  data: number[];
  color?: string;
  className?: string;
}

export function StockSparkline({ data, color = "#10b981", className }: StockSparklineProps) {
  // Map simple number array to Recharts format
  const chartData = data.map((val, i) => ({ value: val }));

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={["dataMin - 1", "dataMax + 1"]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={2000}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
