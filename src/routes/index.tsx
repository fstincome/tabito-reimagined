import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Ambulance,
  ArrowRight,
  BadgeCheck,
  BusFront,
  CalendarDays,
  Compass,
  Languages,
  MapPin,
  Quote,
  Route as RouteIcon,
  Star,
  Ticket,
} from "lucide-react";
import { useEffect, useState } from "react";

import kibira from "@/assets/hero-kibira.jpg";
import tambours from "@/assets/hero-tambours.jpg";
import tanganyika from "@/assets/hero-tanganyika.jpg";
import karera from "@/assets/karera.jpg";
import { ClientOnly } from "@/components/site/ClientOnly";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SitesMap } from "@/components/site/SitesMap";
import { Button } from "@/components/ui/button";
import {
  blogQuery,
  homeSectionsQuery,
  destinationsQuery,
  guidesQuery,
  packagesQuery,
  slidesQuery,
  testimonialsQuery,
} from "@/lib/content";
import { imageOr } from "@/lib/media";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TABITO — Voyages et découverte du Burundi" },
      {
        name: "description",
        content:
          "Tanganyika e-Bridge International Tours : circuits, sites touristiques, guides et bouquets de voyage pour découvrir le Burundi et le lac Tanganyika.",
      },
      { property: "og:title", content: "TABITO — Voyages et découverte du Burundi" },
      {
        property: "og:description",
        content:
          "Circuits, sites touristiques, guides et bouquets de voyage pour découvrir le Burundi.",
      },
    ],
  }),
  component: Home,
});

const FALLBACK_SLIDES = [
  {
    id: "f1",
    title: "Le Burundi, cœur vert de l'Afrique",
    subtitle:
      "Des collines infinies aux plages du lac Tanganyika : laissez TABITO composer votre voyage.",
    cta_label: "Découvrir nos destinations",
    cta_link: "/destinations",
    image_url: tanganyika,
  },
  {
    id: "f2",
    title: "Une culture qui bat au rythme des tambours",
    subtitle:
      "Rencontrez les tambourinaires du Burundi, les musées vivants et l'artisanat des collines.",
    cta_label: "Voir nos circuits",
    cta_link: "/circuits",
    image_url: tambours,
  },
  {
    id: "f3",
    title: "Kibira, sanctuaires et cascades",
    subtitle: "Forêts de montagne, chutes de la Karera, sources du Nil et faune protégée.",
    cta_label: "Nos bouquets de voyage",
    cta_link: "/bouquets",
    image_url: kibira,
  },
];

const SERVICES = [
  {
    Icon: RouteIcon,
    title: "Itinéraires sur mesure",
    text: "Nous concevons votre programme de voyage jour par jour selon vos envies, votre budget et la saison.",
  },
  {
    Icon: BusFront,
    title: "Transport terrestre",
    text: "Véhicules confortables et chauffeurs expérimentés pour tous vos déplacements à travers le pays.",
  },
  {
    Icon: Compass,
    title: "Visites guidées",
    text: "Des guides locaux passionnés qui racontent l'histoire, la nature et les traditions du Burundi.",
  },
  {
    Icon: Ambulance,
    title: "Premiers secours & santé",
    text: "Kits de premiers soins, assistance et conseils sanitaires pendant toute la durée du séjour.",
  },
  {
    Icon: MapPin,
    title: "Attractions & loisirs",
    text: "Accès aux parcs, réserves, plages, musées vivants et évènements culturels du pays.",
  },
  {
    Icon: Ticket,
    title: "Billetterie de voyage",
    text: "Réservation de billets, transferts aéroport et formalités simplifiées pour vos déplacements.",
  },
];

const FALLBACK_DESTINATIONS = [
  { id: "d1", name: "Parc national de la Kibira", categorie: "Nature", image_url: kibira },
  { id: "d2", name: "Lac Tanganyika", categorie: "Plages", image_url: tanganyika },
  { id: "d3", name: "Chutes de la Karera", categorie: "Cascades", image_url: karera },
  { id: "d4", name: "Musées vivants", categorie: "Culture", image_url: tambours },
];

