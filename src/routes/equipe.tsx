import { createFileRoute } from "@tanstack/react-router";

import { CmsPageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TeamGroups } from "@/components/site/TeamGroups";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Notre équipe opérationnelle — TABITO" },
      {
        name: "description",
        content:
          "Rencontrez les équipes opérationnelles et techniques de TABITO au Burundi : voyages, logistique, marketing digital et outils numériques.",
      },
      { property: "og:title", content: "Notre équipe opérationnelle — TABITO" },
      { property: "og:description", content: "Les femmes et les hommes derrière l'agence TABITO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Equipe,
});

function Equipe() {
  const { L } = useI18n();
  return (
    <SiteLayout>
      <CmsPageHero
        slug="equipe"
        title={L("Notre équipe", "Our team")}
        subtitle={L(
          "Des professionnels burundais du voyage, de la logistique et de la médiation culturelle.",
          "Burundian professionals in travel, logistics and cultural mediation.",
        )}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            eyebrow={L("L'équipe TABITO", "The TABITO team")}
            title={L(
              "Celles et ceux qui préparent votre voyage",
              "The people who prepare your journey",
            )}
          />
          <TeamGroups only={["operational", "it"]} />
        </div>
      </section>
    </SiteLayout>
  );
}
