import PromotionList from "@/components/admin/PromotionList";

export default function PromotionsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Quản lý khuyến mãi
      </h1>
      <PromotionList />
    </div>
  );
}
