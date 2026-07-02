"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

//id cua danh muc (category_id)
const CATEGORY_CONFIG: any = {
  hair: {
    id: 1,
    title: "Dịch Vụ Tóc",
    color: "text-pink-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  nail: {
    id: 2,
    title: "Dịch Vụ Nail",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  spa: {
    id: 3,
    title: "Dịch Vụ Spa",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

// const SERVICES_LIST: any = {
//   hair: [
//     { name: "LILY (suôn mềm, tinh khôi)", price: "645k" },
//     { name: "ROSE (quyến rũ, nổi bật)", price: "875k" },
//     { name: "TULIP (đẳng cấp, chuyên sâu)", price: "1575k" },
//   ],
//   nail: [
//     { name: "PEONY (kiêu sa, lộng lẫy)", price: "995k" },
//     { name: "SAKURA (rực rỡ, dịu dàng)", price: "875k" },
//     { name: "LAVENDER (hoàn mỹ, bền lâu)", price: "425k" },
//     { name: "SUNFLOWER (kiên định, chân thành)", price: "295k" },
//   ],
//   spa: [
//     { name: "JASMINE (tươi trẻ, làm sạch)", price: "645k" },
//     { name: "LOTUS (premium, tận hưởng)", price: "1245k" },
//     { name: "DAISY (thư giãn, chữa lành)", price: "745k" },
//   ],
// };

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient(); //ket noi
  const type = params.type as string;

  const config = CATEGORY_CONFIG[type];
  //const items = SERVICES_LIST[type];
  // State quản lý danh sách dịch vụ từ DB và trạng thái loading
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // if (!config)
  //   return <div className="p-20 text-center">Danh mục không tồn tại!</div>;

  //them moi state quan ly hien thi modal nhac nho dang nhap
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!config) return;

    async function fetchServices() {
      setLoading(true);
      // Gọi trực tiếp dữ liệu từ bảng services lọc theo category_id thực tế
      const { data, error } = await supabase
        .from("services")
        .select("name, price, description")
        .eq("category_id", config.id);
      //.eq("status", "active"); // Chỉ lấy các dịch vụ đang hoạt động

      if (error) {
        // Ép in ra thuộc tính message và code cụ thể của Supabase
        console.error(
          "Lỗi lấy danh sách dịch vụ chi tiết:",
          error.message,
          "Mã lỗi:",
          error.code,
        );
        alert(`Lỗi Supabase: ${error.message} (${error.code})`);
      } else if (data) {
        //cap nhat: do du lieu that vao state de map ra giao dien
        setServices(data);
      }
      //cap nhat: tat man hinh cho loading bat ke thanh cong hay that bai
      setLoading(false);
    }

    fetchServices();
  }, [type]);

  if (!config)
    return <div className="p-20 text-center">Danh mục không tồn tại!</div>;

  if (loading)
    return (
      <div className="p-20 text-center text-stone-500 font-medium">
        Đang tải danh sách dịch vụ...
      </div>
    );

  // Hàm biến đổi số tiền 645000 thành chuỗi "645k" hiển thị như thiết kế cũ
  const formatPriceDisplay = (price: number) => {
    return `${price / 1000}k`;
  };
  //cap nhat: ham kiem tra dang nhap bat dong bo truoc khi chuyen trang booking
  const handleBooking = async (serviceName: string, rawPrice: number) => {
    //goi supabase kiem tra xem phien dang nhap (session) cua user co ton tai hay khong
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      // Nếu chưa có phiên đăng nhập -> Kích hoạt hiển thị Modal nhắc nhở
      setShowAuthModal(true);
      return;
    }

    // Nếu đã đăng nhập thành công -> Tiến hành chuyển hướng bình thường sang trang booking
    const formattedPrice = formatPriceDisplay(rawPrice);
    router.push(
      `/booking?service=${encodeURIComponent(serviceName)}&price=${encodeURIComponent(formattedPrice)}`,
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className={`text-3xl font-bold ${config.color} mb-8`}>
        {config.title}
      </h1>

      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-10 text-stone-400">
            Hiện tại danh mục này chưa có dịch vụ nào.
          </div>
        ) : (
          services.map((item: any, i: number) => (
            <div
              key={i}
              onClick={() => handleBooking(item.name, item.price)}
              className={`p-6 rounded-2xl border ${config.border} ${config.bg} cursor-pointer hover:scale-[1.02] transition-transform flex justify-between items-center`}
            >
              <div>
                <h3 className="font-bold text-stone-800">
                  {item.name} {item.description ? `(${item.description})` : ""}
                </h3>
              </div>
              <span className={`font-bold ${config.color}`}>
                {formatPriceDisplay(item.price)}
              </span>
            </div>
          ))
        )}
      </div>
      {/* 🔥 THÊM MỚI: Giao diện Modal Pop-up yêu cầu Đăng nhập (với hiệu ứng làm mờ nền) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl space-y-6 scale-in-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-2xl mx-auto">
              🔒
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-stone-800">
                Yêu cầu đăng nhập
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Để tiến hành đặt lịch hẹn trải nghiệm dịch vụ tại JoyRide, bạn
                vui lòng đăng nhập tài khoản trước nhé!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-bold hover:bg-stone-50 transition-colors text-sm"
              >
                Để sau
              </button>
              <button
                onClick={() => router.push("/login")}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-md shadow-orange-200 transition-all text-sm"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
