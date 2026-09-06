import { createFileRoute } from "@tanstack/react-router";

import { OpportunityList } from "@/components/site/OpportunityList";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/financements")({
  head: () => ({
    meta: [
      { title: "Appels à financement — TABITO" },
      {
        name: "description",
        content:
          "Appels à projets, subventions et opportunités de financement pour les acteurs du tourisme et de la culture au Burundi.",
      },
      { property: "og:title", content: "Appels à financement — TABITO" },
      { property: "og:description", content: "Subventions et appels à projets pour le secteur." },
    ],
  }),
  component: FinancementsPage,
});

function FinancementsPage() {
  const { L } = useI18n();
  return (
    <OpportunityList
      kind="financement"
      slug="financements"
      title={L("Financements", "Funding")}
      subtitle={L(
        "Subventions, appels à projets et dispositifs d'appui pour les entrepreneurs du secteur.",
        "Grants, calls for projects and support schemes for entrepreneurs in the sector.",
      )}
      eyebrow={L("Opportunités", "Opportunities")}
      heading={L("Appels à financement", "Funding calls")}
      empty={L(
        "Aucun appel à financement n'est publié pour le moment.",
        "No funding calls are published at the moment.",
      )}
    />
  );
}
