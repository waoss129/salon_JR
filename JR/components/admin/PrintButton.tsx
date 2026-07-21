"use client";

export function PrintButton({ className = "" }: { className?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className={`print:hidden border rounded px-3 py-1.5 text-sm shrink-0 ${className}`}
    >
      🖨️ In
    </button>
  );
}
