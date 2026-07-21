select id, name, day_of_week, shift_type, start_time, end_time
from sessions
order by day_of_week, shift_type;