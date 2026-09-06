CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audience text NOT NULL DEFAULT 'admin',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
CREATE INDEX notifications_audience_idx ON public.notifications (audience, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT INSERT ON public.notifications TO anon;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_admin_all ON public.notifications
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY notifications_anon_insert ON public.notifications
  FOR INSERT TO anon WITH CHECK (audience = 'admin' AND user_id IS NULL);

CREATE POLICY notifications_user_insert ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK ((audience = 'admin' AND user_id IS NULL) OR (audience = 'user' AND user_id = auth.uid()));

CREATE POLICY notifications_user_read ON public.notifications
  FOR SELECT TO authenticated USING (audience = 'user' AND user_id = auth.uid());

CREATE POLICY notifications_user_update ON public.notifications
  FOR UPDATE TO authenticated USING (audience = 'user' AND user_id = auth.uid())
  WITH CHECK (audience = 'user' AND user_id = auth.uid());

CREATE TRIGGER notifications_touch BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();