// app/(customer)/promotions/page.tsx

export default function PromotionsPage() {
  // Bạn có thể fetch dữ liệu từ Supabase tại đây sau này
  const promotions = [
    { id: 1, title: "Giảm 20% cho lần đầu trải nghiệm", code: "WELCOME20" },
    { id: 2, title: "Mua 1 tặng 1 dịch vụ chăm sóc da", code: "BOGO-SKIN" },
  ];

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Chương trình khuyến mãi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="p-6 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50"
          >
            <h2 className="text-xl font-bold text-blue-900 mb-2">
              {promo.title}
            </h2>
            <p className="text-sm text-blue-600 font-mono font-bold">
              Mã: {promo.code}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