function Hero() {
  const { data: slides } = useQuery(slidesQuery);
  const list = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), 6500);
    return () => clearInterval(id);
  }, [list.length]);

  const active = list[Math.min(index, list.length - 1)];

  return (
    <section className="relative isolate min-h-[76vh] overflow-hidden">
      {list.map((slide, i) => (
        <img
          key={slide.id}
          src={imageOr(slide.image_url, tanganyika)}
          alt={slide.title ?? ""}
          width={1920}
          height={1088}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.19_0.05_262/0.88)] via-[oklch(0.19_0.05_262/0.55)] to-transparent" />

      <div className="relative mx-auto flex min-h-[76vh] max-w-7xl flex-col justify-center px-6 py-24">
        <p className="eyebrow">Tanganyika e-Bridge International Tours</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          {active?.title}
        </h1>
        <p className="mt-5 max-w-xl text-base text-primary-foreground/85">{active?.subtitle}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild size="xl" variant="lagoon">
            <Link to={(active?.cta_link as string) || "/destinations"}>
              {active?.cta_label || "Découvrir"}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outlineLight">
            <Link to="/contacts">Nous contacter</Link>
          </Button>
        </div>

        <div className="mt-12 flex gap-2" role="tablist" aria-label="Diapositives">
          {list.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Diapositive ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-10 bg-accent" : "w-5 bg-primary-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { data: sections = {} } = useQuery(homeSectionsQuery);
  const { data: destinations } = useQuery(destinationsQuery);
  const { data: packages = [] } = useQuery(packagesQuery);
  const { data: guides = [] } = useQuery(guidesQuery);
  const { data: posts = [] } = useQuery(blogQuery);
  const { data: testimonials = [] } = useQuery(testimonialsQuery);

  const dests =
    destinations && destinations.length > 0 ? destinations.slice(0, 4) : FALLBACK_DESTINATIONS;
  const sec = (slug: string, fb: { eyebrow: string; title: string; description?: string }) => {
    const row = sections[`accueil-${slug}`];
    return {
      eyebrow: row?.subtitle || fb.eyebrow,
      title: row?.title || fb.title,
      description: row?.body || fb.description || "",
      image: row?.hero_image_url ?? null,
    };
  };

  const about = sec("apropos", {
    eyebrow: "À propos de nous",
    title: "TABITO, votre pont vers le Burundi",
  });

  const circuits = packages.filter((p) => p.type !== "bouquet").slice(0, 3);
  const bouquets = packages.filter((p) => p.type === "bouquet").slice(0, 3);

  return (
    <SiteLayout>
      <Hero />

      {/* À propos */}
      <section className="section-y bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="relative">
            <img
              src={imageOr(about.image, tanganyika)}
              alt="Rivage du lac Tanganyika au Burundi"
              width={1920}
              height={1088}
              loading="lazy"
              className="w-full rounded-2xl object-cover shadow-[var(--shadow-card)]"
            />
            <div className="absolute -bottom-6 -right-4 hidden w-48 rounded-2xl bg-card p-5 shadow-[var(--shadow-lift)] sm:block">
              <p className="font-display text-3xl font-bold text-accent">+18</p>
              <p className="text-xs text-muted-foreground">
                provinces et sites couverts par nos circuits
              </p>
            </div>
          </div>
          <div>
            <SectionHeading align="left" eyebrow={about.eyebrow} title={about.title} />
            <div className="mt-8 space-y-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground lg:text-base">
              {about.description}
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Guides locaux certifiés",
                "Circuits personnalisés",
                "Transport et logistique inclus",
                "Tourisme durable et communautaire",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="size-4 shrink-0 text-leaf" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8" variant="hero" size="lg">
              <Link to="/apropos">
                En savoir plus <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Carte des sites */}
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            {...sec("carte", { eyebrow: "Carte interactive", title: "Les sites touristiques du Burundi" })}
          />
          <div className="mt-14">
            <ClientOnly
              fallback={
                <div className="h-[460px] w-full animate-pulse rounded-2xl bg-muted" aria-hidden="true" />
              }
            >
              <SitesMap />
            </ClientOnly>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            {...sec("services", { eyebrow: "Nos services", title: "Tout ce qu'il faut pour bien voyager" })}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ Icon, title, text }) => (
              <article key={title} className="hover-lift surface-card p-7">
                <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            {...sec("destinations", { eyebrow: "Destinations", title: "Des lieux qui marquent à vie" })}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dests.map((d) => (
              <Link
                key={d.id}
                to="/destinations"
                className="hover-lift group relative block overflow-hidden rounded-2xl"
              >
                <img
                  src={imageOr(d.image_url, karera)}
                  alt={d.name}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.19_0.05_262/0.85)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                  {d.categorie && (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-accent-foreground">
                      {d.categorie}
                    </span>
                  )}
                  <h3 className="mt-3 font-display text-lg font-semibold">{d.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/destinations">
                Toutes les destinations <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Circuits & bouquets */}
      {(circuits.length > 0 || bouquets.length > 0) && (
        <section className="section-y bg-background">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              {...sec("formules", {
                eyebrow: "Circuits & bouquets",
                title: "Nos formules de voyage",
              })}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...circuits, ...bouquets].map((p) => (
                <article key={p.id} className="hover-lift surface-card overflow-hidden">
                  <img
                    src={imageOr(p.image_url, kibira)}
                    alt={p.title}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="h-52 w-full object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {p.duration && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3.5" aria-hidden="true" />
                          {p.duration}
                        </span>
                      )}
                      {p.type && <span className="capitalize">{p.type}</span>}
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-primary">
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                    {p.price && <p className="mt-4 font-display text-lg text-accent">{p.price}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guides */}
      {guides.length > 0 && (
        <section className="section-y bg-sand">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              {...sec("guides", {
                eyebrow: "Nos guides",
                title: "Des passionnés à vos côtés",
              })}
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {guides.slice(0, 4).map((g) => (
                <article key={g.id} className="hover-lift surface-card overflow-hidden text-center">
                  <img
                    src={imageOr(g.photo_url, tambours)}
                    alt={g.name}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="h-60 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-primary">{g.name}</h3>
                    {g.speciality && (
                      <p className="mt-1 text-xs text-muted-foreground">{g.speciality}</p>
                    )}
                    {g.languages && (
                      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-accent">
                        <Languages className="size-3.5" aria-hidden="true" />
                        {g.languages}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <section className="section-y bg-background">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              {...sec("blog", { eyebrow: "Actualités", title: "Les dernières nouvelles" })}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <article key={post.id} className="hover-lift surface-card overflow-hidden">
                  <img
                    src={imageOr(post.image_url, kibira)}
                    alt={post.title}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    {post.published_at && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.published_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    <h3 className="mt-2 font-display text-lg font-semibold text-primary">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      to="/blog"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent"
                    >
                      Lire la suite <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Témoignages */}
      {testimonials.length > 0 && (
        <section className="section-y relative isolate overflow-hidden">
          <img
            src={imageOr(sec("temoignages", { eyebrow: "", title: "" }).image, tambours)}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1088}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 gradient-lagoon opacity-90" />
          <div className="relative mx-auto max-w-7xl px-6">
            <SectionHeading
              light
              {...sec("temoignages", {
                eyebrow: "Témoignages",
                title: "Ils ont voyagé avec TABITO",
              })}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <figure key={t.id} className="surface-card p-7">
                  <Quote className="size-7 text-accent" aria-hidden="true" />
                  <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {t.message}
                  </blockquote>
                  <div className="mt-5 flex items-center gap-1">
                    {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-sun text-sun" aria-hidden="true" />
                    ))}
                  </div>
                  <figcaption className="mt-4">
                    <p className="font-display font-semibold text-primary">{t.author}</p>
                    {t.role_title && (
                      <p className="text-xs text-muted-foreground">{t.role_title}</p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
