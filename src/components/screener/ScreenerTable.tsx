"use client";

import { StockDetailSheet } from "@/components/dashboard/StockDetailSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import * as React from "react";
import { useMemo } from "react";

interface ScreenerTableProps {
  data: ScreenerItem[];
  loading: boolean;
}

const MotionTableBody = motion(TableBody);
const MotionTableRow = motion(TableRow);

export function ScreenerTable({ data, loading }: ScreenerTableProps) {
  const [selectedTicker, setSelectedTicker] = React.useState<string | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const handleRowClick = (rowData: ScreenerItem) => {
    setSelectedTicker(rowData.ticker);
    setIsSheetOpen(true);
  };

  const columns = useMemo<ColumnDef<ScreenerItem>[]>(
    () => [
      {
        accessorKey: "ticker",
        header: "ASSET NODE",
        cell: ({ row }) => (
          <div className="flex items-center gap-6">
            <div className="relative group/logo">
              <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500" />
              <div className="size-14 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center font-black text-xs text-zinc-500 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-500 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {row.original.ticker.substring(0, 2)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="font-black text-2xl tracking-tighter text-white group-hover:text-primary transition-colors duration-500 italic uppercase">
                  {row.original.ticker}
                </div>
                {row.original.is_fallback && (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[7px] h-4 px-1.5 font-black leading-none uppercase tracking-widest"
                  >
                    FALLBACK
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                  {row.original.is_fallback
                    ? "Secondary Network"
                    : "Verified Intelligence"}
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "CURRENT PRICE",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <div className="font-mono text-white font-black text-lg tracking-tighter tabular-nums">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(row.original.price)}
            </div>
            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest leading-none mt-1">
              Real-time Node
            </span>
          </div>
        ),
      },
      {
        accessorKey: "change",
        header: "VOLATILITY",
        cell: ({ row }) => {
          const isPositive = row.original.change >= 0;
          return (
            <div
              className={cn(
                "flex items-center font-black text-[11px] px-4 py-2 rounded-xl w-fit tracking-tighter transition-all duration-500",
                isPositive
                  ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                  : "text-rose-400 bg-rose-500/5 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]",
              )}
            >
              {isPositive ? (
                <TrendingUp className="size-3.5 mr-2" />
              ) : (
                <TrendingDown className="size-3.5 mr-2" />
              )}
              {isPositive ? "+" : ""}
              {row.original.change}%
            </div>
          );
        },
      },
      {
        accessorKey: "rsi",
        header: "MOMENTUM CORE",
        cell: ({ row }) => {
          const rsi = row.original.rsi;
          const isOverbought = rsi > 70;
          const isOversold = rsi < 30;
          return (
            <div className="space-y-2.5 w-36">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                <span className="flex items-center gap-1">
                  <Zap className="size-2.5" /> RSI INDEX
                </span>
                <span
                  className={cn(
                    "tabular-nums",
                    isOverbought
                      ? "text-rose-400"
                      : isOversold
                        ? "text-emerald-400"
                        : "text-primary",
                  )}
                >
                  {rsi.toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900/50 border border-white/5 rounded-full overflow-hidden p-[1px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rsi}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]",
                    isOverbought
                      ? "bg-rose-500 text-rose-500"
                      : isOversold
                        ? "bg-emerald-500 text-emerald-500"
                        : "bg-primary text-primary",
                  )}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "winrate",
        header: "ACCURACY PROB",
        cell: ({ row }) => {
          const winRate =
            row.original.winrate ||
            `${(row.original.win_rate_prob || 0) * 100}%`;
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tighter uppercase">
                  {winRate}
                </span>
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em] leading-none mt-0.5">
                  Confidence
                </span>
              </div>
              <div className="size-8 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <ShieldCheck className="size-4 text-primary/40" />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "signal",
        header: "NEURAL RECOMMENDATION",
        cell: ({ row }) => {
          const signal = row.original.signal;
          return (
            <div
              className={cn(
                "relative px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all min-w-[150px] overflow-hidden group/signal",
                signal === "BUY"
                  ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
                  : signal === "SELL"
                    ? "text-rose-400 border-rose-500/20 bg-rose-500/5 shadow-[0_0_25px_rgba(244,63,94,0.15)]"
                    : "text-zinc-500 border-white/5 bg-white/[0.02]",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover/signal:translate-x-full transition-transform duration-1000" />
              {signal || "ANALYZING"}
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
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const signalFilter =
    (columnFilters.find((f) => f.id === "signal")?.value as string) || "ALL";

  if (loading && !data.length) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton
            key={i}
            className="h-28 w-full bg-white/[0.02] rounded-[1.5rem] border border-white/5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {/* Table Filters Toolbar */}
      <div className="px-10 py-6 bg-white/[0.02] border-y border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5">
            <Filter className="size-3 text-zinc-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Signal Filter
            </span>
          </div>
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/5">
            {["ALL", "BUY", "SELL"].map((sig) => (
              <button
                key={sig}
                onClick={() =>
                  table
                    .getColumn("signal")
                    ?.setFilterValue(sig === "ALL" ? undefined : sig)
                }
                className={cn(
                  "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  signalFilter === sig
                    ? "bg-primary text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "text-zinc-600 hover:text-white",
                )}
              >
                {sig}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
            Node {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-xl bg-zinc-950 border-white/5 hover:bg-white/5 disabled:opacity-20"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-xl bg-zinc-950 border-white/5 hover:bg-white/5 disabled:opacity-20"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative rounded-[2rem] border border-white/5 bg-zinc-950/20 backdrop-blur-xl overflow-hidden shadow-2xl mx-6 mb-12">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-white/5 hover:bg-transparent bg-white/[0.01]"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-10 py-10 h-auto text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 whitespace-nowrap"
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
            <MotionTableBody
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence mode="popLayout">
                {table.getRowModel().rows.map((row) => (
                  <MotionTableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.original)}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group hover:bg-white/[0.03] cursor-pointer transition-all duration-500 border-b border-white/5 last:border-0 relative overflow-hidden"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-10 py-8 group-hover:bg-primary/[0.01] transition-colors duration-500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    {/* Hover indicator line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-12 bg-primary transition-all duration-500 rounded-full shadow-[0_0_15px_var(--color-primary)] opacity-0 group-hover:opacity-100" />
                  </MotionTableRow>
                ))}
              </AnimatePresence>
            </MotionTableBody>
          </Table>
        </div>
      </div>

      <StockDetailSheet
        ticker={selectedTicker}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}
