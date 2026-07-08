import { createAdminClient } from "@/lib/supabase/server";
import CustomerForm from "@/components/admin/CustomerDetailForm";
import { updateCustomer } from "../actions";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();

  // Lấy dữ liệu profile từ database
  const { data: customer } = await supabase
    .from("customers")
    .select(`id, status, profiles(fullname, phone, gender, dob, address)`)
    .eq("id", id)
    .single();

  // if (error || !customer) {
  //   return <div className="p-10 text-center">Không tìm thấy khách hàng.</div>;
  // }

  // 2. Lấy Email từ Auth API (Vì email thường nằm trong auth.users)
  const { data: authUser } = await supabase.auth.admin.getUserById(id);

  // 3. Kết hợp dữ liệu lại thành một object hoàn chỉnh
  // Tạo một object tổng hợp để truyền vào Form - tạo biến đồng nhất
  const customerData = {
    ...customer,
    email: authUser.user?.email || "Chưa có email", // Lấy email từ auth.users thay vì từ profiles
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Chi tiết: {customer?.profiles?.fullname}
      </h1>
      <CustomerForm
        initialData={customerData} // Phải khớp với tên biến ở trên
        action={updateCustomer.bind(null, id)}
      />
    </div>
  );
}
