"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase tự parse token trong URL và tạo session "recovery"
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Fallback: nếu đã có session sẵn khi vào trang (đôi khi event bắn trước khi mount)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(
        "Không thể cập nhật mật khẩu. Liên kết có thể đã hết hạn, vui lòng thử lại.",
      );
    } else {
      alert("Đặt lại mật khẩu thành công!");
      router.push("/login");
    }
  };

  if (!ready) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center text-stone-500">
        Đang xác thực liên kết...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800">
            Đặt mật khẩu mới
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none text-stone-800"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none text-stone-800"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-2 disabled:opacity-60"
          >
            {loading ? "Đang lưu..." : "Lưu mật khẩu mới"}
          </button>
        </form>
      </div>
    </div>
  );
}
