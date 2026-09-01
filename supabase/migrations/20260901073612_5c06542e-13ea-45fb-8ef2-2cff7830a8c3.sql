CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  province text,
  summary text,
  description text,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cities TO authenticated;
GRANT ALL ON public.cities TO service_role;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY cities_public_read ON public.cities FOR SELECT USING (true);
CREATE POLICY cities_admin_all ON public.cities FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE TRIGGER cities_touch_updated_at BEFORE UPDATE ON public.cities FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.cities (name, province, summary, description, highlights, sort_order) VALUES
('Bujumbura', 'Bujumbura Mairie', 'Capitale économique sur les rives du lac Tanganyika.', 'Posée sur les rives du lac Tanganyika, Bujumbura mêle plages de sable, marché central animé, musée vivant, vie nocturne et couchers de soleil sur les monts de la RDC.', '["Plages de Saga et Karera Beach","Musée vivant de Bujumbura","Marché central et artisanat","Coucher de soleil sur le lac"]'::jsonb, 1),
('Gitega', 'Gitega', 'Capitale politique et berceau du tambour sacré.', 'Au cœur du pays, Gitega abrite le Musée national et les sites royaux qui racontent l''histoire du royaume du Burundi, ainsi que les sanctuaires du tambour sacré.', '["Musée national de Gitega","Sanctuaire des tambours de Gishora","Sites royaux et collines historiques"]'::jsonb, 2),
('Ngozi', 'Ngozi', 'Ville du nord entourée de café et de thé.', 'Ngozi est entourée de plantations de café et de thé, point de départ idéal vers le parc national de la Kibira et les sources thermales de la région.', '["Plantations de café et de thé","Porte d''entrée du parc de la Kibira","Sources thermales"]'::jsonb, 3),
('Rumonge', 'Rumonge', 'Ville de pêcheurs, palmeraies et plages.', 'Au sud de Bujumbura, Rumonge vit de la pêche et du palmier à huile : plages tranquilles, sanctuaire naturel de Vyanda et source chaude de Mugara.', '["Plages du sud du lac","Réserve de Vyanda","Source chaude de Mugara"]'::jsonb, 4),
('Makamba, Rutana et Bururi', 'Sud du pays', 'Le grand sud touristique du Burundi.', 'Les provinces du sud concentrent les chutes de la Karera, la faille de Nyakazu (« la brèche des Allemands »), des réserves forestières et de superbes paysages de collines.', '["Chutes de la Karera","Faille de Nyakazu","Réserves forestières","Paysages de collines"]'::jsonb, 5);