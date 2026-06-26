"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GRID_DISPLAY_CONFIG } from "@/components/home/constants";
import ServiceCard from "@/components/home/ServiceCard";

export default function JoyRideHomePage() {
  const supabase = createClient();
  const [session, setSession] = useState<any>(null); //state de luu session
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //lay session o phia client
  useEffect(() => {
    if (!supabase) return; //tat supabase cloud
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  // 1. Logic tự động cuộn khi trang được tải (dành cho trường hợp từ trang khác quay về)
  useEffect(() => {
    if (window.location.hash === "#services-section") {
      const element = document.getElementById("services-section");
      if (element) {
        // Delay 300ms để đảm bảo mọi thành phần đã được render xong
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, []);

  // Hàm điều hướng khi click vào dịch vụ
  const handleServiceSelect = (serviceType: string) => {
    router.push(`/services/${serviceType}`);
  };

  return (
    <div className="bg-[#FFFDF0] text-stone-800 relative">
      {/* Hero Section */}
      <section className="relative px-6 py-20 max-w-6xl mx-auto text-center space-y-8">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#CFECF3]/50 text-stone-600 border border-[#BBE3ED]/60 uppercase tracking-widest relative z-10">
          ✨ Kiêu sa diện mạo • Rạng rỡ hành trình
        </span>

        <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight leading-tight text-stone-900">
          Đẹp hơn mỗi ngày, <br />
          <span className="bg-gradient-to-r from-[#FBBFDC] via-[#E2A6C5] to-[#99DDF0] bg-clip-text text-transparent">
            Vui trên mỗi hành trình
          </span>
        </h1>
        <p className="text-base sm:text-lg text-stone-500 max-w-3xl mx-auto font-medium leading-relaxed relative z-10 [text-wrap:balance]">
          Làm đẹp không chỉ là kết quả, đó là một chuyến đi cảm xúc đầy tiếng
          cười. Hãy để JoyRide vỗ về làn da, mái tóc và đánh thức sự tự tin
          trong bạn.
        </p>

        <div className="inline-block text-stone-800 font-bold py-4 px-8 rounded-full animate-bounce animate-color-cycle">
          <span className="tracking-widest uppercase text-sm">
            Đặt lịch hẹn ngay
          </span>
        </div>

        {/* Grid Dịch vụ */}
        <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {Object.entries(GRID_DISPLAY_CONFIG).map(([key, item]) => (
            <ServiceCard key={key} item={item} />
          ))}
        </div>
      </section>

      {/* 3.5. KHỐI QUY TRÌNH LÀM ĐẸP */}
      <section className="pt-12 pb-16 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Đặt lịch", desc: "Chọn dịch vụ & thời gian" },
            { step: "02", title: "Tư vấn", desc: "Chuyên viên lắng nghe" },
            { step: "03", title: "Trải nghiệm", desc: "Thực hiện dịch vụ" },
            { step: "04", title: "Hoàn thiện", desc: "Chăm sóc sau dịch vụ" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-2 group"
            >
              <span
                className="text-4xl font-black transition-colors group-hover:scale-110 duration-300"
                style={{ color: "#BACAF2" }}
              >
                {item.step}
              </span>
              <h4 className="font-bold text-stone-800 text-sm tracking-wide uppercase">
                {item.title}
              </h4>
              <p className="text-xs text-stone-400 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. KHỐI TRÍCH DẪN (BRAND QUOTE) */}
      <section className="py-16 px-6 bg-[#FFFDF0]">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <svg
            className="w-8 h-8 text-[#BACAF2] mx-auto opacity-50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
          </svg>
          <p className="text-2xl md:text-3xl font-serif text-stone-800 leading-relaxed italic">
            "Clear skin, shiny hair, fit body, healthy mind."
          </p>
          <div className="pt-4">
            <span className="block h-[1px] w-12 bg-[#BACAF2] mx-auto mb-4"></span>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">
              JoyRide Philosophy
            </p>
          </div>
        </div>
      </section>

      {/* 4. KHỐI TIỆN ÍCH DỊCH VỤ CỐT LÕI (ĐÃ CÓ ID VÀ SCROLL-MT) */}
      <section
        id="services-section"
        className="bg-gradient-to-r from-[#CFECF3]/20 via-[#E1FAD4]/20 to-white/40 border-t border-[#CFECF3]/30 px-6 py-16 mt-0 scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto">
          <h3 className="text-center text-xs font-bold uppercase tracking-widest text-stone-400 mb-10">
            Dịch vụ cốt lõi tại JoyRide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              onClick={() => handleServiceSelect("hair")}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#CFECF3]/20 hover:border-pink-300 transition-all cursor-pointer hover:shadow-md"
            >
              <div className="text-3xl">💇</div>
              <h4 className="text-lg font-bold text-stone-900 mt-4">
                Thiết Kế Tóc Thời Thượng
              </h4>
              <p className="text-sm text-stone-500 font-medium leading-relaxed mt-2">
                Cắt, uốn, nhuộm balayage đón đầu xu hướng cùng chuyên viên VIP.
              </p>
            </div>
            <div
              onClick={() => handleServiceSelect("nail")}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#CFECF3]/20 hover:border-pink-300 transition-all cursor-pointer hover:shadow-md"
            >
              <div className="text-3xl">💅</div>
              <h4 className="text-lg font-bold text-stone-900 mt-4">
                Nail Art Nghệ Thuật
              </h4>
              <p className="text-sm text-stone-500 font-medium leading-relaxed mt-2">
                Chăm sóc và sơn gel, đính đá custom theo cá tính riêng của bạn.
              </p>
            </div>
            <div
              onClick={() => handleServiceSelect("spa")}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#CFECF3]/20 hover:border-pink-300 transition-all cursor-pointer hover:shadow-md"
            >
              <div className="text-3xl">💆</div>
              <h4 className="text-lg font-bold text-stone-900 mt-4">
                Spa & Trị Liệu Da Mặt
              </h4>
              <p className="text-sm text-stone-500 font-medium leading-relaxed mt-2">
                Thải độc detox, gội đầu dưỡng sinh chữa lành và massage thư
                giãn.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
