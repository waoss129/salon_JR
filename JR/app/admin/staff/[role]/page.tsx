import {
  createAdminClient,
  createAdminAuthClient,
} from "@/lib/supabase/server";
import StaffListClient from "@/components/admin/StaffListClient";
import StaffModal from "@/components/admin/StaffModal";
import { requireView } from "@/lib/supabase/admin-guard";
import { canManage } from "@/lib/supabase/permissions";

export default async function RolePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  await requireView("staff");
  const { role } = await params;
  const supabase = await createAdminClient();

  const roleMap: Record<string, number> = {
    manager: 3,
    beautician: 4,
    receptionist: 5,
  };
  const roleId = roleMap[role];

  // Lấy role của người ĐANG XEM trang này (không phải role của các nhân
  // viên trong danh sách) — dùng để quyết định có hiện nút "Thêm nhân viên"
  // và cho phép đổi trạng thái hay không. Vd: CEO (role 2) chỉ được xem
  // trang nhân viên, không được thêm/sửa (xem PERMISSIONS.staff.manage
  // trong lib/supabase/permissions.ts).
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
  const canManageStaff = canManage(viewerRoleId, "staff");

  // 1. Lấy employees
  const { data: employees } = await supabase
    .from("employees")
    .select("id, status")
    .eq("role_id", roleId);

  // 2. Lấy profiles đầy đủ hơn
  const ids = employees?.map((e) => e.id) || [];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, fullname, email, phone, gender, avatar") // Thêm các trường cần thiết
    .in("id", ids);

  const staffList =
    employees?.map((emp) => ({
      ...emp,
      profiles: profiles?.find((p) => p.id === emp.id),
    })) || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold uppercase">Nhân viên: {role}</h1>
        {/* CEO (và bất kỳ role nào không có quyền manage) chỉ xem, không
            được thêm nhân viên mới — nút chỉ hiện khi canManageStaff */}
        {canManageStaff && <StaffModal roleId={roleId} />}
      </div>
      <StaffListClient
        initialStaff={staffList}
        roleId={roleId}
        canManage={canManageStaff}
      />
    </div>
  );
}