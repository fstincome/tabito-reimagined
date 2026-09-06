import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Languages, Phone } from "lucide-react";

import tambours from "@/assets/hero-tambours.jpg";
import { BioDialog } from "@/components/site/BioDialog";
import { CmsPageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { guidesQuery } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
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
  const { L, tx } = useI18n();
  const { data: guides = [] } = useQuery(guidesQuery);

  return (
    <SiteLayout>
      <CmsPageHero slug="guides"
        title={L("Guides touristiques", "Tour guides")}
        subtitle={L(
          "Ils connaissent les sentiers, les histoires et les meilleurs moments pour chaque visite.",
          "They know the trails, the stories and the best moments for every visit.",
        )}
        image={tambours}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            eyebrow={L("Accompagnement", "Guiding")}
            title={L("Nos guides", "Our guides")}
            description={L(
              "Tous nos guides sont burundais, formés et évalués après chaque circuit.",
              "All our guides are Burundian, trained and evaluated after each tour.",
            )}
          />
          {guides.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              {L(
                "La liste des guides sera publiée prochainement.",
                "The list of guides will be published soon.",
              )}
            </p>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {guides.map((g) => (
                <article key={g.id} className="hover-lift surface-card overflow-hidden text-center">
                  <img
                    src={imageOr(g.photo_url, tambours)}
                    alt={tx(g, "name")}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="h-60 w-full bg-muted object-contain p-2"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-primary">{tx(g, "name")}</h3>
                    {g.speciality && (
                      <p className="mt-1 text-xs text-muted-foreground">{tx(g, "speciality")}</p>
                    )}
                    {g.languages && (
                      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-accent">
                        <Languages className="size-3.5" aria-hidden="true" />
                        {tx(g, "languages")}
                      </p>
                    )}
                    {g.phone && (
                      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="size-3.5" aria-hidden="true" />
                        {g.phone}
                      </p>
                    )}
                    <BioDialog
                      label={L("Voir bio", "View bio")}
                      person={{
                        name: tx(g, "name"),
                        photo: imageOr(g.photo_url, tambours),
                        speciality: tx(g, "speciality"),
                        languages: tx(g, "languages"),
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
