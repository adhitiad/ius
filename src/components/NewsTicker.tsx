'use client';

import React from 'react';
import { Megaphone } from 'lucide-react';

const NEWS_DATA = [
  'IHSG Menguat 0.5% di Sesi I Mendekati Level Psikologis 7.300',
  'The Fed Memberi Sinyal Pertahankan Suku Bunga Hingga Akhir Kuartal',
  'BBCA Tembus Rekor All-Time High Setelah Rilis Laporan Laba Tahunan',
  'Volume Perdagangan Kripto Global Meningkat Pasca ETF Bitcoin Spot Disetujui',
  'Harga Minyak Mentah Dunia Stabil di Tengah Ketegangan Geopolitik Timur Tengah',
  'Emiten Teknologi Mulai Menunjukkan Pemulihan Margin Keuntungan di Kuartal Ini',
];

export function NewsTicker() {
  return (
    <div className="w-full h-10 bg-zinc-950/80 backdrop-blur-md border-y border-emerald-900/10 flex items-center overflow-hidden group">
      {/* Label Sisi Kiri */}
      <div className="z-10 h-full flex items-center gap-2 bg-zinc-950 px-4 border-r border-emerald-900/20 shadow-[10px_0_15px_rgba(0,0,0,0.5)]">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-tighter text-red-500 whitespace-nowrap">
          Market Update
        </span>
        <Megaphone className="w-3 h-3 text-zinc-500" />
      </div>

      {/* Marquee Container */}
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-default">
          {NEWS_DATA.map((news, i) => (
            <div key={i} className="inline-flex items-center mx-8">
              <span className="text-[11px] font-medium text-zinc-300 hover:text-emerald-400 transition-colors uppercase tracking-wide">
                {news}
              </span>
              <span className="ml-8 text-zinc-700 font-bold">•</span>
            </div>
          ))}
          {/* Duplikasi data untuk efek seamless jika konten pendek, 
              tapi dengan animate-marquee standar translateX(100% to -100%), 
              ini biasanya butuh container dua kali lipat lebar konten */}
          {NEWS_DATA.map((news, i) => (
            <div key={`dup-${i}`} className="inline-flex items-center mx-8">
              <span className="text-[11px] font-medium text-zinc-300 hover:text-emerald-400 transition-colors uppercase tracking-wide">
                {news}
              </span>
              <span className="ml-8 text-zinc-700 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsTicker;
