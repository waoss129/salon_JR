"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BookingContent() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service") || "Dịch vụ chưa được chọn";
  const price = searchParams.get("price") || "---"; //lấy giá từ url
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  // Lấy ngày hôm nay (YYYY-MM-DD) để chặn chọn ngày quá khứ
  const today = new Date().toISOString().split("T")[0];

  // Tính toán thứ trong tuần
  const selectDate = date ? new Date(date) : null;
  const dayOfWeek = selectDate ? selectDate.getDay() : -1;
  const isSunday = dayOfWeek === 0;

  // Logic giờ làm việc
  const getAvailableSlots = () => {
    // T2-T6 (1, 2, 3, 4, 5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
      ];
    }
    // T7 (6)
    if (dayOfWeek === 6) {
      return [
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ];
    }
    return [];
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* CỘT TRÁI: FORM */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-stone-800">
            Đặt lịch hẹn
          </h2>
          <p className="text-stone-500">
            Vui lòng chọn thời gian bạn muốn ghé thăm JoyRide nhé!
          </p>
        </div>

        {/* Ngày */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">
            Chọn ngày
          </label>
          <input
            type="date"
            min={today}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
            className="w-full p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
          />
          {isSunday && (
            <p className="text-orange-500 text-sm mt-3 font-medium bg-orange-50 p-3 rounded-lg border border-orange-100">
              🌸 Chủ Nhật JoyRide tạm nghỉ để nạp năng lượng xinh đẹp, bạn chọn
              ngày khác giúp mình nha!
            </p>
          )}
        </div>

        {/* Giờ */}
        {date && !isSunday && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-bold text-stone-700 mb-2">
              Chọn khung giờ
            </label>
            <div className="grid grid-cols-4 gap-2">
              {getAvailableSlots().map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`p-3 text-sm rounded-xl border font-bold transition-all ${
                    time === slot
                      ? "bg-orange-500 text-white border-orange-500 shadow-md"
                      : "bg-white text-stone-600 border-stone-200 hover:border-orange-400"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ghi chú */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">
            Ghi chú cho tụi mình
          </label>
          <textarea
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
            rows={3}
            placeholder="Gửi tụi mình một vài yêu cầu nhỏ để JoyRide chuẩn bị chu đáo nhất cho bạn nha!✨"
          />
        </div>
      </div>

      {/* CỘT PHẢI: VÉ HÀNH TRÌNH */}
      <div className="bg-orange-50/50 p-8 rounded-3xl border-2 border-dashed border-orange-100 sticky top-24">
        <h3 className="text-xl font-bold mb-6 text-orange-800 flex items-center gap-2">
          🎟️ Vé hành trình
        </h3>

        <div className="space-y-4 text-orange-800">
          <p className="flex justify-between">
            <span>Dịch vụ:</span>
            <strong className="text-right text-orange-900">{service}</strong>
          </p>

          {/* Dòng hiển thị giá đã nhận được */}
          <p className="flex justify-between border-b border-orange-200 pb-4">
            <span>Giá dự kiến:</span>
            <strong className="text-orange-600">{price}</strong>
          </p>

          <p className="flex justify-between">
            <span>Ngày:</span> <strong>{date || "---"}</strong>
          </p>
          <p className="flex justify-between">
            <span>Giờ:</span> <strong>{time || "---"}</strong>
          </p>

          {/* Hiển thị ghi chú nếu khách có nhập */}
          {note && (
            <div className="pt-4 border-t border-orange-200">
              <span className="text-xs font-bold uppercase text-orange-400">
                Ghi chú của bạn:
              </span>
              <p className="text-sm italic mt-1 text-orange-700">"{note}"</p>
            </div>
          )}
        </div>

        <button
          disabled={!date || !time || isSunday}
          className="w-full mt-8 bg-orange-400 text-white py-4 rounded-2xl font-bold hover:bg-orange-500 disabled:bg-orange-100 transition-all shadow-lg"
        >
          XÁC NHẬN ĐẶT LỊCH
        </button>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={<div className="p-20 text-center">Đang tải hành trình...</div>}
    >
      <BookingContent />
    </Suspense>
  );
}
