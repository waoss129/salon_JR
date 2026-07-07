-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.appointments (
  schedule_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  appointment_date timestamp without time zone NOT NULL,
  status text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text, 'no_show'::text])),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT appointments_pkey PRIMARY KEY (id),
  CONSTRAINT appointments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT appointments_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedules(id)
);
CREATE TABLE public.bill_services (
  bill_id uuid NOT NULL,
  service_id bigint NOT NULL,
  quantity smallint NOT NULL CHECK (quantity > 0),
  price_at_time integer NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  subtotal integer NOT NULL DEFAULT (quantity * price_at_time),
  CONSTRAINT bill_services_pkey PRIMARY KEY (id),
  CONSTRAINT bill_services_bill_id_fkey FOREIGN KEY (bill_id) REFERENCES public.bills(id),
  CONSTRAINT bill_services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);
CREATE TABLE public.bills (
  appointment_id uuid NOT NULL,
  promotion_id uuid,
  total_price integer NOT NULL,
  discount_amount bigint NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  status text DEFAULT 'unpaid'::text CHECK (status = ANY (ARRAY['unpaid'::text, 'paid'::text, 'refunded'::text])),
  CONSTRAINT bills_pkey PRIMARY KEY (id),
  CONSTRAINT bills_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id),
  CONSTRAINT bills_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id)
);
CREATE TABLE public.categories (
  name character varying NOT NULL UNIQUE,
  image_url text,
  description text,
  status text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.customers (
  status text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'banned'::text])),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id),
  CONSTRAINT customers_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id)
);
CREATE TABLE public.details (
  appointment_id uuid NOT NULL,
  service_id bigint NOT NULL,
  price integer NOT NULL,
  description text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT details_pkey PRIMARY KEY (id),
  CONSTRAINT details_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id),
  CONSTRAINT details_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id)
);
CREATE TABLE public.employee_categories (
  category_id bigint NOT NULL,
  employee_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT employee_categories_pkey PRIMARY KEY (id),
  CONSTRAINT employee_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT employee_categories_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.employees (
  role_id bigint NOT NULL,
  status text CHECK (status = ANY (ARRAY['active'::text, 'on_leave'::text, 'inactive'::text, 'terminated'::text])),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  certificate_name text,
  level text,
  joined_at date,
  CONSTRAINT employees_pkey PRIMARY KEY (id),
  CONSTRAINT employees_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT fk_employees_profiles FOREIGN KEY (id) REFERENCES public.profiles(id),
  CONSTRAINT employees_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);
CREATE TABLE public.profiles (
  avatar text,
  gender text CHECK (gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text, 'prefer_not_to_say'::text])),
  dob date,
  phone character varying,
  address text,
  email text UNIQUE,
  fullname text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.promotion_services (
  promotion_id uuid NOT NULL,
  service_id bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT promotion_services_pkey PRIMARY KEY (promotion_id, service_id),
  CONSTRAINT promotion_services_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id),
  CONSTRAINT promotion_services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);
CREATE TABLE public.promotions (
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL,
  discount_value numeric NOT NULL,
  min_order_value bigint,
  is_first_time boolean,
  day_of_week smallint,
  start_date timestamp without time zone,
  end_date timestamp without time zone NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT promotions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.roles (
  role_name character varying NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.schedules (
  session_id bigint NOT NULL,
  employee_id uuid NOT NULL,
  date date NOT NULL,
  status text CHECK (status = ANY (ARRAY['scheduled'::text, 'confirmed'::text, 'checked_in'::text, 'completed'::text, 'absent'::text, 'cancelled'::text])),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT schedules_pkey PRIMARY KEY (id),
  CONSTRAINT schedules_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id),
  CONSTRAINT schedules_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id)
);
CREATE TABLE public.services (
  name character varying NOT NULL,
  category_id bigint NOT NULL,
  description text,
  price integer NOT NULL,
  duration smallint,
  status text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT services_pkey PRIMARY KEY (id),
  CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.sessions (
  name character varying NOT NULL UNIQUE,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT sessions_pkey PRIMARY KEY (id)
);