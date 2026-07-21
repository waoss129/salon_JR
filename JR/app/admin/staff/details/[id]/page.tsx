export const dynaminc = "force-dynamic"; //ep trang lay du lieu moi tu server
import {
  createAdminClient,
  createAdminAuthClient,
} from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import StaffDetailForm from "@/components/admin/StaffDetailForm";
import { requireView } from "@/lib/supabase/admin-guard";

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireView("staff");

  const { id } = await params;
  const supabase = await createAdminClient();

  // Truy vấn join thông tin nhân viên, profiles và categories
  const { data: staff, error } = await supabase
    .from("employees")
    .select(
      `
    *,
    profiles (fullname, email, gender, phone, dob, address, avatar),
    employee_categories!left (*) 
  `,
    )
    .eq("id", id)
    .single(); // Dùng maybeSingle thay vì single để tránh lỗi 0 rows

  // Thay vì throw new Error(...)
  if (error) {
    console.error("CHI TIẾT LỖI TỪ SUPABASE:", JSON.stringify(error, null, 2));
    return <div>Lỗi: {error.message}</div>;
  }

  if (!staff) {
    notFound(); // Chỉ gọi notFound khi thực sự không có data
  }

  // Lương KHÔNG nằm trên bảng employees — được lưu dạng lịch sử theo thời
  // gian ở bảng salary_history (mỗi lần đổi lương là 1 dòng mới, có
  // effective_from). Lấy dòng gần nhất (mới nhất) để hiển thị mức lương
  // HIỆN TẠI lên form — khác với trang Thống kê lương (nơi cần đúng mức
  // lương "có hiệu lực tại tháng X" cho báo cáo lịch sử).
  const { data: latestSalaryRow, error: salaryError } = await supabase
    .from("salary_history")
    .select("base_salary")
    .eq("employee_id", id)
    .order("effective_from", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (salaryError) {
    console.error(
      "Lỗi lấy lương hiện tại:",
      JSON.stringify(salaryError, null, 2),
    );
  }

  const staffWithSalary = {
    ...staff,
    base_salary: latestSalaryRow?.base_salary ?? 0,
  };

  // Lấy role của người ĐANG XEM trang này (không phải role của nhân viên
  // đang được sửa) — dùng client bám session (createAdminAuthClient), khác
  // với createAdminClient (service-role) dùng để truy vấn dữ liệu staff ở trên.
  const authSupabase = await createAdminAuthClient();
  const {
    data: { user: viewer },
  } = await authSupabase.auth.getUser();

  let viewerRoleId: number | null = null;
  if (viewer) {
    const { data: viewerEmployee } = await authSupabase
      .from("employees")
      .select("role_id")
      .eq("id", viewer.id)
      .single();
    viewerRoleId = viewerEmployee?.role_id ?? null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Hiển thị thông tin tại đây */}
      <h1 className="text-2xl font-bold">
        Chi tiết: {staff.profiles.fullname}
      </h1>
      {/* Render form tương tự ảnh mẫu bạn đã gửi */}
      <StaffDetailForm data={staffWithSalary} viewerRoleId={viewerRoleId} />
    </div>
  );
}
