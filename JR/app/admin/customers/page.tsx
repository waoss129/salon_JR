import { createAdminClient } from "@/lib/supabase/server";
import CustomerList from "@/components/admin/CustomerList";
import CustomerModal from "@/components/admin/CustomerModal";

export default async function CustomersPage() {
  const supabase = await createAdminClient();

  // Truy vấn dữ liệu tại đây (Server Side)
  const { data: customers } = await supabase.from("customers").select(`
      id,
      status,
      profiles ( fullname, phone, email )
    `);

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
