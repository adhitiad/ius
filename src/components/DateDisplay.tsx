"use client";

import { useEffect, useState } from "react";

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

export default DateDisplay;
