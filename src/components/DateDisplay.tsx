import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic import dengan ssr: false agar komponen hanya dirender di client side
// Ini menghindari hydration mismatch karena tanggal bergantung pada waktu lokal client
const DateDisplayClient = dynamic(() => Promise.resolve(DateDisplay), {
  ssr: false,
  loading: () => <span>...</span>,
});

function DateDisplay() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const dateStr = new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(dateStr);
  }, []);

  return <span>{currentDate}</span>;
}

export default DateDisplayClient;
