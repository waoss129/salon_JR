// app/(customer)/promotions/page.tsx

import { createClient } from "@/lib/supabase/server";

type Promotion = {
  id: string;
  name: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number | null;
  end_date: string;
};

function formatDiscount(type: string, value: number) {
  // Giả định discount_type là 'percentage' hoặc 'fixed'.
  // Nếu giá trị thực tế trong DB khác, chỉnh lại điều kiện dưới đây.
  if (type === "percentage") return `Giảm ${value}%`;
  return `Giảm ${value.toLocaleString("vi-VN")}đ`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

async function getActivePromotions(): Promise<Promotion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("promotions")
    .select(
      "id, name, code, discount_type, discount_value, min_order_value, end_date",
    )
    .eq("is_active", true)
    .gte("end_date", new Date().toISOString())
    .order("end_date");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function PromotionsPage() {
  const promotions = await getActivePromotions();

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Chương trình khuyến mãi</h1>

      {promotions.length === 0 ? (
        <p className="text-gray-500">
          Hiện chưa có chương trình khuyến mãi nào.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="p-6 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50"
            >
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                {promo.name} —{" "}
                {formatDiscount(promo.discount_type, promo.discount_value)}
              </h2>
              <p className="text-sm text-blue-600 font-mono font-bold">
                Mã: {promo.code}
              </p>
              {promo.min_order_value && (
                <p className="text-xs text-blue-500 mt-1">
                  Đơn tối thiểu: {promo.min_order_value.toLocaleString("vi-VN")}
                  đ
                </p>
              )}
              <p className="text-xs text-blue-400 mt-1">
                HSD: {formatDate(promo.end_date)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
