export const dynamic = "force-dynamic";
//import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import StaffModal from "@/components/admin/StaffModal";

export default async function StaffPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const supabase = await createAdminClient();
  const { type } = await params; // 'manager', 'beautician', hay 'receptionist'

  // 1. Ánh xạ 'type' từ URL sang 'roleId' để truyền vào Modal
  const roleMap: Record<string, number> = {
    admin: 1,
    ceo: 2,
    manager: 3,
    beautician: 4,
    receptionist: 5,
  };
  const currentRoleId = roleMap[type] || 0;

  // Truy vấn lấy nhân viên kèm thông tin profile và role
  // Sử dụng inner join để lọc dữ liệu theo role_name
  // Ví dụ truy vấn đúng
  const { data: staffList, error } = await supabase
    .from("employees")
    .select(
      `
    *,
    profiles (fullname, email, phone, gender, avatar)
  `,
    )
    .eq("role_id", currentRoleId);

  if (error) {
    console.error("Lỗi Supabase:", JSON.stringify(error, null, 2));
    return <div>Lỗi: {error.message || "Không thể lấy dữ liệu"}</div>;
  }
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold uppercase">Nhân viên {type}</h1>
        {/* Truyền đúng roleId vào Modal để tránh lỗi Foreign Key */}
        <StaffModal roleId={currentRoleId} />{" "}
        {/* Nút Thêm nhân viên xuất hiện ở đây */}
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Mã nhân viên</th>
            <th className="p-2 border">Ảnh</th>
            <th className="p-2 border">Họ & Tên</th>
            <th className="p-2 border">Giới tính</th>
            <th className="p-2 border">Số điện thoại</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {staffList?.map((staff: any) => (
            <tr key={staff.id}>
              <td className="p-2 border text-center">{staff.id.slice(0, 8)}</td>
              <td className="p-2 border">
                <img
                  src={staff.profiles?.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="p-2 border">{staff.profiles.fullname}</td>
              <td className="p-2 border">{staff.profiles.gender}</td>
              <td className="p-2 border">{staff.profiles.phone}</td>
              <td className="p-2 border">{staff.profiles.email}</td>
              <td className="p-2 border">{staff.status}</td>
              <td className="p-2 border text-blue-600 cursor-pointer">Xem</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
