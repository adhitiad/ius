"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const isMobile = useIsMobile()

  const renderMobileView = () => (
    <div className="grid gap-4">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            {/* Aksen Gradasi Halus di Sisi Kiri Kartu */}
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col gap-4">
              {row.getVisibleCells().map((cell) => {
                const isActions = cell.column.id === "actions"
                
                if (isActions) {
                  return (
                    <div key={cell.id} className="mt-2 flex items-center justify-center border-t pt-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  )
                }

                return (
                  <div key={cell.id} className="flex items-center justify-between gap-4 border-b border-muted/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.header,
                        { column: cell.column, table } as any
                      )}
                    </span>
                    <div className="text-right text-sm font-medium">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed bg-muted/30 text-muted-foreground italic">
          No results found.
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
      {isMobile ? (
        renderMobileView()
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-card/30 backdrop-blur-md shadow-xl group/table">
          {/* Subtle glow border effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 rounded-2xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <Table>
            <TableHeader className="bg-muted/50 backdrop-blur-sm border-b border-border/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-0 h-14">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 px-6">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group border-b border-border/30 hover:bg-primary/[0.03] transition-all duration-300 h-16"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4 transition-transform group-hover:translate-x-0.5 duration-300">
                        <div className="text-sm font-medium tracking-tight">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                      <Search className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">Data tidak ditemukan.</p>
                      <p className="text-xs">Coba sesuaikan filter atau pencarian Anda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
        <div className="flex items-center gap-3">
          <div className="h-8 px-3 rounded-xl bg-secondary/50 border border-border/40 flex items-center justify-center">
             <span className="text-xs font-bold tracking-tight">
               {table.getFilteredSelectedRowModel().rows.length} dari{" "}
               {table.getFilteredRowModel().rows.length} Baris
             </span>
          </div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest hidden sm:block">
            Dipilih untuk diproses
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Halaman</span>
            <span className="text-sm font-black text-primary/80">
              {table.getState().pagination.pageIndex + 1}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">dari</span>
            <span className="text-sm font-black text-primary/80">
              {table.getPageCount()}
            </span>
          </div>

          <div className="flex gap-1.5 p-1 bg-secondary/30 rounded-2xl border border-border/40 shadow-inner">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-xl h-9 w-24 bg-background/50 hover:bg-background border border-border/20 shadow-sm disabled:opacity-30 transition-all font-bold text-[11px] uppercase tracking-wider"
            >
              Kembali
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-xl h-9 w-24 bg-background/50 hover:bg-background border border-border/20 shadow-sm disabled:opacity-30 transition-all font-bold text-[11px] uppercase tracking-wider text-primary"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
