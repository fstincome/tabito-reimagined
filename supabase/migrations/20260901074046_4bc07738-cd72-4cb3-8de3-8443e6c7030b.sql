CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  category text NOT NULL,
  item_label text,
  item_id uuid,
  travel_date date,
  people integer,
  message text,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookings_public_insert ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY bookings_admin_all ON public.bookings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());