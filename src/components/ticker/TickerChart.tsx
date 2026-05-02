"use client";

import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartData {
  date: string;
  price: number;
  volume: number;
}

interface TickerChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-4 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-zinc-400">Price</span>
            <span className="text-sm font-bold text-white">
              IDR {payload[0].value.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-8 pt-2 border-t border-zinc-800">
            <span className="text-xs text-zinc-500">Volume</span>
            <span className="text-sm font-semibold text-indigo-400">
              {payload[1].value.toLocaleString()} Shares
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function TickerChart({ data }: TickerChartProps) {
  return (
    <div className="w-full h-[500px] bg-zinc-900/10 backdrop-blur-sm border border-zinc-800 rounded-3xl p-6 overflow-hidden relative group">
      {/* Chart Title */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-4 bg-indigo-500 rounded-full" />
          <h3 className="text-lg font-bold text-white tracking-tight">Price & Volume Integration</h3>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Closing Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Daily Volume</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            dy={20}
            tickFormatter={(value) => {
              const d = new Date(value);
              return d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
            }}
          />
          {/* Price Axis */}
          <YAxis 
            yAxisId="price"
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            orientation="right"
            tickFormatter={(value) => `Rp${(value / 1000).toFixed(1)}k`}
          />
          {/* Volume Axis (Hidden from visual but used for scaling) */}
          <YAxis 
            yAxisId="volume"
            hide
            domain={[0, (dataMax: number) => dataMax * 4]} // Scales volume bars for bottom section
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }}
          />

          <Bar
            yAxisId="volume"
            dataKey="volume"
            fill="#27272a"
            radius={[4, 4, 0, 0]}
            barSize={12}
            animationDuration={2000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#4f46e5' : '#27272a'} opacity={0.6} />
            ))}
          </Bar>

          <Line
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke="#ffffff"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 }}
            animationDuration={2500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
