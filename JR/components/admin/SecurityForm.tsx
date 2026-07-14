"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateEmail,
  updatePassword,
} from "@/app/admin/accounts/security/actions";

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function Alert({ success, message }: { success: boolean; message: string }) {
  if (!message) return null;
  return (
    <div
      className={`rounded-md p-3 text-sm ${
        success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {message}
    </div>
  );
}

export default function SecurityForm({
  currentEmail,
  canEditEmail,
}: {
  currentEmail: string;
  canEditEmail: boolean;
}) {
  const [emailState, emailAction] = useActionState(updateEmail, {
    success: false,
    message: "",
  });

  const [passwordState, passwordAction] = useActionState(updatePassword, {
    success: false,
    message: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  return (
    <div className="space-y-10">
      {/* --- Email --- */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Email</h2>

        {canEditEmail ? (
          <form action={emailAction} className="space-y-4">
            <Alert success={emailState.success} message={emailState.message} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Địa chỉ email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={currentEmail}
                required
                className="input"
              />
            </div>
            <div className="flex justify-end">
              <SubmitButton
                label="Cập nhật email"
                pendingLabel="Đang cập nhật..."
              />
            </div>
          </form>
        ) : (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Địa chỉ email
            </label>
            <input
              type="email"
              value={currentEmail}
              disabled
              readOnly
              className="input bg-gray-50 text-gray-400"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Chỉ Admin mới có thể đổi email. Liên hệ Admin nếu bạn cần cập
              nhật.
            </p>
          </div>
        )}
      </section>

      <hr className="border-gray-200" />

      {/* --- Đổi mật khẩu --- */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Mật khẩu</h2>

        {!isChangingPassword ? (
          <div className="flex items-center justify-between">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Mật khẩu hiện tại
              </label>
              {/* Mật khẩu không bao giờ được hiển thị thật, luôn ẩn dưới dạng *** */}
              <input
                type="password"
                value="********"
                disabled
                readOnly
                className="input bg-gray-50 text-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsChangingPassword(true)}
              className="ml-4 mt-6 shrink-0 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Đổi mật khẩu
            </button>
          </div>
        ) : (
          <form action={passwordAction} className="space-y-4">
            <Alert
              success={passwordState.success}
              message={passwordState.message}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="new_password"
                required
                minLength={8}
                placeholder="Tối thiểu 8 ký tự"
                className="input"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirm_password"
                required
                minLength={8}
                className="input"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <SubmitButton
                label="Lưu mật khẩu mới"
                pendingLabel="Đang lưu..."
              />
            </div>
          </form>
        )}
      </section>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 1px #111827;
        }
      `}</style>
    </div>
  );
}
