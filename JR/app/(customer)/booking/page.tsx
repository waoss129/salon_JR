"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getServiceById, createAppointment, type ServiceInfo } from "./actions";
import { getTimeSlotsForDate } from "@/lib/supabase/business_hours";

function formatPriceDisplay(price: number) {
  return `${(price / 1000).toLocaleString("vi-VN")}k`;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = Number(searchParams.get("serviceId"));

  const [service, setService] = useState<ServiceInfo | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const selectDate = date ? new Date(date) : null;
  const dayOfWeek = selectDate ? selectDate.getDay() : -1;
  const isSunday = dayOfWeek === 0;

  const slots = date ? getTimeSlotsForDate(date) : [];

  useEffect(() => {
    if (!serviceId) {
      setLoadError(
        "Thiếu thông tin dịch vụ, vui lòng chọn lại từ trang dịch vụ",
      );
      setLoadingInit(false);
      return;
    }
    getServiceById(serviceId)
      .then(setService)
      .catch((err) =>
        setLoadError(
          err instanceof Error ? err.message : "Không tải được dữ liệu",
        ),
      )
      .finally(() => setLoadingInit(false));
  }, [serviceId]);

  async function handleConfirm() {
    if (!date || !time) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createAppointment({ serviceId, date, time, note });
      router.push("/appointments");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Không thể đặt lịch, vui lòng thử lại",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingInit) {
    return <div className="p-20 text-center">Đang tải hành trình...</div>;
  }
  if (loadError || !service) {
    return (
      <div className="p-20 text-center text-stone-500">
        {loadError ?? "Có lỗi xảy ra"}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-stone-800">
            Đặt lịch hẹn
          </h2>
          <p className="text-stone-500">
            Vui lòng chọn thời gian bạn muốn ghé thăm JoyRide nhé!
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">
            Chọn ngày
          </label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime(null);
            }}
            className="w-full p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
          />
          {isSunday && (
            <p className="text-orange-500 text-sm mt-3 font-medium bg-orange-50 p-3 rounded-lg border border-orange-100">
              Chủ Nhật JoyRide tạm nghỉ để nạp năng lượng xinh đẹp, bạn chọn
              ngày khác giúp mình nha!
            </p>
          )}
        </div>

        {date && !isSunday && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-bold text-stone-700 mb-2">
              Chọn khung giờ
            </label>
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => (
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

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">
            Ghi chú cho tụi mình
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
            rows={3}
            placeholder="Gửi tụi mình một vài yêu cầu nhỏ để JoyRide chuẩn bị chu đáo nhất cho bạn nha!"
          />
        </div>

        {submitError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
            {submitError}
          </p>
        )}
      </div>

      <div className="bg-orange-50/50 p-8 rounded-3xl border-2 border-dashed border-orange-100 sticky top-24">
        <h3 className="text-xl font-bold mb-6 text-orange-800 flex items-center gap-2">
          Vé hành trình
        </h3>
        <div className="space-y-4 text-orange-800">
          <p className="flex justify-between">
            <span>Dịch vụ:</span>
            <strong className="text-right text-orange-900">
              {service.name}
            </strong>
          </p>
          <p className="flex justify-between border-b border-orange-200 pb-4">
            <span>Giá dự kiến:</span>
            <strong className="text-orange-600">
              {formatPriceDisplay(service.price)}
            </strong>
          </p>
          <p className="flex justify-between">
            <span>Ngày:</span> <strong>{date || "---"}</strong>
          </p>
          <p className="flex justify-between">
            <span>Giờ:</span> <strong>{time || "---"}</strong>
          </p>
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
          onClick={handleConfirm}
          disabled={!date || !time || isSunday || submitting}
          className="w-full mt-8 bg-orange-400 text-white py-4 rounded-2xl font-bold hover:bg-orange-500 disabled:bg-orange-100 transition-all shadow-lg"
        >
          {submitting ? "Đang xử lý..." : "XÁC NHẬN ĐẶT LỊCH"}
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
