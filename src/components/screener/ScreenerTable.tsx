"use client";

import { StockDetailSheet } from "@/components/dashboard/StockDetailSheet";
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
import { ScreenerItem } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Target, TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";

interface ScreenerTableProps {
  data: ScreenerItem[];
  loading: boolean;
}

export function ScreenerTable({ data, loading }: ScreenerTableProps) {
  const [selectedTicker, setSelectedTicker] = React.useState<string | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleRowClick = (rowData: ScreenerItem) => {
    setSelectedTicker(rowData.ticker);
    setIsSheetOpen(true);
  };

  const columns = useMemo<ColumnDef<ScreenerItem>[]>(
    () => [
      {
        accessorKey: "ticker",
        header: "Aset",
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
                {row.original.is_fallback && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[7px] h-3 px-1 font-black leading-none">
                    FALLBACK
                  </Badge>
                )}
              </div>
              <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-500 transition-colors">
                {row.original.is_fallback ? "Secondary Node" : "AI Filtered"}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Harga",
        cell: ({ row }) => (
          <div className="font-mono text-white font-black text-lg tracking-tighter tabular-nums">
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
        header: "Perubahan",
        cell: ({ row }) => {
          const isPositive = row.original.change >= 0;
          return (
            <div
              className={cn(
                "flex items-center font-black text-[11px] px-4 py-1.5 rounded-full w-fit tracking-tighter",
                isPositive
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-rose-400 bg-rose-500/10 border border-rose-500/20",
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
        accessorKey: "rsi",
        header: "RSI Momentum",
        cell: ({ row }) => {
          const rsi = row.original.rsi;
          const isOverbought = rsi > 70;
          const isOversold = rsi < 30;
          return (
            <div className="space-y-2 w-32">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <span>RSI</span>
                <span
                  className={cn(
                    isOverbought
                      ? "text-rose-400"
                      : isOversold
                        ? "text-emerald-400"
                        : "text-zinc-400",
                  )}
                >
                  {rsi.toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-1000",
                    isOverbought
                      ? "bg-rose-500"
                      : isOversold
                        ? "bg-emerald-500"
                        : "bg-primary",
                  )}
                  style={{ width: `${rsi}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "winrate",
        header: "Win Rate",
        cell: ({ row }) => {
          const winRate =
            row.original.winrate ||
            `${(row.original.win_rate_prob || 0) * 100}%`;
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tighter">
                  {winRate}
                </span>
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest leading-none">
                  Keberhasilan
                </span>
              </div>
              <Target className="size-5 text-primary opacity-20" />
            </div>
          );
        },
      },
      {
        accessorKey: "tp",
        header: "Target (TP)",
        cell: ({ row }: { row: any }) => (
          <div className="font-mono text-emerald-400 font-bold text-sm tracking-tighter tabular-nums">
            {row.original.tp
              ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(row.original.tp)
              : "-"}
          </div>
        ),
      },
      {
        accessorKey: "sl",
        header: "SL",
        cell: ({ row }) => (
          <div className="font-mono text-rose-400 font-bold text-sm tracking-tighter tabular-nums">
            {row.original.sl
              ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(row.original.sl)
              : "-"}
          </div>
        ),
      },
      {
        accessorKey: "signal",
        header: "Rekomendasi",
        cell: ({ row }) => {
          const signal = row.original.signal;
          return (
            <div
              className={cn(
                "px-5 py-2.5 rounded-[1.5rem] border text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all min-w-[140px]",
                signal === "BUY"
                  ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : signal === "SELL"
                    ? "text-rose-400 border-rose-500/20 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                    : "text-white/40 border-white/5 bg-white/[0.02]",
              )}
            >
              {signal}
            </div>
          );
        },
      },
      {
        accessorKey: "order_type",
        header: "Tipe Action",
        cell: ({ row }) => (
          <div className="text-zinc-400 font-medium text-xs">
            {row.original.order_type || "-"}
          </div>
        ),
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
      <div className="p-8 space-y-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton
            key={i}
            className="h-24 w-full bg-white/[0.02] rounded-[2rem] border border-white/5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
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
                  className="px-10 py-10 h-auto text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700"
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
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => handleRowClick(row.original)}
              className="group hover:bg-white/[0.02] cursor-pointer transition-all duration-700 border-b border-white/5 last:border-0"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="px-10 py-8 group-hover:translate-x-1 transition-transform duration-500"
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
      />
    </div>
  );
}
