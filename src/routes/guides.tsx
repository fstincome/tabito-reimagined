import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Languages, Phone } from "lucide-react";

import tambours from "@/assets/hero-tambours.jpg";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { guidesQuery } from "@/lib/content";
import { imageOr } from "@/lib/media";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides touristiques du Burundi — TABITO" },
      {
        name: "description",
        content:
          "Nos guides touristiques burundais : langues parlées, spécialités et régions couvertes pour accompagner votre séjour.",
      },
      { property: "og:title", content: "Guides touristiques du Burundi — TABITO" },
      { property: "og:description", content: "Des guides locaux multilingues et certifiés." },
    ],
  }),
  component: Guides,
});

function Guides() {
  const { data: guides = [] } = useQuery(guidesQuery);

  return (
    <SiteLayout>
      <PageHero
        title="Guides touristiques"
        subtitle="Ils connaissent les sentiers, les histoires et les meilleurs moments pour chaque visite."
        image={tambours}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Accompagnement"
            title="Nos guides"
            description="Tous nos guides sont burundais, formés et évalués après chaque circuit."
          />
          {guides.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              La liste des guides sera publiée prochainement.
            </p>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {guides.map((g) => (
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
                    {g.phone && (
                      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="size-3.5" aria-hidden="true" />
                        {g.phone}
                      </p>
                    )}
                    <BioDialog
                      person={{
                        name: g.name,
                        photo: imageOr(g.photo_url, tambours),
                        speciality: g.speciality,
                        languages: g.languages,
                        phone: g.phone,
                      }}
                    />
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
