"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface DataPoint {
  date: string;
  equity: number;
  benchmark: number;
}

interface EquityChartProps {
  data: DataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-4 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-zinc-300">Strategy Equity</span>
            <span className="text-sm font-bold text-blue-400">
              IDR {payload[0].value.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-zinc-500">Benchmark (IHSG)</span>
            <span className="text-sm font-semibold text-zinc-500">
              IDR {payload[1].value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function EquityChart({ data }: EquityChartProps) {
  return (
    <div className="w-full h-[400px] bg-zinc-900/20 rounded-2xl border border-zinc-800/50 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorEquity)"
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="benchmark"
            stroke="#52525b"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
