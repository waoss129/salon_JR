"use client";

import { useState, useEffect } from "react";
import { createAdminBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminResetPasswordPage() {
  const supabase = createAdminBrowserClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Fallback: nếu session recovery đã có sẵn khi component mount
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
        "Không thể cập nhật mật khẩu. Liên kết có thể đã hết hạn, vui lòng yêu cầu lại.",
      );
    } else {
      alert("Đặt lại mật khẩu thành công!");
      router.push("/admin/login");
    }
  };

  if (!ready) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#f2e6ce" }}
      >
        <p className="text-slate-500 font-medium">Đang xác thực liên kết...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#f2e6ce" }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-wider text-slate-900">
            JoyRide
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Đặt mật khẩu quản trị mới
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-200 hover:brightness-95 active:scale-[0.99] disabled:opacity-60"
            style={{ backgroundColor: "#77a7c4" }}
          >
            {loading ? "Đang lưu..." : "Lưu mật khẩu mới"}
          </button>
        </form>
      </div>
    </div>
  );
}
