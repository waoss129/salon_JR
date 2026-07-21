-- Chạy: supabase migration new schedule_proposal_items_employee_rls rồi paste vào, hoặc SQL Editor

-- ============================================================
-- Bổ sung 2 policy còn thiếu trên bảng schedule_proposal_items:
-- INSERT và DELETE cho nhân viên đối với item thuộc batch của CHÍNH mình.
--
-- Trước đó chỉ có: admin_all_items (ALL, admin), employee_select_own_items
-- (SELECT), employee_update_own_items (UPDATE) — thiếu INSERT khiến
-- submitMyProposalSelection() (nhân viên tự gửi lựa chọn ca) bị chặn ở
-- bước ghi lại item mới sau khi xoá item cũ; và có thể cũng thiếu DELETE
-- (không báo lỗi nhưng âm thầm xoá 0 dòng, để lại item cũ không bị xoá).
--
-- schedule_proposal_items không có cột employee_id trực tiếp — phải xác
-- định "của chính mình" qua batch_id -> schedule_proposal_batches.employee_id.
-- ============================================================

create policy "employee_insert_own_items"
on public.schedule_proposal_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.schedule_proposal_batches b
    where b.id = schedule_proposal_items.batch_id
      and b.employee_id = auth.uid()
  )
);

create policy "employee_delete_own_items"
on public.schedule_proposal_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.schedule_proposal_batches b
    where b.id = schedule_proposal_items.batch_id
      and b.employee_id = auth.uid()
  )
);