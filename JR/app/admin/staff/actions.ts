"use server";

import crypto from "crypto";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireManage } from "@/lib/supabase/admin-guard";
import { revalidatePath } from "next/cache";

const ACTIVATION_TOKEN_TTL_HOURS = 72;

function generatePlaceholderEmail() {
  // Email này KHÔNG có thật, chỉ để thoả UNIQUE constraint trên auth.users
  // và profiles.email cho tới khi nhân viên tự đặt email thật lúc kích hoạt.
  return `pending-${crypto.randomUUID()}@internal.invalid`;
}

function generateRandomPassword() {
  return crypto.randomBytes(24).toString("base64");
}

function generateActivationToken() {
  return crypto.randomBytes(32).toString("hex");
}

export type AddStaffResult = {
  employeeId: string;
  activationUrl: string;
};

/**
 * Thêm nhân viên mới KHÔNG cần email/SĐT ngay lúc tạo.
 * Xem giải thích đầy đủ về luồng kích hoạt trong app/activate/actions.ts
 */
export async function addStaff(
  formData: FormData,
  roleId: number,
): Promise<AddStaffResult> {
  await requireManage("staff");

  const fullname = (formData.get("fullname") as string | null)?.trim();
  const gender = formData.get("gender") as string | null;
  const phone = (formData.get("phone") as string | null)?.trim() || null;

  if (!fullname) {
    throw new Error("Vui lòng nhập họ tên");
  }
  if (!roleId) {
    throw new Error("Thiếu vai trò nhân viên");
  }

  const adminClient = createAdminClient();
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email: generatePlaceholderEmail(),
      password: generateRandomPassword(),
      email_confirm: true,
    });

  if (authError || !authData.user) {
    throw new Error(authError?.message ?? "Không thể tạo tài khoản");
  }

  const employeeId = authData.user.id;

  try {
    // Dùng upsert thay vì insert: nếu project có sẵn trigger tự tạo profiles
    // khi auth.users được insert (pattern on_auth_user_created phổ biến),
    // dòng profiles đã tồn tại ngay sau bước tạo auth.users ở trên rồi —
    // upsert sẽ ghi đè đúng thông tin admin vừa nhập thay vì báo lỗi trùng
    // khoá chính (profiles_pkey).
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: employeeId,
        fullname,
        gender: gender || "prefer_not_to_say",
        phone,
        email: null,
        email_locked: false,
      },
      { onConflict: "id" },
    );
    if (profileError) throw new Error(profileError.message);

    const { error: employeeError } = await supabase.from("employees").insert({
      id: employeeId,
      role_id: roleId,
      status: "active",
    });
    if (employeeError) throw new Error(employeeError.message);

    const token = generateActivationToken();
    const expiresAt = new Date(
      Date.now() + ACTIVATION_TOKEN_TTL_HOURS * 60 * 60 * 1000,
    );

    const { error: tokenError } = await adminClient
      .from("employee_activation_tokens")
      .insert({
        employee_id: employeeId,
        token,
        expires_at: expiresAt.toISOString(),
      });
    if (tokenError) throw new Error(tokenError.message);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    return {
      employeeId,
      activationUrl: `${siteUrl}/activate?token=${token}`,
    };
  } catch (err) {
    await adminClient
      .from("employee_activation_tokens")
      .delete()
      .eq("employee_id", employeeId);
    await supabase.from("employees").delete().eq("id", employeeId);
    await supabase.from("profiles").delete().eq("id", employeeId);

    const { error: deleteAuthError } =
      await adminClient.auth.admin.deleteUser(employeeId);
    if (deleteAuthError) {
      // Dùng JSON.stringify thay vì chỉ .message — 1 số lỗi AuthError trả
      // về không có .message (hiện "Lỗi: {}"), cần xem toàn bộ object mới
      // biết status code / chi tiết thật từ GoTrue Admin API.
      console.error(
        `[addStaff] Rollback thất bại: không thể xoá auth.users id=${employeeId}. ` +
          `Cần xoá thủ công qua Supabase Dashboard. Lỗi: ${JSON.stringify(deleteAuthError, Object.getOwnPropertyNames(deleteAuthError))}`,
      );
    }

    throw err;
  }
}

