select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relname in ('customers', 'appointments');