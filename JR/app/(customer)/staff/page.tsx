// app/staff/page.tsx (Không cần "use client" vì đã là dữ liệu tĩnh)

// Dữ liệu giả (Hard-coded)
const MOCK_STAFF = [
  {
    id: "1",
    name: "Nguyễn Kim Ruby",
    specialty: "Chăm sóc da & Trị liệu",
    experience: "8 năm",
    certification: "Chứng chỉ Quốc tế Cidesco",
    avatar_url: "/avatar1.jpg", // Bạn để tạm ảnh trong folder public
  },
  {
    id: "2",
    name: "Trần Minh Tuấn",
    specialty: "Tạo mẫu tóc",
    experience: "5 năm",
    certification: "Bằng nghề quốc gia",
    avatar_url: "/avatar2.jpg",
  },
];

export default function StaffPage() {
  // Không cần gọi Supabase, dùng luôn MOCK_STAFF
  const staffList = MOCK_STAFF;

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-12">
        Đội ngũ chuyên viên
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm text-center"
          >
            <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-stone-200 flex items-center justify-center">
              {/* Ảnh giả: Nếu chưa có ảnh, nó sẽ hiện placeholder */}
              <span className="text-stone-500">Ảnh</span>
            </div>
            <h3 className="text-xl font-bold mb-1">{staff.name}</h3>
            <p className="text-stone-500 mb-6 uppercase text-xs tracking-widest font-bold">
              {staff.specialty}
            </p>

            <div className="space-y-3 text-sm text-stone-600 bg-stone-50 p-4 rounded-xl">
              <p>
                ✨ Kinh nghiệm: <strong>{staff.experience}</strong>
              </p>
              <p>
                🎓 Bằng cấp: <strong>{staff.certification}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
