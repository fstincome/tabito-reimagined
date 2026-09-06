import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { citiesQuery, pageQuery } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { PLACEHOLDER_IMAGE, imageOr, isHttpUrl } from "@/lib/media";

export const Route = createFileRoute("/villes")({
  head: () => ({
    meta: [
      { title: "Villes du Burundi à visiter — TABITO" },
      {
        name: "description",
        content:
          "Bujumbura, Gitega, Ngozi, Rumonge, Makamba : découvrez les villes du Burundi, leurs atouts et leurs attractions touristiques.",
      },
      { property: "og:title", content: "Villes du Burundi à visiter — TABITO" },
      {
        property: "og:description",
        content: "Guide des principales villes burundaises et de leurs attractions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Villes,
});

function highlightsOf(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

function Villes() {
  const { L, tx, tlist } = useI18n();
  const { data: cities = [] } = useQuery(citiesQuery);
  const { data: page } = useQuery(pageQuery("villes"));

  return (
    <SiteLayout>
      <PageHero
        title={tx(page, "title") || L("Villes du Burundi", "Cities of Burundi")}
        subtitle={
          tx(page, "subtitle") ||
          L(
            "Des rives du lac Tanganyika aux collines du centre, chaque ville a son caractère.",
            "From the shores of Lake Tanganyika to the central hills, each city has its own character.",
          )
        }
        image={isHttpUrl(page?.hero_image_url) ? (page?.hero_image_url as string) : undefined}
      />

      <section className="section-y bg-background">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            eyebrow={L("Territoires", "Territories")}
            title={L("Les villes à découvrir", "Cities to discover")}
            description={
              tx(page, "body") ||
              L(
                "Chaque ville peut être combinée dans un circuit sur mesure. Contactez-nous pour composer votre itinéraire.",
                "Each city can be combined into a tailor-made tour. Contact us to build your itinerary.",
              )
            }
          />

          {cities.length === 0 ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              {L(
                "Les villes seront publiées prochainement depuis le tableau de bord.",
                "Cities will be published soon from the dashboard.",
              )}
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((c) => (
                <article key={c.id} className="hover-lift surface-card overflow-hidden">
                  <img
                    src={imageOr(c.image_url, PLACEHOLDER_IMAGE)}
                    alt={tx(c, "name")}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-6">
                    {c.province && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-primary">
                        <MapPin className="h-3 w-3" /> {c.province}
                      </span>
                    )}
                    <h2 className="mt-3 font-display text-lg font-semibold text-primary">
                      {tx(c, "name")}
                    </h2>
                    {(c.summary || c.description) && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {tx(c, "summary") || tx(c, "description")}
                      </p>
                    )}
                    {highlightsOf(tlist(c, "highlights")).length > 0 && (
                      <ul className="mt-4 space-y-1.5 text-sm text-foreground">
                        {tlist(c, "highlights").map((h) => (
                          <li key={h} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
