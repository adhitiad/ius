import React from "react";
import { StockData } from "@/hooks/useMarketData";
import { StockTableRow } from "./StockTableRow";

interface StockTableProps {
  stocks: StockData[];
}

export function StockTable({ stocks }: StockTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/40">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ticker</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Harga Terakhir</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">% Perubahan</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Volume Spikes</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Sentiment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {stocks.map((stock, i) => (
              <StockTableRow 
                key={stock.ticker} 
                initialData={stock} 
                index={i} 
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer / Call to Action */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/20 text-center">
        <button className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
          Lihat Semua Filter Saham →
        </button>
      </div>
    </div>
  );
}

