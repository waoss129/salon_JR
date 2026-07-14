"use client";

import { Alex_Brush } from "next/font/google";

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const DASH_LINE = "-".repeat(56);

export default function GreetingBanner({ staffName }: { staffName: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 font-mono text-slate-700 shadow-sm">
      <p
        className={`${alexBrush.className} text-center text-2xl text-slate-600`}
      >
        Face pretty, soul prettier.
      </p>

      <p className="my-4 select-none text-center text-slate-300">{DASH_LINE}</p>

      <div className="space-y-1 text-center text-base">
        <p>Xin chào, {staffName}!</p>
        <p>Chúc bạn có một ngày làm việc hiệu quả.</p>
      </div>
    </div>
  );
}
