import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import StaffDetailForm from "@/components/admin/StaffDetailForm";

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();

  // Truy vấn join thông tin nhân viên, profiles và categories
  // Thay thế đoạn query hiện tại bằng đoạn này
  const { data: staff, error } = await supabase
    .from("employees")
    .select(
      `
    *,
    profiles (fullname, email, phone, gender, avatar),
    employee_categories!left (*) 
  `,
    )
    .eq("id", id)
    .maybeSingle(); // Dùng maybeSingle thay vì single để tránh lỗi 0 rows

  // Thay vì throw new Error(...)
  if (error) {
    console.error("CHI TIẾT LỖI TỪ SUPABASE:", JSON.stringify(error, null, 2));
    return <div>Lỗi: {error.message}</div>;
  }

  if (!staff) {
    notFound(); // Chỉ gọi notFound khi thực sự không có data
  }
  console.log("Dữ liệu gửi vào Form:", JSON.stringify(staff, null, 2));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Hiển thị thông tin tại đây */}
      <h1 className="text-2xl font-bold">
        Chi tiết: {staff.profiles.fullname}
      </h1>
      {/* Render form tương tự ảnh mẫu bạn đã gửi */}
      <StaffDetailForm data={staff} />
    </div>
  );
}
