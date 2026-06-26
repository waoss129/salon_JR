"use client";

import { useState } from "react";

const faqData = [
  {
    group: "Đặt lịch & Thay đổi lịch hẹn",
    items: [
      {
        q: "Làm sao để biết tôi đã đặt lịch thành công?",
        a: "Sau khi bấm xác nhận, hệ thống sẽ hiển thị thông báo thành công. Bạn cũng có thể kiểm tra lại trong mục 'Lịch hẹn của tôi' trong hồ sơ cá nhân.",
      },
      {
        q: "Tôi muốn thay đổi hoặc hủy lịch hẹn thì làm thế nào?",
        a: "Bạn có thể tự thao tác hủy hoặc thay đổi lịch hẹn trên website trước ít nhất 4 tiếng. Nếu dưới 4 tiếng, vui lòng liên hệ trực tiếp hotline để được nhân viên hỗ trợ.",
      },
      {
        q: "Nếu tôi đến trễ thì sao?",
        a: "Chúng tôi giữ lịch hẹn cho bạn tối đa 30 phút. Sau thời gian này, lịch hẹn sẽ tự động bị hủy để đảm bảo tiến độ cho các khách hàng tiếp theo.",
      },
    ],
  },
  {
    group: "Dịch vụ & Trải nghiệm",
    items: [
      {
        q: "Tôi nên chọn dịch vụ nào nếu tôi là người mới?",
        a: "Nếu lần đầu trải nghiệm, bạn có thể xem mô tả chi tiết tại các trang Hair, Nail, Spa hoặc gọi hotline để được tư vấn gói phù hợp nhất với nhu cầu.",
      },
      {
        q: "Dịch vụ tại JoyRide có đảm bảo vệ sinh không?",
        a: "Vệ sinh là ưu tiên hàng đầu của chúng tôi. Tất cả dụng cụ đều được tiệt trùng sau mỗi lần sử dụng và không gian làm dịch vụ luôn được làm sạch định kỳ.",
      },
      {
        q: "Tôi có được yêu cầu kỹ thuật viên cụ thể không?",
        a: "Hoàn toàn được! Bạn hãy ghi chú tên kỹ thuật viên mong muốn vào mục 'Ghi chú' khi đặt lịch, chúng tôi sẽ ưu tiên sắp xếp theo yêu cầu của bạn.",
      },
    ],
  },
  {
    group: "Thanh toán & Ưu đãi",
    items: [
      {
        q: "JoyRide có những hình thức thanh toán nào?",
        a: "Chúng tôi hỗ trợ thanh toán qua tiền mặt, chuyển khoản ngân hàng (VietQR) và các ví điện tử phổ biến.",
      },
      {
        q: "Tôi có thể sử dụng các voucher giảm giá như thế nào?",
        a: "Bạn có thể nhập mã giảm giá trực tiếp vào ô 'Mã ưu đãi' trước khi bấm xác nhận thanh toán ở bước đặt lịch.",
      },
      {
        q: "Giá dịch vụ trên website đã bao gồm phụ phí chưa?",
        a: "Giá hiển thị là giá trọn gói cho dịch vụ. Chúng tôi cam kết không có chi phí ẩn, các khoản phụ phí (nếu có do yêu cầu đặc biệt) sẽ được tư vấn trước khi thực hiện.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (id: string) => setOpenIndex(openIndex === id ? null : id);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-stone-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-center text-stone-800">
        Câu hỏi thường gặp
      </h1>

      {faqData.map((group, gIdx) => (
        <div key={gIdx} className="mb-8">
          <h2 className="text-xl font-bold text-pink-500 mb-4">
            {group.group}
          </h2>
          <div className="space-y-3">
            {group.items.map((item, iIdx) => {
              const id = `${gIdx}-${iIdx}`;
              const isOpen = openIndex === id;
              return (
                <div
                  key={id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggle(id)}
                    className="w-full text-left p-5 font-semibold text-stone-700 flex justify-between items-center hover:bg-stone-50 transition-all"
                  >
                    {item.q}
                    <span>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-stone-600 border-t border-stone-100">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
