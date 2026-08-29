CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'advaxen@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_site text NOT NULL,
  description text,
  categorie text,
  province text,
  commune text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  image_url text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  cta_label text,
  cta_link text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  categorie text,
  summary text,
  description text,
  image_url text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'bouquet',
  duration text,
  price text,
  description text,
  image_url text,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  excerpt text,
  content text,
  image_url text,
  author text,
  published_at date DEFAULT CURRENT_DATE,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  start_date date,
  end_date date,
  place text,
  status text NOT NULL DEFAULT 'programme',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'emploi',
  title text NOT NULL,
  description text,
  organisation text,
  deadline date,
  link text,
  file_url text,
  image_url text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  categorie text,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website text,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text,
  photo_url text,
  bio text,
  facebook text,
  twitter text,
  linkedin text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  role_title text,
  photo_url text,
  message text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_url text,
  languages text,
  speciality text,
  phone text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  body text,
  hero_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['sites','slides','destinations','packages','blog_posts','events','opportunities','gallery_images','partners','team_members','testimonials','guides','pages']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (true)', t || '_public_read', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t || '_admin_all', t);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', 'touch_' || t, t);
  END LOOP;
END $$;

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admins manage messages" ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "admins manage subscribers" ON public.newsletter_subscribers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "media read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

INSERT INTO public.pages (slug, title, subtitle, body) VALUES
('apropos', 'TABITO, Quid ?', 'Tanganyika e-Bridge International Tours', 'TABITO est une société anonyme de droit burundais et offre des services de tour opérateur récepteur. Il est créé en septembre 2023 par une équipe de talents multidisciplinaires et dévouée au tourisme durable dans une période d''ouverture d''une nouvelle page de l''histoire de l''industrie du tourisme.

La société TABITO s''intéresse aussi bien au tourisme de divertissement que le tourisme de conférence et de l''évènementiel en régénérant les nouvelles valeurs de la période post pandémie Covid-19.

TABITO est un partenaire privilégié pour rejoindre rapidement la grande et merveilleuse destination d''Afrique centrale et orientale logée dans le bassin du Lac Tanganyika, une véritable plateforme des cieux nouveaux.

TABITO est connecté aux sous-destinations nationales comprenant les destinations des montagnes et les destinations maritimes et balnéaires.

TABITO est né d''une expérience hautement humaine, d''une ambition hautement technologique et d''un cœur hautement hospitalier.

TABITO est unique : il engage sa clientèle à rester branchée globalement par un pont digital enraciné dans une atmosphère de fraîcheur ressourcée par les brises qui surfent sur les eaux du Tanganyika.'),
('mission', 'Notre mission', 'Ce qui nous fait avancer', 'Offrir des expériences de voyage inoubliables en mettant en avant la richesse culturelle et naturelle du Burundi. Nous nous engageons à fournir des services de qualité, adaptés aux besoins de nos clients, tout en promouvant un tourisme durable et responsable. Notre objectif est de créer des souvenirs mémorables et de contribuer au développement économique local.'),
('vision', 'Notre vision', 'Là où nous allons', 'Devenir le leader du tourisme au Burundi, reconnu pour notre innovation, notre expertise et notre engagement envers l''excellence. Nous aspirons à être la première référence pour les voyageurs, en favorisant des interactions authentiques entre les visiteurs et les communautés locales. Avec un modèle de tourisme inclusif, nous souhaitons valoriser le patrimoine burundais tout en préservant l''environnement et en soutenant le développement durable.'),
('valeurs', 'Nos valeurs', 'Tanganyika e-Bridge International Tours', 'Hospitalité authentique : chaque voyageur est accueilli comme un membre de la famille.

Durabilité : nous protégeons les écosystèmes et les patrimoines que nous faisons découvrir.

Excellence : la qualité de service et la sécurité guident chacune de nos prestations.

Inclusion : nous travaillons avec les communautés locales et valorisons leurs talents.

Innovation : un pont digital entre le Burundi et le monde.'),
('principes', 'Nos principes', 'Notre manière de travailler', 'Transparence dans les prix et les prestations.

Respect des cultures, des personnes et de l''environnement.

Ponctualité et fiabilité sur chaque itinéraire.

Confidentialité et protection des données de nos clients.

Partenariat gagnant-gagnant avec les prestataires locaux (PPP : Partenariat Public Privé).'),
('smedlab', 'SMED LAB', 'Laboratoire des solutions et métiers du tourisme durable', 'SMED LAB est le laboratoire d''innovation de TABITO dédié à l''accompagnement des micro, petites et moyennes entreprises du secteur touristique : incubation, formation, structuration des offres, digitalisation et accès aux financements.');

INSERT INTO public.sites (nom_site, description, categorie, province, latitude, longitude) VALUES
('Parc National de la Kibira', 'Forêt de montagne primaire, chimpanzés et sources d''eau.', 'Parc national', 'Kayanza', -2.9167, 29.5167),
('Chutes de la Karera', 'Quatre chutes spectaculaires au cœur du Burundi.', 'Site naturel', 'Rutana', -3.9667, 30.2333),
('Lac Tanganyika - Plage de Saga', 'Plage de sable au bord du deuxième lac le plus profond du monde.', 'Plage', 'Bujumbura', -3.4300, 29.3300),
('Source du Nil (Rutovu)', 'Pyramide marquant la source la plus méridionale du Nil.', 'Site historique', 'Bururi', -3.9000, 29.7167),
('Parc National de la Rusizi', 'Delta de la Rusizi, hippopotames et crocodiles.', 'Parc national', 'Bujumbura', -3.3667, 29.2833),
('Musée Vivant de Bujumbura', 'Musée à ciel ouvert présentant la culture burundaise.', 'Musée', 'Bujumbura', -3.3833, 29.3667),
('Sanctuaire des Tambours de Gishora', 'Site sacré des tambours royaux, patrimoine UNESCO.', 'Culture', 'Gitega', -3.4000, 29.9500),
('Réserve Naturelle de Bururi', 'Forêt de montagne et biodiversité rare.', 'Réserve', 'Bururi', -3.9500, 29.6167);

INSERT INTO public.slides (title, subtitle, cta_label, cta_link, sort_order) VALUES
('Explorez la beauté naturelle du Burundi', 'Des paysages à couper le souffle, des lacs paisibles et des collines verdoyantes vous attendent. Le Burundi vous invite à une immersion totale dans la nature.', 'En savoir plus', '/destinations', 1),
('Découvrez la culture burundaise authentique', 'Danse, tambours royaux, artisanat traditionnel… Vivez une expérience unique au cœur de la richesse culturelle du pays des tambours sacrés.', 'Nos circuits', '/circuits', 2),
('Votre aventure commence à Bujumbura', 'Profitez des plages du lac Tanganyika, explorez les merveilles urbaines et savourez la gastronomie locale.', 'Réserver', '/contacts', 3);

INSERT INTO public.testimonials (author, role_title, message, sort_order) VALUES
('Aline N.', 'Voyageuse, Rwanda', 'Un accueil chaleureux et une organisation impeccable. Le lac Tanganyika au coucher du soleil, inoubliable !', 1),
('Jean-Marc D.', 'Consultant, Belgique', 'TABITO a organisé mon séjour de conférence à Bujumbura de A à Z. Professionnalisme total.', 2),
('Grace K.', 'Blogueuse voyage, Kenya', 'Les tambours de Gishora et la Kibira : deux expériences que je recommande à tout le monde.', 3);