CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'compass',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_admin_all" ON public.services FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.services (title, description, icon, sort_order) VALUES
  ('Itinéraires sur mesure', 'Nous concevons votre programme de voyage jour par jour selon vos envies, votre budget et la saison.', 'route', 1),
  ('Transport terrestre', 'Véhicules confortables et chauffeurs expérimentés pour tous vos déplacements à travers le pays.', 'bus', 2),
  ('Visites guidées', 'Des guides locaux passionnés qui racontent l''histoire, la nature et les traditions du Burundi.', 'compass', 3),
  ('Premiers secours & santé', 'Kits de premiers soins, assistance et conseils sanitaires pendant toute la durée du séjour.', 'ambulance', 4),
  ('Attractions & loisirs', 'Accès aux parcs, réserves, plages, musées vivants et évènements culturels du pays.', 'mappin', 5),
  ('Billetterie de voyage', 'Réservation de billets, transferts aéroport et formalités simplifiées pour vos déplacements.', 'ticket', 6);