CREATE TABLE public.admin_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text,
  notes text,
  status text NOT NULL DEFAULT 'en_cours',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  start_lat double precision,
  start_lng double precision,
  start_label text,
  end_lat double precision,
  end_lng double precision,
  end_label text,
  distance_m double precision NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_tracks TO authenticated;
GRANT ALL ON public.admin_tracks TO service_role;
ALTER TABLE public.admin_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view tracks" ON public.admin_tracks
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create own tracks" ON public.admin_tracks
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') AND user_id = auth.uid());
CREATE POLICY "Admins can update tracks" ON public.admin_tracks
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tracks" ON public.admin_tracks
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER touch_admin_tracks BEFORE UPDATE ON public.admin_tracks
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.admin_track_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES public.admin_tracks(id) ON DELETE CASCADE,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  accuracy double precision,
  speed double precision,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX admin_track_points_track_idx ON public.admin_track_points (track_id, recorded_at);
CREATE INDEX admin_tracks_user_idx ON public.admin_tracks (user_id, started_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_track_points TO authenticated;
GRANT ALL ON public.admin_track_points TO service_role;
ALTER TABLE public.admin_track_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view track points" ON public.admin_track_points
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert track points" ON public.admin_track_points
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete track points" ON public.admin_track_points
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));