"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  // Bắt đầu với null để tránh lệch giờ giữa server-render và client
  // (hydration mismatch) — chỉ hiện giờ thật sau khi đã mount ở client.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return <p className="mt-1 text-4xl font-black text-slate-900">--:--:--</p>;
  }

  return (
    <p className="mt-1 text-4xl font-black tabular-nums text-slate-900">
      {now.toLocaleTimeString("vi-VN")}
    </p>
  );
}
