"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createPromotion,
  getPromotionDetail,
  getSelectableServices,
  updatePromotion,
  type DiscountType,
  type SelectableService,
} from "@/app/admin/promotions/actions";

type ConditionType = "none" | "first_time" | "min_order" | "day_of_week";

const WEEKDAY_OPTIONS = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 7, label: "Chủ nhật" },
];

export default function PromotionModal({
  promotionId,
  onClose,
  onSaved,
}: {
  promotionId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = Boolean(promotionId);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [conditionType, setConditionType] = useState<ConditionType>("none");
  const [minOrderValue, setMinOrderValue] = useState<number>(0);
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);

  const [selectableServices, setSelectableServices] = useState<
    SelectableService[]
  >([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  useEffect(() => {
    getSelectableServices().then(({ data }) => setSelectableServices(data));
  }, []);

  useEffect(() => {
    if (!promotionId) return;
    (async () => {
      const { data, error } = await getPromotionDetail(promotionId);
      if (error || !data) {
        setError(error ?? "Không tìm thấy khuyến mãi.");
        setLoading(false);
        return;
      }

      setName(data.name);
      setCode(data.code);
      setDiscountType(data.discount_type);
      setDiscountValue(data.discount_value);
      setStartDate(data.start_date ? data.start_date.slice(0, 10) : "");
      setEndDate(data.end_date.slice(0, 10));
      setSelectedServiceIds(data.serviceIds);

      if (data.is_first_time) {
        setConditionType("first_time");
      } else if (data.min_order_value != null) {
        setConditionType("min_order");
        setMinOrderValue(data.min_order_value);
      } else if (data.day_of_week != null) {
        setConditionType("day_of_week");
        setDayOfWeek(data.day_of_week);
      } else {
        setConditionType("none");
      }

      setLoading(false);
    })();
  }, [promotionId]);

  function toggleService(id: number) {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  const servicesByCategory = useMemo(() => {
    const map = new Map<string, SelectableService[]>();
    for (const s of selectableServices) {
      const cat = s.categories?.name ?? "Khác";
      map.set(cat, [...(map.get(cat) ?? []), s]);
    }
    return Array.from(map.entries());
  }, [selectableServices]);

  async function handleSubmit() {
    setError(null);

    if (!name.trim()) return setError("Vui lòng nhập tên khuyến mãi.");
    if (!code.trim()) return setError("Vui lòng nhập mã khuyến mãi.");
    if (!endDate) return setError("Vui lòng chọn ngày kết thúc.");
    if (discountValue <= 0) return setError("Giá trị giảm phải lớn hơn 0.");
    if (discountType === "percentage" && discountValue > 100) {
      return setError("Giảm theo % không được vượt quá 100.");
    }

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      minOrderValue: conditionType === "min_order" ? minOrderValue : null,
      isFirstTime: conditionType === "first_time",
      dayOfWeek: conditionType === "day_of_week" ? dayOfWeek : null,
      startDate: startDate || null,
      endDate,
      serviceIds: selectedServiceIds,
    };

    setSaving(true);
    const result = isEditing
      ? await updatePromotion(promotionId as string, payload)
      : await createPromotion(payload);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Chỉnh sửa khuyến mãi" : "Thêm mới khuyến mãi"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {loading ? (
            <p className="text-center text-gray-400">Đang tải...</p>
          ) : (
            <>
              {/* Thông tin cơ bản */}
              <section className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block text-sm text-gray-600">
                    Tên khuyến mãi
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="VD: Khuyến mãi khách hàng lần đầu"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Mã khuyến mãi
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase"
                    placeholder="VD: WELCOME10"
                  />
                </div>
                <div />
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Ngày bắt đầu (tùy chọn)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </section>

              {/* Loại giảm giá */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Loại giảm giá
                </h3>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={discountType === "percentage"}
                      onChange={() => setDiscountType("percentage")}
                    />
                    Phần trăm (%)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={discountType === "fixed"}
                      onChange={() => setDiscountType("fixed")}
                    />
                    Số tiền cố định (đ)
                  </label>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={discountType === "percentage" ? 100 : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <span className="text-sm text-gray-500">
                    {discountType === "percentage" ? "%" : "đ"}
                  </span>
                </div>
              </section>

              {/* Điều kiện áp dụng */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Điều kiện áp dụng
                </h3>
                <select
                  value={conditionType}
                  onChange={(e) =>
                    setConditionType(e.target.value as ConditionType)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="none">Không điều kiện đặc biệt</option>
                  <option value="first_time">Khách hàng lần đầu</option>
                  <option value="min_order">Hóa đơn tối thiểu</option>
                  <option value="day_of_week">Theo thứ trong tuần</option>
                </select>

                {conditionType === "min_order" && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(Number(e.target.value))}
                      className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="VD: 1000000"
                    />
                    <span className="text-sm text-gray-500">đ trở lên</span>
                  </div>
                )}

                {conditionType === "day_of_week" && (
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                    className="mt-2 w-40 rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    {WEEKDAY_OPTIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                )}
              </section>

              {/* Áp dụng cho dịch vụ cụ thể */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Áp dụng cho dịch vụ cụ thể{" "}
                  <span className="font-normal text-gray-400">
                    (bỏ trống = áp dụng mọi dịch vụ)
                  </span>
                </h3>
                <div className="max-h-48 space-y-3 overflow-y-auto rounded-md border border-gray-200 p-3">
                  {servicesByCategory.map(([category, services]) => (
                    <div key={category}>
                      <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                        {category}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {services.map((s) => (
                          <label
                            key={s.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={selectedServiceIds.includes(s.id)}
                              onChange={() => toggleService(s.id)}
                            />
                            {s.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || loading}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu khuyến mãi"}
          </button>
        </div>
      </div>
    </div>
  );
}
