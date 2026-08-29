import { createFileRoute } from "@tanstack/react-router";

import { OpportunityList } from "@/components/site/OpportunityList";

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
  component: () => (
    <OpportunityList
      kind="financement"
      title="Financements"
      subtitle="Subventions, appels à projets et dispositifs d'appui pour les entrepreneurs du secteur."
      eyebrow="Opportunités"
      heading="Appels à financement"
      empty="Aucun appel à financement n'est publié pour le moment."
    />
  ),
});
