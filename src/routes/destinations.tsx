import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useState } from "react";

import { ClientOnly } from "@/components/site/ClientOnly";
import { CmsPageHero } from "@/components/site/PageHero";
import { CmsSectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SitesMap } from "@/components/site/SitesMap";
import { useI18n } from "@/lib/i18n";
import { destinationsQuery, sitesQuery } from "@/lib/content";
import { PLACEHOLDER_IMAGE, imageOr } from "@/lib/media";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations et sites touristiques du Burundi — TABITO" },
      {
        name: "description",
        content:
          "Parcs nationaux, réserves, plages du lac Tanganyika, chutes de la Karera, musées vivants : découvrez les destinations du Burundi avec TABITO.",
      },
      { property: "og:title", content: "Destinations et sites touristiques du Burundi — TABITO" },
      {
        property: "og:description",
        content: "Les sites touristiques du Burundi cartographiés par TABITO.",
      },
    ],
  }),
  component: Destinations,
});

function Destinations() {
  const { L, tx } = useI18n();
  const { data: destinations = [] } = useQuery(destinationsQuery);
  const { data: sites = [] } = useQuery(sitesQuery);
  const allLabel = L("Tous", "All");
  const [filter, setFilter] = useState<string>(allLabel);

  const categories = [
    allLabel,
    ...Array.from(new Set(destinations.map((d) => d.categorie).filter(Boolean) as string[])),
  ];
  const visible =
    filter === allLabel ? destinations : destinations.filter((d) => d.categorie === filter);

  return (
    <SiteLayout>
      <CmsPageHero slug="destinations"
        title={L("Destinations", "Destinations")}
        subtitle={L(
          "Du lac Tanganyika aux forêts de montagne, une mosaïque de paysages à moins de trois heures de route.",
          "From Lake Tanganyika to mountain forests, a mosaic of landscapes less than three hours away.",
        )}
        image={PLACEHOLDER_IMAGE}
      />

      <section className="section-y bg-background">
        <div className="mx-auto max-w-[95%] px-6">
          <CmsSectionHeading
            slug="destinations-selection"
            eyebrow={L("Sélection", "Selection")}
            title={L("Nos destinations phares", "Our flagship destinations")}
            description={L(
              "Chaque destination peut être visitée seule ou intégrée dans un circuit plus large.",
              "Each destination can be visited on its own or included in a broader tour.",
            )}
          />

          {categories.length > 1 && (
            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-4 py-2 font-display text-sm font-medium transition-colors ${
                    filter === c
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {visible.length === 0 ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              {L(
                "Les destinations seront publiées prochainement depuis le tableau de bord.",
                "Destinations will be published soon from the dashboard.",
              )}
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((d) => (
                <article key={d.id} className="hover-lift surface-card overflow-hidden">
                  <img
                    src={imageOr(d.image_url, PLACEHOLDER_IMAGE)}
                    alt={tx(d, "name")}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-6">
                    {d.categorie && (
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-primary">
                        {d.categorie}
                      </span>
                    )}
                    <h3 className="mt-3 font-display text-lg font-semibold text-primary">
                      {tx(d, "name")}
                    </h3>
                    {(d.summary || d.description) && (
                      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                        {tx(d, "summary") || tx(d, "description")}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <CmsSectionHeading
            slug="destinations-carte"
            eyebrow={L("Carte", "Map")}
            title={L("Tous les sites recensés", "All listed sites")}
            description={L(
              "Les coordonnées sont saisies par notre équipe depuis le tableau de bord et s'affichent instantanément ici.",
              "The coordinates are entered by our team from the dashboard and appear here instantly.",
            )}
          />
          <div className="mt-14">
            <ClientOnly
              fallback={<div className="h-[460px] animate-pulse rounded-2xl bg-muted" aria-hidden="true" />}
            >
              <SitesMap />
            </ClientOnly>
          </div>

          {sites.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sites.map((s) => (
                <div key={s.id} className="surface-card p-5">
                  <h3 className="flex items-start gap-2 font-display text-base font-semibold text-primary">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {tx(s, "nom_site")}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[s.commune, s.province].filter(Boolean).join(", ")}
                    {s.categorie ? ` · ${s.categorie}` : ""}
                  </p>
                  {s.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {tx(s, "description")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
