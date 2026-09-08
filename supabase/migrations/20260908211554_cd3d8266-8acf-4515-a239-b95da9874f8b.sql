INSERT INTO public.destinations (name, name_en, categorie, categorie_en, summary, summary_en, description, description_en, sort_order, published)
SELECT 'Destination du Grand Bujumbura', 'Bujumbura Great City Destination', 'Destination', 'Destination',
 'La capitale économique et sa région : plages, littoral, patrimoine urbain et vie nocturne.',
 'The economic capital and its region: beaches, lakeshore, urban heritage and nightlife.',
 'La Destination du Grand Bujumbura rassemble la ville de Bujumbura et ses environs immédiats : les plages du lac Tanganyika, les marchés, les quartiers historiques, les sites naturels de proximité et un agenda régulier d''évènements touristiques et culturels. C''est dans cette destination que TABITO commercialise le circuit « Le Tour de la Ville BUJA ».',
 'The Bujumbura Great City Destination brings together the city of Bujumbura and its immediate surroundings: Lake Tanganyika beaches, markets, historic districts, nearby natural sites and a regular calendar of tourism and cultural events. This is where TABITO sells the "BUJA City Tour".',
 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.destinations WHERE name = 'Destination du Grand Bujumbura');

INSERT INTO public.destinations (name, name_en, categorie, categorie_en, summary, summary_en, description, description_en, sort_order, published)
SELECT 'Destination littorale du lac Tanganyika', 'Lake Tanganyika Coastal Destination', 'Destination', 'Destination',
 'De Bujumbura à Rumonge et Nyanza-Lac : plages, pêche traditionnelle et villages du littoral.',
 'From Bujumbura to Rumonge and Nyanza-Lac: beaches, traditional fishing and lakeshore villages.',
 'La destination littorale suit la rive du lac Tanganyika, de Bujumbura à Rumonge puis Nyanza-Lac : plages de sable, pêche du mukeke, marchés de poisson, sources chaudes et villages de pêcheurs. C''est le cadre du circuit « La Route des Femmes Vendeuses du Mukeke et Akarobe ».',
 'The coastal destination follows the shore of Lake Tanganyika from Bujumbura to Rumonge and Nyanza-Lac: sandy beaches, mukeke fishing, fish markets, hot springs and fishing villages. It is the setting of "The Road of the Mukeke and Akarobe Women Sellers".',
 2, true
WHERE NOT EXISTS (SELECT 1 FROM public.destinations WHERE name = 'Destination littorale du lac Tanganyika');

INSERT INTO public.packages (title, title_en, type, description, description_en, duration, duration_en, highlights, highlights_en, sort_order, published)
SELECT 'Le Tour de la Ville BUJA', 'BUJA City Tour', 'circuit',
 'Circuit phare dans la Destination du Grand Bujumbura : découverte guidée de la ville, de son patrimoine, de ses marchés et de ses plages.',
 'Flagship tour in the Bujumbura Great City Destination: guided discovery of the city, its heritage, markets and beaches.',
 '1 journée', '1 day',
 '["Centre-ville et patrimoine colonial", "Marché central et artisanat", "Plages du lac Tanganyika", "Guide local TABITO"]'::jsonb,
 '["Downtown and colonial heritage", "Central market and crafts", "Lake Tanganyika beaches", "Local TABITO guide"]'::jsonb,
 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.packages WHERE title = 'Le Tour de la Ville BUJA');

INSERT INTO public.packages (title, title_en, type, description, description_en, duration, duration_en, highlights, highlights_en, sort_order, published)
SELECT 'La Route des Femmes Vendeuses du Mukeke et Akarobe', 'The Road of the Mukeke and Akarobe Women Sellers', 'circuit',
 'Circuit phare dans la destination littorale du lac Tanganyika, de Bujumbura à Rumonge vers Nyanza-Lac, à la rencontre des femmes vendeuses de poisson.',
 'Flagship tour in the Lake Tanganyika coastal destination, from Bujumbura to Rumonge and Nyanza-Lac, meeting the women fish sellers.',
 '2 jours', '2 days',
 '["Bujumbura – Rumonge – Nyanza-Lac", "Pêche du mukeke et de l''akarobe", "Marchés et villages de pêcheurs", "Plages et sources chaudes"]'::jsonb,
 '["Bujumbura – Rumonge – Nyanza-Lac", "Mukeke and akarobe fishing", "Markets and fishing villages", "Beaches and hot springs"]'::jsonb,
 2, true
WHERE NOT EXISTS (SELECT 1 FROM public.packages WHERE title = 'La Route des Femmes Vendeuses du Mukeke et Akarobe');

INSERT INTO public.pages (slug, title, title_en, subtitle, subtitle_en, body, body_en)
SELECT 'grand-bujumbura', 'Destination du Grand Bujumbura', 'Bujumbura Great City Destination',
 'Bujumbura et sa région : plages, littoral, patrimoine urbain et évènements.',
 'Bujumbura and its region: beaches, lakeshore, urban heritage and events.',
 'Depuis 2019, TABITO promeut la Destination du Grand Bujumbura : la ville de Bujumbura, ses plages sur le lac Tanganyika, son patrimoine urbain, ses marchés et un agenda régulier d''évènements touristiques et culturels. Le circuit « Le Tour de la Ville BUJA » est le produit phare de cette destination.',
 'Since 2019, TABITO has promoted the Bujumbura Great City Destination: the city of Bujumbura, its Lake Tanganyika beaches, urban heritage, markets and a regular calendar of tourism and cultural events. The "BUJA City Tour" is the flagship product of this destination.'
WHERE NOT EXISTS (SELECT 1 FROM public.pages WHERE slug = 'grand-bujumbura');