"use client";

import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { CandlestickShape } from "./CandlestickShape";
import { generateSMCData, OHLCData, OrderBlock, StructureLine } from "@/lib/mockData";

interface SMCChartProps {
  dataOverride?: {
    ohlc: OHLCData[];
    orderBlocks: OrderBlock[];
    structureLines: StructureLine[];
  };
}

export function SMCChart({ dataOverride }: SMCChartProps) {
  // Gunakan data dari props atau generate mock data secara default
  const { ohlc, orderBlocks, structureLines } = dataOverride || generateSMCData();

  return (
    <div className="w-full h-[500px] bg-zinc-950/50 backdrop-blur-md rounded-3xl border border-zinc-800 p-6 shadow-2xl relative">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          SMC <span className="text-blue-500">Analytics</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 font-bold border border-zinc-700">PRO</span>
        </h3>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Smart Money Concepts Visualization</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={ohlc}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#18181b" 
            vertical={false} 
          />
          
          <XAxis 
            dataKey="time" 
            stroke="#3f3f46" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#71717a' }}
            minTickGap={30}
          />
          
          <YAxis 
            domain={['dataMin - 100', 'dataMax + 100']}
            orientation="right"
            stroke="#3f3f46"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#71717a' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
            itemStyle={{ color: '#ffffff', fontSize: '12px' }}
            labelStyle={{ color: '#71717a', fontSize: '10px', marginBottom: '4px', fontWeight: 'bold' }}
          />

          {/* 1. Render Order Blocks (Reference Areas) */}
          {orderBlocks.map((ob, index) => (
            <ReferenceArea
              key={`ob-${index}`}
              x1={ob.startX}
              x2={ob.endX}
              y1={ob.y1}
              y2={ob.y2}
              fill={ob.type === 'demand' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'}
              stroke={ob.type === 'demand' ? '#22c55e' : '#ef4444'}
              strokeOpacity={0.2}
              label={{
                position: 'insideTopLeft',
                fill: ob.type === 'demand' ? '#22c55e' : '#ef4444',
                fontSize: 10,
                fontWeight: 'bold',
                value: ob.type === 'demand' ? 'DEMAND' : 'SUPPLY',
                offset: 5
              }}
            />
          ))}

          {/* 2. Render Structure Lines (BOS/CHoCH) */}
          {structureLines.map((line, index) => (
            <ReferenceLine
              key={`sl-${index}`}
              y={line.y}
              stroke="#52525b"
              strokeDasharray="5 5"
              label={{
                value: line.label,
                position: 'right',
                fill: '#a1a1aa',
                fontSize: 10,
                fontWeight: 'heavy',
                className: 'font-mono'
              }}
            />
          ))}

          {/* 3. Render Candlesticks using custom shape */}
          <Bar
            dataKey="close"
            shape={<CandlestickShape />}
            animationDuration={800}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
