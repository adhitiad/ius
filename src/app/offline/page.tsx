'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="p-6 rounded-full bg-destructive/10 text-destructive mb-6 animate-pulse">
        <WifiOff size={48} />
      </div>
      <h1 className="text-3xl font-bold mb-2 font-outfit">Koneksi Terputus</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Sepertinya Anda sedang offline. Beberapa fitur mungkin tidak tersedia sampai Anda terhubung kembali ke internet.
      </p>
      <Button 
        onClick={() => router.refresh()} 
        className="h-12 px-8 text-lg font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-none shadow-lg shadow-emerald-500/20"
      >
        Coba Lagi
      </Button>
    </div>
  );
}
