import { createAdminClient } from "@/lib/supabase/server";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // params phải là Promise
}) {
  const { id } = await params; // Phải await params mới có được id
  const supabase = await createAdminClient();

  // Thử bỏ qua việc join profiles để kiểm tra xem ID này có tồn tại trong bảng customers không
  const { data: customer, error } = await supabase
    .from("customers")
    .select(
      `
      id,
      status,
      profiles (
        fullname,
        email,
        phone,
        gender
      )
    `,
    )
    .eq("id", id) // Bây giờ 'id' đã là một string hợp lệ
    .single();

  if (error) {
    console.error("Lỗi Supabase:", error); // Kiểm tra log xem lỗi là gì
    return <div>Có lỗi xảy ra: {error.message}</div>;
  }

  if (!customer) {
    return <div>Không tìm thấy khách hàng với ID: {params.id}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chi tiết khách hàng</h1>
      <div className="bg-white p-6 rounded shadow border">
        <p>
          <strong>Họ tên:</strong> {customer.profiles?.fullname}
        </p>
        <p>
          <strong>Email:</strong> {customer.profiles?.email}
        </p>
        <p>
          <strong>SĐT:</strong> {customer.profiles?.phone}
        </p>
        <p>
          <strong>Giới tính:</strong> {customer.profiles?.gender}
        </p>
        <p>
          <strong>Trạng thái:</strong> {customer.status}
        </p>
      </div>
    </div>
  );
}
