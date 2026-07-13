import { createAdminClient } from "@/lib/supabase/server";
import CustomerList from "@/components/admin/CustomerList";
import CustomerModal from "@/components/admin/CustomerModal";
import { requireView } from "@/lib/supabase/admin-guard";

export default async function CustomersPage() {
  await requireView("customers");

  const supabase = await createAdminClient();

  // 1. Thực hiện truy vấn dữ liệu
  const { data: customers, error } = await supabase.from("customers").select(`
    id,
    status,
    profiles (
      fullname,
      phone,
      email,
      gender,
      avatar
    )
  `);

  // 2. Xử lý lỗi nếu có (để tránh lỗi ReferenceError)
  if (error) {
    //console.error("Lỗi khi lấy dữ liệu:", error);
    console.error("Lỗi supabase chi tiết:", JSON.stringify(error, null, 2));
    return <div>Không thể tải dữ liệu khách hàng.</div>;
  }
  // Trong page.tsx
  console.log("Dữ liệu khách hàng:", JSON.stringify(customers, null, 2));
  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        <CustomerModal /> {/* Nút Thêm khách hàng */}
      </div>

      {/* Truyền dữ liệu đã lấy được vào List */}
      <CustomerList customers={customers || []} />
    </div>
  );
}
