import { createClient } from "@/lib/supabase/server";

export default async function StaffPage() {
  const supabase = await createClient();

  // Truy vấn dữ liệu từ 4 bảng liên quan
  const { data: staffList, error } = await supabase
    .from("employees")
    .select(
      `
    id,
    certificate_name,
    level,
    profiles!fk_employees_profiles (fullname, avatar), 
    employee_categories (
      categories (name)
    )
  `,
    )
    .eq("role_id", 4); // Chỉ lấy nhân viên là chuyên viên (role_id = 4)
  // console.log("Staff List:", staffList);
  // console.log("Error:", error);

  console.log("Dữ liệu nhân viên:", staffList);
  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Lỗi tải dữ liệu: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-12">
        Đội ngũ chuyên viên
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staffList?.map((staff: any) => (
          <div
            key={staff.id}
            className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm text-center"
          >
            <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden bg-stone-200 border-4 border-stone-50">
              {/* Hiển thị avatar hoặc placeholder */}
              <img
                src={staff.profiles?.avatar || "/default-avatar.png"}
                alt={staff.profiles?.fullname}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-bold mb-1">
              {staff.profiles?.fullname || "Chuyên viên"}
            </h3>

            {/* Lấy tên chuyên môn từ bảng categories được join */}
            <p className="text-stone-500 mb-6 uppercase text-xs tracking-widest font-bold">
              {staff.employee_categories?.[0]?.categories?.name ||
                "Chuyên viên làm đẹp"}
            </p>

            <div className="space-y-3 text-sm text-stone-600 bg-stone-50 p-4 rounded-xl">
              <p>
                ✨ Kinh nghiệm:{" "}
                <strong>{staff.level || "Đang cập nhật"}</strong>
              </p>
              <p>
                🎓 Bằng cấp:{" "}
                <strong>{staff.certificate_name || "Đang cập nhật"}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
