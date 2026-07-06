// app/(customer)/search/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); // Lấy từ khóa "q"
  const [results, setResults] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!query) return;

    // Tìm kiếm trong bảng services theo tên hoặc mô tả
    supabase
      .from("services")
      .select("*")
      .ilike("name", `%${query}%`)
      .then(({ data }) => setResults(data || []));
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-2xl font-bold mb-6">
        Kết quả tìm kiếm cho: "{query}"
      </h1>
      {/* Map results ra giống như cách bạn làm ở trang services */}
    </div>
  );
}
