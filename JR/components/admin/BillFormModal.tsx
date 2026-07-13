"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createBill,
  getActiveServices,
  getAppointmentOriginalService,
  getBillableAppointments,
  getCurrentStaffName,
  type ActiveService,
  type BillableAppointment,
} from "@/app/admin/bills/actions";
import { getBestPromotionForBill, type BestPromotionResult } from "@/app/admin/promotions/actions";

type ServiceLine = {
  key: string;
  serviceId: number | null;
  serviceName: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
};

const GENDER_LABEL: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
  prefer_not_to_say: "Không muốn tiết lộ",
};

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

let lineKeyCounter = 0;
function nextLineKey() {
  lineKeyCounter += 1;
  return `line-${lineKeyCounter}`;
}

export default function BillFormModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointments, setAppointments] = useState<BillableAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<BillableAppointment | null>(null);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const [activeServices, setActiveServices] = useState<ActiveService[]>([]);
  const [lines, setLines] = useState<ServiceLine[]>([]);

  const [staffName, setStaffName] = useState<string>("—");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bestPromotion, setBestPromotion] = useState<BestPromotionResult>(null);

  // Load dịch vụ đang active (cho dropdown) + tên người đang đăng nhập.
  useEffect(() => {
    getActiveServices().then(({ data }) => setActiveServices(data));
    getCurrentStaffName().then((name) => setStaffName(name ?? "—"));
  }, []);

  // Tìm appointment đủ điều kiện lập hóa đơn (completed & chưa có bill), debounce theo search.
  useEffect(() => {
    if (selectedAppointment) return;
    const timeout = setTimeout(async () => {
      setLoadingAppointments(true);
      const { data } = await getBillableAppointments(appointmentSearch || undefined);
      setAppointments(data);
      setLoadingAppointments(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [appointmentSearch, selectedAppointment]);

  function serviceLabel(s: ActiveService) {
    return `${s.name} — ${formatCurrency(s.price)}`;
  }

  async function handleSelectAppointment(appointment: BillableAppointment) {
    setSelectedAppointment(appointment);
    setError(null);

    // Auto-fill dòng dịch vụ gốc đã đặt (bảng `details`).
    type OriginalService = {
      id: number;
      name: string;
      price: number;
      categories: { name: string } | null;
    };

    const { data } = await getAppointmentOriginalService(appointment.id);
    const raw = data?.services as OriginalService | OriginalService[] | null | undefined;
    const svc: OriginalService | null = raw ? (Array.isArray(raw) ? raw[0] : raw) : null;

    if (svc) {
      setLines([
        {
          key: nextLineKey(),
          serviceId: svc.id,
          serviceName: svc.name,
          categoryName: svc.categories?.name ?? "—",
          quantity: 1,
          unitPrice: data?.price ?? svc.price,
        },
      ]);
    } else {
      setLines([]);
    }
  }

  function handleAddLine() {
    if (activeServices.length === 0) return;
    const first = activeServices[0];
    setLines((prev) => [
      ...prev,
      {
        key: nextLineKey(),
        serviceId: first.id,
        serviceName: first.name,
        categoryName: first.categories?.name ?? "—",
        quantity: 1,
        unitPrice: first.price,
      },
    ]);
  }

  function handleLineServiceChange(key: string, serviceId: number) {
    const service = activeServices.find((s) => s.id === serviceId);
    if (!service) return;
    setLines((prev) =>
      prev.map((line) =>
        line.key === key
          ? {
              ...line,
              serviceId: service.id,
              serviceName: service.name,
              categoryName: service.categories?.name ?? "—",
              unitPrice: service.price,
            }
          : line
      )
    );
  }

  function handleLineQuantityChange(key: string, quantity: number) {
    setLines((prev) =>
      prev.map((line) => (line.key === key ? { ...line, quantity: Math.max(1, quantity || 1) } : line))
    );
  }

  function handleLinePriceChange(key: string, unitPrice: number) {
    setLines((prev) =>
      prev.map((line) => (line.key === key ? { ...line, unitPrice: Math.max(0, unitPrice || 0) } : line))
    );
  }

  function handleRemoveLine(key: string) {
    setLines((prev) => prev.filter((line) => line.key !== key));
  }

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
    [lines]
  );

  // Tự động dò khuyến mãi tốt nhất áp dụng được cho hóa đơn hiện tại.
  useEffect(() => {
    if (!selectedAppointment || lines.length === 0) {
      setBestPromotion(null);
      return;
    }
    const customerId = selectedAppointment.customers?.id;
    if (!customerId) return;

    getBestPromotionForBill({
      customerId,
      appointmentDate: selectedAppointment.appointment_date,
      lineSubtotals: lines
        .filter((l) => l.serviceId != null)
        .map((l) => ({ serviceId: l.serviceId as number, subtotal: l.quantity * l.unitPrice })),
    }).then(setBestPromotion);
  }, [selectedAppointment, lines]);

  const finalTotal = total - (bestPromotion?.discountAmount ?? 0);

  async function handleSubmit() {
    if (!selectedAppointment) {
      setError("Vui lòng chọn lịch hẹn của khách hàng.");
      return;
    }
    if (lines.length === 0) {
      setError("Hóa đơn phải có ít nhất 1 dịch vụ.");
      return;
    }
    if (lines.some((l) => !l.serviceId || l.quantity <= 0)) {
      setError("Vui lòng kiểm tra lại dịch vụ / số lượng.");
      return;
    }

    setSaving(true);
    setError(null);
    const { data, error } = await createBill({
      appointmentId: selectedAppointment.id,
      services: lines.map((l) => ({
        serviceId: l.serviceId as number,
        quantity: l.quantity,
        priceAtTime: l.unitPrice,
      })),
      promotionId: bestPromotion?.promotionId ?? null,
      discountAmount: bestPromotion?.discountAmount ?? 0,
    });
    setSaving(false);

    if (error) {
      setError(error);
      return;
    }
    if (data) onCreated();
  }

  const profile = selectedAppointment?.customers?.profiles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Thêm mới hóa đơn</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {/* Chọn lịch hẹn / khách hàng */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Chọn lịch hẹn đã hoàn thành</h3>
            {selectedAppointment ? (
              <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                <span>
                  {profile?.fullname ?? "—"} · {profile?.phone ?? "—"} ·{" "}
                  {new Date(selectedAppointment.appointment_date).toLocaleDateString("vi-VN")}
                </span>
                <button
                  onClick={() => {
                    setSelectedAppointment(null);
                    setLines([]);
                  }}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Đổi
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc số điện thoại..."
                  value={appointmentSearch}
                  onChange={(e) => setAppointmentSearch(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                />
                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200">
                  {loadingAppointments ? (
                    <p className="px-3 py-3 text-sm text-gray-400">Đang tải...</p>
                  ) : appointments.length === 0 ? (
                    <p className="px-3 py-3 text-sm text-gray-400">
                      Không có lịch hẹn nào phù hợp (đã hoàn thành &amp; chưa lập hóa đơn).
                    </p>
                  ) : (
                    appointments.map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => handleSelectAppointment(apt)}
                        className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-gray-50"
                      >
                        <span>
                          {apt.customers?.profiles?.fullname ?? "—"} · {apt.customers?.profiles?.phone ?? "—"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(apt.appointment_date).toLocaleDateString("vi-VN")}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </section>

          {selectedAppointment && (
            <>
              {/* Thông tin khách hàng */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <Field
                    label="Mã khách hàng"
                    value={
                      selectedAppointment.customers?.id
                        ? `#${selectedAppointment.customers.id.slice(0, 8).toUpperCase()}`
                        : "—"
                    }
                  />
                  <Field label="Họ và tên" value={profile?.fullname ?? "—"} />
                  <Field
                    label="Ngày sinh"
                    value={profile?.dob ? new Date(profile.dob).toLocaleDateString("vi-VN") : "—"}
                  />
                  <Field label="Giới tính" value={profile?.gender ? GENDER_LABEL[profile.gender] : "—"} />
                  <Field label="Số điện thoại" value={profile?.phone ?? "—"} />
                </div>
              </section>

              {/* Thông tin hóa đơn */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Thông tin hóa đơn</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <Field label="Mã hóa đơn" value="Sẽ được tạo tự động" />
                  <Field label="Ngày lập" value={new Date().toLocaleDateString("vi-VN")} />
                  <Field label="Trạng thái" value="Chưa thanh toán" />
                  <Field label="Người lập" value={staffName} />
                </div>
              </section>

              {/* Dịch vụ thực hiện */}
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">Dịch vụ thực hiện</h3>
                  <button onClick={handleAddLine} className="text-xs font-medium text-blue-600 hover:underline">
                    + Thêm dịch vụ
                  </button>
                </div>
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left font-medium text-gray-500">STT</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-500">Danh mục</th>
                        <th className="px-2 py-2 text-left font-medium text-gray-500">Dịch vụ</th>
                        <th className="px-2 py-2 text-center font-medium text-gray-500">SL</th>
                        <th className="px-2 py-2 text-right font-medium text-gray-500">Đơn giá</th>
                        <th className="px-2 py-2 text-right font-medium text-gray-500">Thành tiền</th>
                        <th className="px-2 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lines.map((line, idx) => (
                        <tr key={line.key}>
                          <td className="px-2 py-2">{idx + 1}</td>
                          <td className="px-2 py-2">{line.categoryName}</td>
                          <td className="px-2 py-2">
                            <select
                              value={line.serviceId ?? ""}
                              onChange={(e) => handleLineServiceChange(line.key, Number(e.target.value))}
                              className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                            >
                              {line.serviceId != null &&
                                !activeServices.some((s) => s.id === line.serviceId) && (
                                  <option value={line.serviceId}>
                                    {line.serviceName} (ngừng kinh doanh)
                                  </option>
                                )}
                              {activeServices.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {serviceLabel(s)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <input
                              type="number"
                              min={1}
                              value={line.quantity}
                              onChange={(e) => handleLineQuantityChange(line.key, Number(e.target.value))}
                              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center text-sm"
                            />
                          </td>
                          <td className="px-2 py-2 text-right">
                            <input
                              type="number"
                              min={0}
                              value={line.unitPrice}
                              onChange={(e) => handleLinePriceChange(line.key, Number(e.target.value))}
                              className="w-24 rounded-md border border-gray-300 px-2 py-1 text-right text-sm"
                            />
                          </td>
                          <td className="px-2 py-2 text-right">{formatCurrency(line.quantity * line.unitPrice)}</td>
                          <td className="px-2 py-2 text-center">
                            <button onClick={() => handleRemoveLine(line.key)} className="text-red-500 hover:text-red-700">
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                      {lines.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-2 py-4 text-center text-gray-400">
                            Chưa có dịch vụ nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Thông tin thanh toán */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Thông tin thanh toán</h3>
                <div className="space-y-1 text-right">
                  <div className="text-sm text-gray-500">Tạm tính: {formatCurrency(total)}</div>
                  {bestPromotion && (
                    <div className="text-sm text-emerald-600">
                      Khuyến mãi {bestPromotion.promotionCode} ({bestPromotion.promotionName}): −
                      {formatCurrency(bestPromotion.discountAmount)}
                    </div>
                  )}
                  <div className="text-base font-semibold text-gray-900">
                    Tổng tiền: {formatCurrency(finalTotal)}
                  </div>
                </div>
              </section>
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !selectedAppointment}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu hóa đơn"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}