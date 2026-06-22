"use client";

import { useParams, useRouter } from "next/navigation";

const CATEGORY_CONFIG: any = {
  hair: {
    title: "Dịch Vụ Tóc",
    color: "text-pink-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  nail: {
    title: "Dịch Vụ Nail",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  spa: {
    title: "Dịch Vụ Spa",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

const SERVICES_LIST: any = {
  hair: [
    { name: "LILY (suôn mềm, tinh khôi)", price: "645k" },
    { name: "ROSE (quyến rũ, nổi bật)", price: "875k" },
    { name: "TULIP (đẳng cấp, chuyên sâu)", price: "1575k" },
  ],
  nail: [
    { name: "PEONY (kiêu sa, lộng lẫy)", price: "995k" },
    { name: "SAKURA (rực rỡ, dịu dàng)", price: "875k" },
    { name: "LAVENDER (hoàn mỹ, bền lâu)", price: "425k" },
    { name: "SUNFLOWER (kiên định, chân thành)", price: "295k" },
  ],
  spa: [
    { name: "JASMINE (tươi trẻ, làm sạch)", price: "645k" },
    { name: "LOTUS (premium, tận hưởng)", price: "1245k" },
    { name: "DAISY (thư giãn, chữa lành)", price: "745k" },
  ],
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;

  const config = CATEGORY_CONFIG[type];
  const items = SERVICES_LIST[type];

  if (!config)
    return <div className="p-20 text-center">Danh mục không tồn tại!</div>;

  const handleBooking = (serviceName: string, servicePrice: string) => {
    // Chuyển sang trang đặt lịch, truyền kèm dịch và giá vụ đã chọn
    router.push(
      `/booking?service=${encodeURIComponent(serviceName)}&price=${encodeURIComponent(servicePrice)}`,
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className={`text-3xl font-bold ${config.color} mb-8`}>
        {config.title}
      </h1>

      <div className="space-y-4">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            onClick={() => handleBooking(item.name, item.price)} //trong lúc map nạp dữ liệu, thay đổi phần gọi hàm onClick - truyền cả name và price
            className={`p-6 rounded-2xl border ${config.border} ${config.bg} cursor-pointer hover:scale-[1.02] transition-transform flex justify-between items-center`}
          >
            <div>
              <h3 className="font-bold text-stone-800">{item.name}</h3>
            </div>
            <span className={`font-bold ${config.color}`}>{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
