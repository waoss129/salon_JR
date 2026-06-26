export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        {/* CỘT TRÁI: THÔNG TIN */}
        <div className="bg-[#F0F9FB] p-8 rounded-2xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              Thông tin studio
            </h2>
            <div className="space-y-4 text-stone-600">
              <p>
                📍 <strong>Địa chỉ:</strong> 180 Cao Lỗ, Phường Chánh Hưng, TP.
                HCM
              </p>
              <p>
                📞 <strong>Hotline:</strong> 1900 1234
              </p>
              <p>
                ✉️ <strong>Email:</strong> hello@joyridebeauty.com
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-pink-100">
            <h4 className="text-pink-500 font-bold text-sm uppercase mb-2">
              Giờ hoạt động
            </h4>
            <p className="text-stone-600">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
            <p className="text-stone-600">Thứ 7: 9:00 - 18:00</p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM GỬI TIN */}
        <div>
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            Gửi tin nhắn cho chúng tôi
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="09012345xx"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                Địa chỉ email
              </label>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                Lời nhắn
              </label>
              <textarea
                rows={4}
                placeholder="Bạn cần tư vấn thêm về gói dịch vụ nào..."
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-200 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-300 hover:bg-pink-400 text-white font-bold py-4 rounded-xl transition-all shadow-md"
            >
              GỬI LỜI NHẮN ✨
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
