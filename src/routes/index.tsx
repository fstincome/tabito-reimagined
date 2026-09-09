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
  servicesQuery,
  slidesQuery,
  testimonialsQuery,
} from "@/lib/content";
import { PLACEHOLDER_IMAGE, imageOr } from "@/lib/media";
import { useI18n } from "@/lib/i18n";

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

const SERVICE_ICONS: Record<string, typeof Compass> = {
  route: RouteIcon,
  bus: BusFront,
  compass: Compass,
  ambulance: Ambulance,
  mappin: MapPin,
  ticket: Ticket,
};

type LocalizedSlide = {
  id: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_link: string;
  image_url: string;
};

function Hero() {
  const { L, tx } = useI18n();
  const { data: slides, isPending } = useQuery(slidesQuery);

  const fallbackSlides: LocalizedSlide[] = [
    {
      id: "f1",
      title: L(
        "Le Burundi, cœur vert de l'Afrique",
        "Burundi, the green heart of Africa",
      ),
      subtitle: L(
        "Des collines infinies aux plages du lac Tanganyika : laissez TABITO composer votre voyage.",
        "From endless hills to the shores of Lake Tanganyika: let TABITO craft your journey.",
      ),
      cta_label: L("Découvrir nos destinations", "Discover our destinations"),
      cta_link: "/destinations",
      image_url: PLACEHOLDER_IMAGE,
    },
    {
      id: "f2",
      title: L(
        "Une culture qui bat au rythme des PLACEHOLDER_IMAGE",
        "A culture that beats to the rhythm of drums",
      ),
      subtitle: L(
        "Rencontrez les tambourinaires du Burundi, les musées vivants et l'artisanat des collines.",
        "Meet Burundi's drummers, living museums and hillside craftsmanship.",
      ),
      cta_label: L("Voir nos circuits", "See our tours"),
      cta_link: "/circuits",
      image_url: PLACEHOLDER_IMAGE,
    },
    {
      id: "f3",
      title: L("Kibira, sanctuaires et cascades", "Kibira, sanctuaries and waterfalls"),
      subtitle: L(
        "Forêts de montagne, chutes de la Karera, sources du Nil et faune protégée.",
        "Mountain forests, Karera falls, source of the Nile and protected wildlife.",
      ),
      cta_label: L("Nos bouquets de voyage", "Our travel packages"),
      cta_link: "/bouquets",
      image_url: PLACEHOLDER_IMAGE,
    },
  ];

  // Pendant le chargement seulement, on montre les diapos de secours.
  // Ensuite, ce sont exclusivement les diapos publiées du tableau de bord :
  // en cacher ou en supprimer réduit réellement le carrousel.
  const list: LocalizedSlide[] = isPending
    ? fallbackSlides
    : (slides ?? []).map((slide) => ({
        id: slide.id,
        title: tx(slide, "title"),
        subtitle: tx(slide, "subtitle"),
        cta_label: tx(slide, "cta_label"),
        cta_link: slide.cta_link ?? "/destinations",
        image_url: imageOr(slide.image_url, PLACEHOLDER_IMAGE),
      }));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [list.length]);

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), 6500);
    return () => clearInterval(id);
  }, [list.length]);

  const active = list.length > 0 ? list[Math.min(index, list.length - 1)] : undefined;

  return (
    <section className="relative isolate min-h-[76vh] overflow-hidden">
      {list.length > 0 ? (
        list.map((slide, i) => (
          <img
            key={slide.id}
            src={slide.image_url || PLACEHOLDER_IMAGE}
            alt={slide.title ?? ""}
            width={1920}
            height={1088}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))
      ) : (
        <img
          src={PLACEHOLDER_IMAGE}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.19_0.05_262/0.88)] via-[oklch(0.19_0.05_262/0.55)] to-transparent" />

      <div className="relative mx-auto flex min-h-[76vh] max-w-[95%] flex-col justify-center px-6 py-24">
        <p className="eyebrow">Tanganyika e-Bridge International Tours</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          {active?.title || L("Bienvenue chez TABITO", "Welcome to TABITO")}
        </h1>
        {active?.subtitle && (
          <p className="mt-5 max-w-xl text-base text-primary-foreground/85">{active.subtitle}</p>
        )}
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild size="xl" variant="lagoon">
            <Link to={active?.cta_link || "/destinations"}>
              {active?.cta_label || L("Découvrir", "Discover")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outlineLight">
            <Link to="/contacts">{L("Nous contacter", "Contact us")}</Link>
          </Button>
        </div>

        {list.length > 1 && (
          <div className="mt-12 flex gap-2" role="tablist" aria-label={L("Diapositives", "Slides")}>
            {list.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={L(`Diapositive ${i + 1}`, `Slide ${i + 1}`)}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-10 bg-accent" : "w-5 bg-primary-foreground/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>

  );
}

function Home() {
  const { L, tx } = useI18n();
  const { data: sections = {} } = useQuery(homeSectionsQuery);
  const { data: services = [] } = useQuery(servicesQuery);
  const { data: destinations } = useQuery(destinationsQuery);
  const { data: packages = [] } = useQuery(packagesQuery);
  const FLAGSHIP_TITLES = [
    "Le Tour de la Ville BUJA",
    "La Route des Femmes Vendeuses du Mukeke et Akarobe",
  ];
  const flagshipTours = packages.filter((p) => FLAGSHIP_TITLES.includes(p.title));
  const { data: guides = [] } = useQuery(guidesQuery);
  const { data: posts = [] } = useQuery(blogQuery);
  const { data: testimonials = [] } = useQuery(testimonialsQuery);

  const fallbackDestinations = [
    {
      id: "d1",
      name: L("Parc national de la Kibira", "Kibira National Park"),
      categorie: L("Nature", "Nature"),
      image_url: PLACEHOLDER_IMAGE,
    },
    {
      id: "d2",
      name: L("Lac Tanganyika", "Lake Tanganyika"),
      categorie: L("Plages", "Beaches"),
      image_url: PLACEHOLDER_IMAGE,
    },
    {
      id: "d3",
      name: L("Chutes de la Karera", "Karera Falls"),
      categorie: L("Cascades", "Waterfalls"),
      image_url: PLACEHOLDER_IMAGE,
    },
    {
      id: "d4",
      name: L("Musées vivants", "Living museums"),
      categorie: L("Culture", "Culture"),
      image_url: PLACEHOLDER_IMAGE,
    },
  ];

  const localizedDestinations =
    destinations && destinations.length > 0
      ? destinations.slice(0, 4).map((d) => ({
          id: d.id,
          name: tx(d, "name"),
          categorie: tx(d, "categorie"),
          image_url: imageOr(d.image_url, PLACEHOLDER_IMAGE),
        }))
      : fallbackDestinations;

  const sec = (slug: string, fb: { eyebrow: string; title: string; description?: string }) => {
    const row = sections[`accueil-${slug}`];
    return {
      eyebrow: (row ? tx(row, "subtitle") : "") || fb.eyebrow,
      title: (row ? tx(row, "title") : "") || fb.title,
      description: (row ? tx(row, "body") : "") || fb.description || "",
      image: row?.hero_image_url ?? null,
    };
  };

  const about = sec("apropos", {
    eyebrow: L("À propos de nous", "About us"),
    title: L("TABITO, votre pont vers le Burundi", "TABITO, your bridge to Burundi"),
  });

  const localizedServices =
    services.length > 0
      ? services.map((s) => ({
          icon: s.icon ?? "compass",
          title: tx(s, "title"),
          text: tx(s, "description"),
        }))
      : [
          {
            icon: "route",
            title: L("Itinéraires sur mesure", "Custom itineraries"),
            text: L(
              "Nous concevons votre programme de voyage jour par jour selon vos envies, votre budget et la saison.",
              "We design your day-by-day travel programme based on your wishes, budget and the season.",
            ),
          },
          {
            icon: "bus",
            title: L("Transport terrestre", "Land transport"),
            text: L(
              "Véhicules confortables et chauffeurs expérimentés pour tous vos déplacements à travers le pays.",
              "Comfortable vehicles and experienced drivers for all your journeys across the country.",
            ),
          },
          {
            icon: "compass",
            title: L("Visites guidées", "Guided tours"),
            text: L(
              "Des guides locaux passionnés qui racontent l'histoire, la nature et les traditions du Burundi.",
              "Passionate local guides who share the history, nature and traditions of Burundi.",
            ),
          },
          {
            icon: "ambulance",
            title: L("Premiers secours & santé", "First aid & health"),
            text: L(
              "Kits de premiers soins, assistance et conseils sanitaires pendant toute la durée du séjour.",
              "First-aid kits, assistance and health advice throughout your stay.",
            ),
          },
          {
            icon: "mappin",
            title: L("Attractions & loisirs", "Attractions & leisure"),
            text: L(
              "Accès aux parcs, réserves, plages, musées vivants et évènements culturels du pays.",
              "Access to parks, reserves, beaches, living museums and cultural events across the country.",
            ),
          },
          {
            icon: "ticket",
            title: L("Billetterie de voyage", "Travel ticketing"),
            text: L(
              "Réservation de billets, transferts aéroport et formalités simplifiées pour vos déplacements.",
              "Ticket booking, airport transfers and simplified formalities for your travels.",
            ),
          },
        ];

  const circuits = packages.filter((p) => p.type !== "bouquet").slice(0, 3);
  const bouquets = packages.filter((p) => p.type === "bouquet").slice(0, 3);
  const localizedPackages = [...circuits, ...bouquets].map((p) => ({
    id: p.id,
    image_url: imageOr(p.image_url, PLACEHOLDER_IMAGE),
    title: tx(p, "title"),
    description: tx(p, "description"),
    duration: p.duration,
    type: p.type,
    price: p.price,
  }));

  return (
    <SiteLayout>
      <Hero />

      {/* À propos */}
      <section className="section-y bg-background">
        <div className="mx-auto grid max-w-[95%] items-center gap-12 px-6 lg:grid-cols-2">
          <div className="relative">
            <img
              src={imageOr(about.image, PLACEHOLDER_IMAGE)}
              alt={L("Rivage du lac Tanganyika au Burundi", "Shore of Lake Tanganyika in Burundi")}
              width={1920}
              height={1088}
              loading="lazy"
              className="w-full rounded-2xl object-cover shadow-[var(--shadow-card)]"
            />
            <div className="absolute -bottom-6 -right-4 hidden w-48 rounded-2xl bg-card p-5 shadow-[var(--shadow-lift)] sm:block">
              <p className="font-display text-3xl font-bold text-accent">+18</p>
              <p className="text-xs text-muted-foreground">
                {L("provinces et sites couverts par nos circuits", "provinces and sites covered by our tours")}
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
                L("Guides locaux certifiés", "Certified local guides"),
                L("Circuits personnalisés", "Personalized tours"),
                L("Transport et logistique inclus", "Transport and logistics included"),
                L("Tourisme durable et communautaire", "Sustainable, community-based tourism"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="size-4 shrink-0 text-leaf" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8" variant="hero" size="lg">
              <Link to="/apropos">
                {L("En savoir plus", "Learn more")} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Carte des sites */}
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            {...sec("carte", {
              eyebrow: L("Carte interactive", "Interactive map"),
              title: L("Les sites touristiques du Burundi", "Tourist sites of Burundi"),
            })}
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
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            {...sec("services", {
              eyebrow: L("Nos services", "Our services"),
              title: L("Tout ce qu'il faut pour bien voyager", "Everything you need for a great trip"),
            })}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localizedServices.map(({ icon, title, text }) => {
              const Icon = SERVICE_ICONS[icon] ?? Compass;
              return (
                <article key={title} className="hover-lift surface-card p-7">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            {...sec("destinations", {
              eyebrow: L("Destinations", "Destinations"),
              title: L("Des lieux qui marquent à vie", "Places that mark you for life"),
            })}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {localizedDestinations.map((d) => (
              <Link
                key={d.id}
                to="/destinations"
                className="hover-lift group relative block overflow-hidden rounded-2xl"
              >
                <img
                  src={d.image_url}
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
                {L("Toutes les destinations", "All destinations")} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Circuits phares */}
      {flagshipTours.length > 0 && (
        <section className="section-y bg-card">
          <div className="mx-auto max-w-[95%] px-6">
            <SectionHeading
              eyebrow={L("Circuits phares", "Flagship tours")}
              title={L("Nos deux circuits vedettes", "Our two signature tours")}
              description={L(
                "Le Tour de la Ville BUJA et La Route des Femmes Vendeuses du Mukeke et Akarobe, au cœur de la Destination du Grand Bujumbura.",
                "The BUJA City Tour and the Mukeke and Akarobe Women Sellers Route, at the heart of the Bujumbura Great City Destination.",
              )}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {flagshipTours.map((p) => (
                <article key={p.id} className="hover-lift surface-card overflow-hidden">
                  <img
                    src={imageOr(p.image_url, PLACEHOLDER_IMAGE)}
                    alt={tx(p, "title")}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="h-60 w-full object-cover"
                  />
                  <div className="p-6">
                    {tx(p, "duration") && (
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {tx(p, "duration")}
                      </p>
                    )}
                    <h3 className="mt-2 font-display text-xl font-semibold text-primary">
                      {tx(p, "title")}
                    </h3>
                    {tx(p, "description") && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {tx(p, "description")}
                      </p>
                    )}
                    {tx(p, "price") && (
                      <p className="mt-4 font-display text-lg text-accent">{tx(p, "price")}</p>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button asChild variant="lagoon">
                        <Link to="/reservation">{L("Réserver", "Book")}</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/grand-bujumbura">
                          {L("Grand Bujumbura", "Greater Bujumbura")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Circuits & bouquets */}
      {localizedPackages.length > 0 && (
        <section className="section-y bg-background">
          <div className="mx-auto max-w-[95%] px-6">
            <SectionHeading
              {...sec("formules", {
                eyebrow: L("Circuits & bouquets", "Tours & packages"),
                title: L("Nos formules de voyage", "Our travel packages"),
              })}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {localizedPackages.map((p) => (
                <article key={p.id} className="hover-lift surface-card overflow-hidden">
                  <img
                    src={p.image_url}
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
          <div className="mx-auto max-w-[95%] px-6">
            <SectionHeading
              {...sec("guides", {
                eyebrow: L("Nos guides", "Our guides"),
                title: L("Des passionnés à vos côtés", "Passionate guides by your side"),
              })}
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {guides.slice(0, 4).map((g) => (
                <article key={g.id} className="hover-lift surface-card overflow-hidden text-center">
                  <img
                    src={imageOr(g.photo_url, PLACEHOLDER_IMAGE)}
                    alt={g.name}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="h-60 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-primary">{g.name}</h3>
                    {tx(g, "speciality") && (
                      <p className="mt-1 text-xs text-muted-foreground">{tx(g, "speciality")}</p>
                    )}
                    {tx(g, "languages") && (
                      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-accent">
                        <Languages className="size-3.5" aria-hidden="true" />
                        {tx(g, "languages")}
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
          <div className="mx-auto max-w-[95%] px-6">
            <SectionHeading
              {...sec("blog", { eyebrow: L("Actualités", "News"), title: L("Les dernières nouvelles", "The latest news") })}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {posts.slice(0, 3).map((post) => {
                const title = tx(post, "title");
                const excerpt = tx(post, "excerpt");
                return (
                  <article key={post.id} className="hover-lift surface-card overflow-hidden">
                    <img
                      src={imageOr(post.image_url, PLACEHOLDER_IMAGE)}
                      alt={title}
                      width={1200}
                      height={800}
                      loading="lazy"
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-6">
                      {post.published_at && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.published_at).toLocaleDateString(
                            L("fr-FR", "en-US"),
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      )}
                      <h3 className="mt-2 font-display text-lg font-semibold text-primary">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                          {excerpt}
                        </p>
                      )}
                      <Link
                        to="/blog"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent"
                      >
                        {L("Lire la suite", "Read more")} <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Témoignages */}
      {testimonials.length > 0 && (
        <section className="section-y relative isolate overflow-hidden">
          <img
            src={imageOr(sec("temoignages", { eyebrow: "", title: "" }).image, PLACEHOLDER_IMAGE)}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1088}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 gradient-lagoon opacity-90" />
          <div className="relative mx-auto max-w-[95%] px-6">
            <SectionHeading
              light
              {...sec("temoignages", {
                eyebrow: L("Témoignages", "Testimonials"),
                title: L("Ils ont voyagé avec TABITO", "They travelled with TABITO"),
              })}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <figure key={t.id} className="surface-card p-7">
                  <Quote className="size-7 text-accent" aria-hidden="true" />
                  <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {tx(t, "message")}
                  </blockquote>
                  <div className="mt-5 flex items-center gap-1">
                    {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-sun text-sun" aria-hidden="true" />
                    ))}
                  </div>
                  <figcaption className="mt-4">
                    <p className="font-display font-semibold text-primary">{t.author}</p>
                    {tx(t, "role_title") && (
                      <p className="text-xs text-muted-foreground">{tx(t, "role_title")}</p>
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