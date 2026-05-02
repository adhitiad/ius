"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TrendingDown, TrendingUp, Waves as Whale } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";
import { StockDetailSheet } from "./StockDetailSheet";
import { StockSparkline } from "./StockSparkline";
import { Badge } from "@/components/ui/badge";

export interface WhaleData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  bandarPower: number;
  signal: "ACCUMULATION" | "DISTRIBUTION" | "NEUTRAL";
  source?: string;
  isFallback?: boolean;
}

export interface WhaleDetectorTableProps {
  data: WhaleData[];
  loading: boolean;
}

const generateTrend = (len = 12, range = 40) => {
  return Array.from(
    { length: len },
    () => Math.floor(Math.random() * range) + 30,
  );
};

export function WhaleDetectorTable({ data, loading }: WhaleDetectorTableProps) {
  const [selectedTicker, setSelectedTicker] = React.useState<string | null>(
    null,
  );
  const [selectedData, setSelectedData] = React.useState<WhaleData | undefined>(
    undefined,
  );
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleRowClick = (rowData: WhaleData) => {
    setSelectedTicker(rowData.ticker);
    setSelectedData(rowData);
    setIsSheetOpen(true);
  };

  const columns = useMemo<ColumnDef<WhaleData>[]>(
    () => [
      {
        accessorKey: "ticker",
        header: "Ticker Asset",
        cell: ({ row }) => (
          <div className="flex items-center gap-6">
            <div className="size-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-black text-xs text-zinc-600 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500 shadow-inner">
              {row.original.ticker.substring(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="font-black text-2xl tracking-tighter text-white group-hover:text-primary transition-colors duration-500 italic">
                  {row.original.ticker}
                </div>
                {row.original.isFallback && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[7px] h-4 px-1 font-black tracking-tighter uppercase leading-none">
                    Fallback
                  </Badge>
                )}
              </div>
              <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-500 transition-colors">
                {row.original.isFallback ? "Secondary Protocol" : "Verified Intelligence"}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Nilai Tukar",
        cell: ({ row }) => (
          <div className="font-mono text-white font-black text-lg tracking-tighter drop-shadow-sm tabular-nums">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(row.original.price)}
          </div>
        ),
      },
      {
        accessorKey: "change",
        header: "Volatilitas",
        cell: ({ row }) => {
          const isPositive = row.original.change >= 0;
          return (
            <div
              className={cn(
                "flex items-center font-black text-[11px] px-4 py-1.5 rounded-full w-fit tracking-tighter",
                isPositive
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "text-rose-400 bg-rose-500/10 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
              )}
            >
              {isPositive ? (
                <TrendingUp className="size-3 mr-2" />
              ) : (
                <TrendingDown className="size-3 mr-2" />
              )}
              {isPositive ? "+" : ""}
              {row.original.change}%
            </div>
          );
        },
      },
      {
        id: "momentum",
        header: "Flow Vektor",
        cell: ({ row }) => {
          const isPositive = row.original.change >= 0;
          const trend = useMemo(
            () => [40, 45, 42, 48, 44, 52, 50, 55, 53, 58],
            [],
          );
          return (
            <div className="w-24 h-12 group-hover:scale-110 transition-transform duration-500">
              <StockSparkline
                data={trend}
                color={isPositive ? "#10b981" : "#f43f5e"}
              />
            </div>
          );
        },
      },
      {
        accessorKey: "bandarPower",
        header: "Neural Power",
        cell: ({ row }) => {
          const power = row.original.bandarPower;
          const isHigh = power > 80;

          return (
            <div className="w-full max-w-[200px] space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2rem] leading-none">
                <span
                  className={cn(
                    isHigh
                      ? "text-emerald-400 drop-shadow-[0_0_8px_#10b981]"
                      : "text-zinc-600",
                  )}
                >
                  {isHigh ? "AKUMULASI MASIF" : "ALIRAN NORMAL"}
                </span>
                <span className="text-white font-mono">{power}%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.03] rounded-full p-0.5 border border-white/5 shadow-inner">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    isHigh && "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
                  )}
                  style={{
                    width: `${power}%`,
                    background: isHigh
                      ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)"
                      : "linear-gradient(90deg, #3f3f46 0%, #71717a 100%)",
                  }}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "signal",
        header: "Putusan Brain",
        cell: ({ row }) => {
          const signal = row.original.signal;
          const power = row.original.bandarPower;

          if (power > 80) {
            return (
              <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-emerald-500 text-black rounded-[2rem] animate-in zoom-in duration-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform">
                <Whale className="size-4" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">
                  Sniper Buy Bandar
                </span>
              </div>
            );
          }

          return (
            <div
              className={cn(
                "px-4 py-2.5 rounded-[1.5rem] border text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all min-w-[120px]",
                signal === "ACCUMULATION"
                  ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 group-hover:bg-emerald-500/10"
                  : signal === "DISTRIBUTION"
                    ? "text-rose-400 border-rose-500/20 bg-rose-500/5"
                    : "text-zinc-600 border-white/5 bg-white/[0.02]",
              )}
            >
              {signal === "ACCUMULATION"
                ? "OPTIMIS"
                : signal === "DISTRIBUTION"
                  ? "WASPADA"
                  : "NETRAL"}
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading && !data.length) {
    return (
      <div className="p-8 space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between py-6 border-b border-white/5 last:border-0 opacity-50 animate-pulse"
          >
            <div className="flex gap-6 items-center">
              <Skeleton className="h-10 w-16 rounded-xl bg-white/5" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-32 bg-white/5" />
                <Skeleton className="h-3 w-20 bg-white/5" />
              </div>
            </div>
            <Skeleton className="h-10 w-40 rounded-2xl bg-white/5" />
            <Skeleton className="h-10 w-28 rounded-2xl bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto selection:bg-emerald-500/30">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-white/5 hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-10 py-8 h-auto text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {!table.getRowModel().rows.length && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-10 py-40 text-center text-zinc-800 font-black italic uppercase tracking-[1em] text-xs blur-[0.5px] hover:blur-0 transition-all"
              >
                Aliran neural sedang tertunda...
              </TableCell>
            </TableRow>
          )}
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              role="button"
              tabIndex={0}
              aria-label={`Lihat detail untuk ${row.original.ticker}`}
              onClick={() => handleRowClick(row.original)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRowClick(row.original);
                }
              }}
              className="group hover:bg-emerald-500/[0.03] cursor-pointer transition-all duration-700 border-b border-white/5 last:border-0 relative outline-none focus-visible:bg-emerald-500/10 focus-visible:ring-1 focus-visible:ring-primary/50"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="px-10 py-10 transition-all group-hover:translate-x-2 group-focus-visible:translate-x-2 duration-700 h-auto"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <StockDetailSheet
        ticker={selectedTicker}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        initialData={selectedData}
      />
    </div>
  );
}
