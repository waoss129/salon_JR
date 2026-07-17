"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSessions,
  getRoles,
  getEmployees,
  type SessionRow,
  type EmployeeOption,
} from "@/app/admin/schedules/actions";
import {
  createScheduleProposal,
  getEmployeeCategories,
  getEmployeesByCategory,
  getNextWeekInfo,
  type CandidateEmployee,
  type CategoryOption,
  type NextWeekInfo,
} from "@/app/admin/schedules/proposals/actions";

const WEEKDAY_HEADER = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function dayGroup(dateStr: string): "T2-T6" | "T7" | "CN" {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  if (dow >= 1 && dow <= 5) return "T2-T6";
  if (dow === 6) return "T7";
  return "CN";
}

function sessionsForDate(sessions: SessionRow[], dateStr: string) {
  const group = dayGroup(dateStr);
  return sessions.filter((s) => s.name.toUpperCase().includes(group));
}

function shiftLabel(sessionName: string) {
  return sessionName.toUpperCase().startsWith("SA") ? "Sáng" : "Chiều";
}

type CalendarCell = { date: string; inCurrentMonth: boolean };

function buildMonthGrid(weekStart: string): CalendarCell[] {
  const [wy, wm] = weekStart.split("-").map(Number);
  const month = wm - 1;
  const firstOfMonth = new Date(wy, month, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = CN
  const gridStart = new Date(wy, month, 1 - startOffset);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push({
      date: d.toISOString().slice(0, 10),
      inCurrentMonth: d.getMonth() === month,
    });
  }
  // Bỏ bớt hàng cuối nếu toàn ngày tháng sau (lưới thường chỉ cần 5-6 hàng).
  while (cells.length > 35 && cells.slice(-7).every((c) => !c.inCurrentMonth)) {
    cells.splice(-7, 7);
  }
  return cells;
}