const VALID_STAFF_STATUSES = ["active", "on_leave", "inactive", "terminated"];

export async function updateStaffStatus(
  employeeId: string,
  status: string,
): Promise<void> {
  await requireManage("staff");

  if (!VALID_STAFF_STATUSES.includes(status)) {
    throw new Error("Trạng thái không hợp lệ");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("employees")
    .update({ status })
    .eq("id", employeeId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/staff");
}

export async function deleteStaff(employeeId: string): Promise<void> {
  await requireManage("staff");

  const adminClient = createAdminClient();
  const supabase = await createClient();

  const { error: employeeError } = await supabase
    .from("employees")
    .delete()
    .eq("id", employeeId);
  if (employeeError) {
    if (employeeError.code === "23503") {
      throw new Error(
        "Không thể xoá vì nhân viên này đã có dữ liệu liên quan (lịch làm việc, chuyên môn...). " +
          'Hãy đổi trạng thái sang "Đã nghỉ việc" thay vì xoá.',
      );
    }
    throw new Error(employeeError.message);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", employeeId);
  if (profileError) throw new Error(profileError.message);

  const { error: authError } =
    await adminClient.auth.admin.deleteUser(employeeId);
  if (authError) throw new Error(authError.message);

  revalidatePath("/admin/staff");
}

/**
 * Cập nhật hồ sơ nhân viên (thông tin cá nhân + thông tin công việc + avatar).
 *
 * QUAN TRỌNG: email KHÔNG BAO GIỜ được đưa vào payload update ở đây, dù
 * formData có gửi lên field "email" hay không (StaffDetailForm gửi hidden
 * input chứa email cũ). Đây là quyết định đã chốt: email bị khoá tuyệt đối
 * trong app, không ai (kể cả Admin) sửa được qua giao diện — trigger DB
 * lock_email_after_activation cũng chặn ở tầng thấp hơn nếu có sơ suất.
 * Muốn sửa email chỉ có thể làm thủ công qua Supabase Dashboard (xem tài
 * liệu vận hành nội bộ).
 */
export async function updateStaff(
  employeeId: string,
  formData: FormData,
): Promise<void> {
  await requireManage("staff");

  const supabase = await createClient();

  const fullname = (formData.get("fullname") as string | null)?.trim();
  if (!fullname) {
    throw new Error("Vui lòng nhập họ tên");
  }

  // Upload avatar nếu có file mới được chọn
  const avatarFile = formData.get("avatar") as File | null;
  let avatarUrl: string | undefined;

  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop() ?? "jpg";
    const path = `${employeeId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true });
    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);
    avatarUrl = publicUrlData.publicUrl;
  }

  const profileUpdates: Record<string, unknown> = {
    fullname,
    gender: (formData.get("gender") as string | null) || "prefer_not_to_say",
    dob: (formData.get("dob") as string | null) || null,
    phone: (formData.get("phone") as string | null)?.trim() || null,
    address: (formData.get("address") as string | null)?.trim() || null,
  };
  if (avatarUrl) profileUpdates.avatar = avatarUrl;
  // Cố ý KHÔNG đọc formData.get("email") ở đây — xem ghi chú ở JSDoc phía trên.

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdates)
    .eq("id", employeeId);
  if (profileError) throw new Error(profileError.message);

  const employeeUpdates = {
    joined_at: (formData.get("joined_at") as string | null) || null,
    certificate_name:
      (formData.get("certificate_name") as string | null)?.trim() || null,
    level: (formData.get("level") as string | null)?.trim() || null,
  };

  const { error: employeeError } = await supabase
    .from("employees")
    .update(employeeUpdates)
    .eq("id", employeeId);
  if (employeeError) throw new Error(employeeError.message);

  revalidatePath("/admin/staff");
  revalidatePath(`/admin/staff/details/${employeeId}`);
}
