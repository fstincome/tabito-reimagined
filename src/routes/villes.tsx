import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import karera from "@/assets/karera.jpg";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { citiesQuery, pageQuery } from "@/lib/content";
import { imageOr, isHttpUrl } from "@/lib/media";

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
  const { data: cities = [] } = useQuery(citiesQuery);
  const { data: page } = useQuery(pageQuery("villes"));

  return (
    <SiteLayout>
      <PageHero
        title={page?.title || "Villes du Burundi"}
        subtitle={
          page?.subtitle ||
          "Des rives du lac Tanganyika aux collines du centre, chaque ville a son caractère."
        }
        image={isHttpUrl(page?.hero_image_url) ? (page?.hero_image_url as string) : undefined}
      />

      <section className="section-y bg-background">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            eyebrow="Territoires"
            title="Les villes à découvrir"
            description={
              page?.body ||
              "Chaque ville peut être combinée dans un circuit sur mesure. Contactez-nous pour composer votre itinéraire."
            }
          />

          {cities.length === 0 ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              Les villes seront publiées prochainement depuis le tableau de bord.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((c) => (
                <article key={c.id} className="hover-lift surface-card overflow-hidden">
                  <img
                    src={imageOr(c.image_url, karera)}
                    alt={c.name}
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
                      {c.name}
                    </h2>
                    {(c.summary || c.description) && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {c.summary || c.description}
                      </p>
                    )}
                    {highlightsOf(c.highlights).length > 0 && (
                      <ul className="mt-4 space-y-1.5 text-sm text-foreground">
                        {highlightsOf(c.highlights).map((h) => (
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