export default function ProposeScheduleModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [roles, setRoles] = useState<{ id: number; role_name: string }[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [candidates, setCandidates] = useState<CandidateEmployee[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const [directEmployees, setDirectEmployees] = useState<EmployeeOption[]>([]);
  const [loadingDirectEmployees, setLoadingDirectEmployees] = useState(false);

  const [employeeId, setEmployeeId] = useState<string>("");

  const BEAUTICIAN_ROLE_ID = 4;
  const requiresCategory = selectedRoleId === BEAUTICIAN_ROLE_ID;

  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [weekInfo, setWeekInfo] = useState<NextWeekInfo | null>(null);

  // date -> danh sách sessionId đã tích cho ngày đó (cho phép nhiều ca/ngày)
  const [selections, setSelections] = useState<Record<string, number[]>>({});

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Không tải được danh sách vai trò.",
        ),
      );
    getEmployeeCategories()
      .then(setCategories)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Không tải được danh mục chuyên môn.",
        ),
      );
    getSessions()
      .then(setSessions)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Không tải được danh sách ca làm.",
        ),
      );
    getNextWeekInfo()
      .then(setWeekInfo)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Không tải được thông tin tuần sau.",
        ),
      );
  }, []);

  // Đổi vai trò -> reset lựa chọn bên dưới, tránh giữ lại state không còn hợp lệ.
  useEffect(() => {
    setCategoryId("");
    setCandidates([]);
    setDirectEmployees([]);
    setEmployeeId("");

    if (!selectedRoleId || selectedRoleId === BEAUTICIAN_ROLE_ID) return;

    // Role không có chuyên môn (Manager/Receptionist): lấy thẳng danh sách nhân viên theo role.
    setLoadingDirectEmployees(true);
    getEmployees(selectedRoleId)
      .then(setDirectEmployees)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Không tải được danh sách nhân viên.",
        ),
      )
      .finally(() => setLoadingDirectEmployees(false));
  }, [selectedRoleId]);

  useEffect(() => {
    if (!categoryId) {
      setCandidates([]);
      setEmployeeId("");
      return;
    }
    setLoadingCandidates(true);
    getEmployeesByCategory(categoryId)
      .then((data) => {
        setCandidates(data);
        setEmployeeId("");
      })
      .finally(() => setLoadingCandidates(false));
  }, [categoryId]);

  const monthCells = useMemo(() => {
    if (!weekInfo) return [];
    return buildMonthGrid(weekInfo.weekStart);
  }, [weekInfo]);

  function toggleShift(date: string, sessionId: number) {
    setSelections((prev) => {
      const current = prev[date] ?? [];
      const next = current.includes(sessionId)
        ? current.filter((id) => id !== sessionId)
        : [...current, sessionId];
      return { ...prev, [date]: next };
    });
  }

  const regularCount = weekInfo
    ? weekInfo.weekdayDates.reduce(
        (sum, d) => sum + (selections[d]?.length ?? 0),
        0,
      )
    : 0;
  const specialCount = weekInfo
    ? weekInfo.weekendDates.reduce(
        (sum, d) => sum + (selections[d]?.length ?? 0),
        0,
      )
    : 0;

  async function handleSubmit() {
    setError(null);

    if (!employeeId) return setError("Vui lòng chọn nhân viên.");
    if (!weekInfo) return setError("Đang tải thông tin tuần, thử lại sau.");
    if (regularCount < 4)
      return setError("Cần đề xuất ít nhất 4 ca thường (Thứ 2 - Thứ 6).");
    if (specialCount < 1)
      return setError("Cần đề xuất ít nhất 1 ca đặc biệt (Thứ 7 / Chủ nhật).");

    const regularShifts = weekInfo.weekdayDates.flatMap((date) =>
      (selections[date] ?? []).map((sessionId) => ({ date, sessionId })),
    );
    const specialShifts = weekInfo.weekendDates.flatMap((date) =>
      (selections[date] ?? []).map((sessionId) => ({ date, sessionId })),
    );

    setSaving(true);
    try {
      const result = await createScheduleProposal({
        employeeId,
        regularShifts,
        specialShifts,
      });
      if (!result.emailSent) {
        alert(
          `Đã lưu đề xuất lịch thành công, nhưng gửi mail thông báo thất bại: ${
            result.emailError ?? "Lỗi không xác định"
          }. Bạn nên báo trực tiếp cho nhân viên biết.`,
        );
      }
      onCreated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tạo đề xuất lịch.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Đề xuất lịch làm việc tuần sau
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {weekInfo && (
            <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
              Đề xuất cho tuần <strong>{weekInfo.weekStart}</strong> →{" "}
              <strong>{weekInfo.weekEnd}</strong>. Nhân viên cần chọn/xác nhận
              trước <strong>21:00 Thứ 7 tuần này</strong>, sau đó nếu không vào
              chọn thì mặc định áp dụng toàn bộ ca đã đề xuất.
            </p>
          )}

          {/* Chọn vai trò */}
          <section>
            <label className="mb-1 block text-sm text-gray-600">
              Vai trò nhân viên
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) =>
                setSelectedRoleId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">-- Chọn vai trò --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.role_name}
                </option>
              ))}
            </select>
          </section>

          {/* Chọn danh mục (chỉ Beautician) + nhân viên */}
          {selectedRoleId && (
            <section
              className={`grid gap-4 ${requiresCategory ? "grid-cols-2" : "grid-cols-1"}`}
            >
              {requiresCategory && (
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Danh mục chuyên môn
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) =>
                      setCategoryId(
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Nhân viên
                </label>
                {requiresCategory ? (
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    disabled={!categoryId || loadingCandidates}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
                  >
                    <option value="">
                      {!categoryId
                        ? "-- Chọn danh mục trước --"
                        : loadingCandidates
                          ? "Đang tải..."
                          : candidates.length === 0
                            ? "Không có nhân viên nào"
                            : "-- Chọn nhân viên --"}
                    </option>
                    {candidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.fullname}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    disabled={loadingDirectEmployees}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
                  >
                    <option value="">
                      {loadingDirectEmployees
                        ? "Đang tải..."
                        : directEmployees.length === 0
                          ? "Không có nhân viên nào"
                          : "-- Chọn nhân viên --"}
                    </option>
                    {directEmployees.map((e) => (
                      <option key={e.id} value={e.id}>
                        #{e.id.slice(0, 8).toUpperCase()} — {e.fullname}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </section>
          )}

          {employeeId && weekInfo && (
            <section>
              <div className="mb-2 flex items-center justify-between text-sm">
                <h3 className="font-semibold text-gray-700">
                  Chọn ca làm việc cho tuần sau
                </h3>
                <span className="text-gray-500">
                  Ca thường:{" "}
                  <strong
                    className={
                      regularCount < 4 ? "text-red-500" : "text-emerald-600"
                    }
                  >
                    {regularCount}
                  </strong>
                  /tối thiểu 4{"  ·  "}
                  Ca đặc biệt:{" "}
                  <strong
                    className={
                      specialCount < 1 ? "text-red-500" : "text-emerald-600"
                    }
                  >
                    {specialCount}
                  </strong>
                  /tối thiểu 1
                </span>
              </div>

              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="grid grid-cols-7 bg-gray-50 text-center text-xs font-semibold text-gray-500">
                  {WEEKDAY_HEADER.map((label) => (
                    <div key={label} className="border-b border-gray-200 py-2">
                      {label}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {monthCells.map((cell) => {
                    const isNextWeek =
                      cell.date >= weekInfo.weekStart &&
                      cell.date <= weekInfo.weekEnd;
                    const options = isNextWeek
                      ? sessionsForDate(sessions, cell.date)
                      : [];
                    const dayNum = Number(cell.date.slice(8, 10));

                    return (
                      <div
                        key={cell.date}
                        className={`min-h-[84px] border-b border-r border-gray-100 p-1.5 ${
                          isNextWeek
                            ? "bg-white"
                            : cell.inCurrentMonth
                              ? "bg-gray-50/50"
                              : "bg-gray-50/20"
                        }`}
                      >
                        <p
                          className={`mb-1 text-xs ${
                            isNextWeek
                              ? "font-semibold text-gray-800"
                              : "text-gray-300"
                          }`}
                        >
                          {dayNum}
                        </p>
                        {isNextWeek && (
                          <div className="space-y-1">
                            {options.length === 0 && (
                              <p className="text-[10px] text-gray-300">
                                Chưa có ca
                              </p>
                            )}
                            {options.map((s) => {
                              const checked = (
                                selections[cell.date] ?? []
                              ).includes(s.id);
                              return (
                                <label
                                  key={s.id}
                                  className="flex items-center gap-1 text-[11px] text-gray-600"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                      toggleShift(cell.date, s.id)
                                    }
                                    className="h-3 w-3"
                                  />
                                  {shiftLabel(s.name)}
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
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
            disabled={saving}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Gửi đề xuất"}
          </button>
        </div>
      </div>
    </div>
  );
}
