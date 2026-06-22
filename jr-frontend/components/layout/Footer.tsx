import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter, // Sử dụng FaXTwitter để có logo X chính thức
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6"; // Lưu ý: fa6 chứa icon X mới nhất

const Footer = () => {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Cột trái: Thông tin liên hệ */}
        <div>
          <h3 className="text-lg font-bold uppercase mb-4">
            CHÚNG TÔI LUÔN Ở ĐÂY
          </h3>
          <p className="text-gray-600 mb-2">
            Bạn có câu hỏi? Bạn có thể tìm câu trả lời trong mục Câu hỏi thường
            gặp (FAQs).
          </p>
          <p className="text-gray-600 mb-4">
            Hoặc bạn cũng có thể liên hệ trực tiếp với chúng tôi:
          </p>
          <p className="font-bold text-gray-900 mb-2">Điện thoại: 1900 1234</p>
          <p className="text-gray-600">Thứ Hai đến Thứ Sáu: 8:00 - 17:00</p>
          <p className="text-gray-600 mb-4">Thứ Bảy: 9:00 - 18:00</p>
          <Link href="/contact" className="text-blue-600 hover:underline">
            Gửi email cho chúng tôi
          </Link>
        </div>

        {/* Cột phải: Dịch vụ khách hàng và Social Icons */}
        <div className="flex flex-col md:items-end">
          <h3 className="text-lg font-bold uppercase mb-4">
            DỊCH VỤ KHÁCH HÀNG
          </h3>
          <ul className="space-y-2 text-gray-600 text-right mb-6">
            <li>
              <Link href="/contact" className="hover:underline">
                Liên hệ với chúng tôi
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="hover:underline">
                Câu hỏi thường gặp (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/promotions" className="hover:underline">
                Thẻ quà tặng / Ưu đãi
              </Link>
            </li>
            <li>
              <Link href="/policy" className="hover:underline">
                Chính sách & Bảo hành
              </Link>
            </li>
          </ul>

          {/* Social Icons được đưa vào đây */}
          <div className="flex space-x-3">
            {[
              { icon: FaFacebookF, link: "#" },
              { icon: FaInstagram, link: "#" },
              { icon: FaXTwitter, link: "#" },
              { icon: FaYoutube, link: "#" },
              { icon: FaTiktok, link: "#" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition"
              >
                <item.icon className="text-gray-600" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="container mx-auto px-6 mt-12 text-gray-500 text-sm text-center">
        &copy; 2026 JoyRide Beauty Studio. Toàn bộ bản quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;
