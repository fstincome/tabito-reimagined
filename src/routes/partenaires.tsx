import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { CmsPageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { partnersQuery } from "@/lib/content";
import { isHttpUrl } from "@/lib/media";

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Nos partenaires — TABITO" },
      {
        name: "description",
        content:
          "Institutions, opérateurs et organisations qui accompagnent TABITO dans le développement du tourisme burundais.",
      },
      { property: "og:title", content: "Nos partenaires — TABITO" },
      { property: "og:description", content: "Les partenaires de l'agence TABITO au Burundi." },
    ],
  }),
  component: Partenaires,
});

function Partenaires() {
  const { data: partners = [] } = useQuery(partnersQuery);

  return (
    <SiteLayout>
      <CmsPageHero slug="partenaires"
        title="Nos partenaires"
        subtitle="Nous travaillons main dans la main avec les institutions et les opérateurs du secteur."
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading eyebrow="Réseau" title="Ils nous font confiance" />
          {partners.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              La liste de nos partenaires sera publiée prochainement.
            </p>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((p) => (
                <article key={p.id} className="hover-lift surface-card p-7">
                  {isHttpUrl(p.logo_url) ? (
                    <img
                      src={p.logo_url as string}
                      alt={`Logo ${p.name}`}
                      width={240}
                      height={96}
                      loading="lazy"
                      className="h-16 w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-16 items-center font-display text-xl font-semibold text-primary">
                      {p.name}
                    </div>
                  )}
                  <h3 className="mt-5 font-display text-base font-semibold text-primary">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                  )}
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                    >
                      Visiter le site <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
