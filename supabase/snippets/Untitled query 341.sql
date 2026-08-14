-- Thay thế trigger cũ (chỉ chặn giảm dưới slot_target cũ)
-- bằng logic đúng hơn: chỉ chặn giảm dưới số người ĐÃ ĐĂNG KÝ THẬT.
CREATE OR REPLACE FUNCTION public.prevent_slot_target_decrease()
RETURNS trigger AS $$
DECLARE
  v_current_count integer;
BEGIN
  IF NEW.slot_target < OLD.slot_target THEN
    SELECT count(*) INTO v_current_count
    FROM public.shift_registrations
    WHERE session_id = NEW.session_id AND date = NEW.date AND status != 'cancelled';

    IF NEW.slot_target < v_current_count THEN
      RAISE EXCEPTION 'Không thể giảm xuống dưới số người đã đăng ký hiện tại (đang có % người, muốn giảm còn %)', v_current_count, NEW.slot_target;
    END IF;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;