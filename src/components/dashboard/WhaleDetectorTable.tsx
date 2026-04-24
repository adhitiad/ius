"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Waves as Whale } from "lucide-react";

export interface WhaleData {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change: number;
  volume: string;
  bandarPower: number; // 0 - 100
  signal: 'ACCUMULATION' | 'DISTRIBUTION' | 'NEUTRAL';
}

interface WhaleDetectorTableProps {
  data: WhaleData[];
}

export function WhaleDetectorTable({ data }: WhaleDetectorTableProps) {
  const columns = useMemo<ColumnDef<WhaleData>[]>(
    () => [
      {
        accessorKey: "ticker",
        header: "Ticker",
        cell: ({ row }) => (
          <div className="font-black text-lg tracking-tighter text-white">
            {row.original.ticker}
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Company",
        cell: ({ row }) => (
          <div className="text-zinc-400 text-xs font-medium">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <div className="font-mono text-zinc-300">
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.original.price)}
          </div>
        ),
      },
      {
        accessorKey: "change",
        header: "Change",
        cell: ({ row }) => {
          const isPositive = row.original.change >= 0;
          return (
            <div className={cn(
              "flex items-center font-bold",
              isPositive ? "text-emerald-500" : "text-rose-500"
            )}>
              {isPositive ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
              {row.original.change}%
            </div>
          );
        },
      },
      {
        accessorKey: "bandarPower",
        header: "Bandar Power",
        cell: ({ row }) => {
          const power = row.original.bandarPower;
          const isHigh = power > 80;
          
          return (
            <div className="w-full max-w-[200px] space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className={cn(isHigh ? "text-emerald-400 animate-pulse" : "text-zinc-500")}>
                  {isHigh ? "Whale Detected" : "Power Level"}
                </span>
                <span className="text-white">{power}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden p-[1px]">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    isHigh && "animate-pulse"
                  )}
                  style={{
                    width: `${power}%`,
                    background:
                      "linear-gradient(90deg, rgba(244,63,94,0.95) 0%, rgba(245,158,11,0.95) 45%, rgba(34,197,94,0.95) 100%)",
                  }}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "signal",
        header: "AI Signal",
        cell: ({ row }) => {
          const signal = row.original.signal;
          const power = row.original.bandarPower;
          
          if (power > 80) {
            return (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/50 rounded-full text-emerald-500 animate-bounce">
                <Whale className="size-4 animate-pulse" />
                <span className="text-[10px] font-black uppercase">Whale Alert</span>
              </div>
            );
          }

          return (
            <div className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              signal === 'ACCUMULATION' ? "text-emerald-400" : 
              signal === 'DISTRIBUTION' ? "text-rose-400" : "text-zinc-500"
            )}>
              {signal}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-white/5">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-white/5">
          {!table.getRowModel().rows.length && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm text-zinc-500"
              >
                Data screener belum tersedia atau tidak ada ticker untuk filter ini.
              </td>
            </tr>
          )}
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-6 transition-transform group-hover:translate-x-1 duration-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
