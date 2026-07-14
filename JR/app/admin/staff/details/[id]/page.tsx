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
      <StaffDetailForm data={staff} viewerRoleId={viewerRoleId} />
    </div>
  );
}
