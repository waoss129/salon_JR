import BillList from "@/components/admin/BillList";

export default function BillsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Quản lý hóa đơn
      </h1>
      <BillList />
    </div>
  );
}
