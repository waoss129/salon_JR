DELETE FROM shift_registrations
WHERE week_id = (SELECT id FROM schedule_weeks WHERE status = 'confirmed' ORDER BY week_start DESC LIMIT 1)
  AND status = 'admin_assigned'
  AND assigned_by IS NOT NULL
  AND date NOT IN (SELECT date FROM schedules WHERE date = shift_registrations.date AND employee_id = shift_registrations.employee_id);