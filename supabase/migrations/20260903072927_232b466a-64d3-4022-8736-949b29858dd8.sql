ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'en_attente',
  ADD COLUMN IF NOT EXISTS return_date date,
  ADD COLUMN IF NOT EXISTS departure_point text,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON public.bookings (user_id);

DROP TRIGGER IF EXISTS touch_bookings_updated_at ON public.bookings;
CREATE TRIGGER touch_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT INSERT ON public.bookings TO anon;
GRANT ALL ON public.bookings TO service_role;

DROP POLICY IF EXISTS bookings_public_insert ON public.bookings;
CREATE POLICY bookings_anon_insert ON public.bookings
  FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY bookings_user_insert ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY bookings_owner_read ON public.bookings
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY bookings_owner_delete ON public.bookings
  FOR DELETE TO authenticated USING (user_id = auth.uid() AND status IN ('en_attente', 'annulee'));

DROP POLICY IF EXISTS "own profile insert" ON public.profiles;
CREATE POLICY "own profile insert" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;