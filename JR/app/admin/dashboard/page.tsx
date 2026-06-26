// app/admin/dashboard/page.tsx
import React from "react";

export default function DashboardPage() {
  // Lấy ngày hiện tại thực tế
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Dữ liệu mẫu biểu đồ doanh thu theo tháng
  const monthlyData = [
    { month: "Tháng 1", revenue: 45 },
    { month: "Tháng 2", revenue: 58 },
    { month: "Tháng 3", revenue: 62 },
    { month: "Tháng 4", revenue: 78 },
    { month: "Tháng 5", revenue: 95 },
    { month: "Tháng 6", revenue: 120 }, // Giả định tháng cao điểm hiện tại
  ];

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Ngày */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/70 p-4 rounded-xl shadow-sm border border-pink-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Tổng quan hệ thống
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Theo dõi thời gian thực các chỉ số hoạt động kinh doanh.
          </p>
        </div>
        <div className="mt-2 md:mt-0 px-4 py-2 bg-pink-100 text-pink-600 font-bold rounded-lg shadow-inner text-sm flex items-center gap-2">
          Hôm nay: {today}
        </div>
      </div>

      {/* Lưới các thẻ thống kê nhanh (Đồng bộ theo Hình 3 & Hình 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thẻ 1: Tổng lịch hẹn */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lịch hẹn hôm nay
            </p>
            <p className="text-4xl font-black text-slate-900 mt-1">12</p>
          </div>
          {/* <div className="p-3.5 bg-blue-50 rounded-xl text-3xl shadow-sm">
            📅
          </div> */}
        </div>

        {/* Thẻ 2: Khách hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Khách đang làm
            </p>
            <p className="text-4xl font-black text-slate-900 mt-1">4</p>
          </div>
          {/* <div className="p-3.5 bg-amber-50 rounded-xl text-3xl shadow-sm">
            👩‍🦰
          </div> */}
        </div>

        {/* Thẻ 3: Doanh thu ước tính */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Doanh thu ước tính
            </p>
            <p className="text-4xl font-black text-slate-900 mt-1">3.5M</p>
          </div>
          {/* <div className="p-3.5 bg-emerald-50 rounded-xl text-3xl shadow-sm">
            💵
          </div> */}
        </div>
      </div>

      {/* Khu vực đồ thị doanh thu theo tháng */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Biểu đồ doanh thu theo tháng
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đơn vị tính: Triệu VNĐ (M)
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-teal-50 text-sky-600 rounded-full border border-teal-200">
            Năm 2026
          </span>
        </div>

        {/* Dựng biểu đồ cột */}
        <div className="w-full bg-slate-50/50 p-4 rounded-xl border border-blue-300 flex flex-col justify-end">
          {/* Cố định chiều cao vùng chứa cột bằng h-64 và flex items-end */}
          <div className="h-64 w-full flex items-end justify-between px-2 sm:px-8 pt-4 border-b border-blue-300">
            {monthlyData.map((item, index) => {
              // Tính tỉ lệ phần trăm chiều cao cột dựa trên doanh thu tối đa (120M)
              const barHeight = `${(item.revenue / 120) * 100}%`;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-end h-full flex-1 group max-w-[60px] mx-2"
                >
                  {/* Trị số doanh thu xuất hiện khi di chuột qua */}
                  <span className="text-xs font-bold text-blue-400 mb-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.revenue}M
                  </span>

                  {/* Cột dữ liệu hình khối với mã màu #6cedef của bạn */}
                  <div
                    className="w-full rounded-t-md shadow-sm transition-all duration-300 group-hover:brightness-95 group-hover:shadow-md"
                    style={{
                      height: barHeight,
                      backgroundColor: "#7fbcf2",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Nhãn tên tháng dưới chân cột */}
          <div className="flex justify-between px-2 sm:px-8 mt-2 text-xs font-bold text-blue-600">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 text-center max-w-[60px] mx-2">
                {item.month}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
