import { createAdminClient } from "@/lib/supabase/server";
import StaffListClient from "@/components/admin/StaffListClient";
import StaffModal from "@/components/admin/StaffModal";
import { requireView } from "@/lib/supabase/admin-guard";

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
        {/* Nút THÊM MỚI ở đây */}
        <StaffModal roleId={roleId} />
      </div>
      <StaffListClient initialStaff={staffList} roleId={roleId} />
    </div>
  );
}
