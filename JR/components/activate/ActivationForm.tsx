"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { activateAccount } from "@/app/activate/actions";

export function ActivationForm({ token }: { token: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // So khớp ngay khi gõ — chỉ báo khi ô "Nhập lại" đã có ký tự, tránh báo
  // đỏ ngay từ đầu lúc ô còn trống.
  const confirmMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    startTransition(async () => {
      try {
        await activateAccount({ token, email, password });
        // Nhân viên/admin đăng nhập ở /admin/login (cookie riêng sb-admin-auth,
        // khác hẳn /login của khách hàng) — xem lib/supabase/middleware.ts
        router.push("/admin/login?activated=1");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra, vui lòng thử lại",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium block mb-1">Email của bạn</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-2 py-1.5"
          placeholder="email@gmail.com"
        />
        <p className="text-xs text-gray-400 mt-1">
          Lưu ý: email này sẽ không thể thay đổi sau khi kích hoạt.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border rounded px-2 py-1.5"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">
          Nhập lại mật khẩu
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className={`w-full border rounded px-2 py-1.5 ${
            confirmMismatch ? "border-red-400" : ""
          }`}
        />
        {confirmMismatch && (
          <p className="text-xs text-red-600 mt-1">
            Mật khẩu nhập lại chưa khớp
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white rounded px-3 py-2 text-sm disabled:opacity-50"
      >
        {isPending ? "Đang kích hoạt..." : "Kích hoạt tài khoản"}
      </button>
    </form>
  );
}
