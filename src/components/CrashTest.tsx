'use client';

import { useEffect, useState } from 'react';

export default function CrashTest() {
  const [shouldCrash, setShouldCrash] = useState(false);

  useEffect(() => {
    // Simulasi delay sebelum crash agar kita bisa melihat transisi
    const timer = setTimeout(() => {
      setShouldCrash(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (shouldCrash) {
    throw new Error('SIMULATED_UI_CRASH: Data dari API rusak!');
  }

  return (
    <div className="text-xs text-emerald-500 animate-pulse">
      Menunggu simulasi crash (2 detik)...
    </div>
  );
}
