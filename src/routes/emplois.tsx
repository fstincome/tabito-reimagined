import { createFileRoute } from "@tanstack/react-router";

import { OpportunityList } from "@/components/site/OpportunityList";

export const Route = createFileRoute("/emplois")({
  head: () => ({
    meta: [
      { title: "Offres d'emploi du tourisme — TABITO" },
      {
        name: "description",
        content:
          "Offres d'emploi et de stage dans le tourisme, l'hôtellerie et la culture au Burundi, publiées par TABITO.",
      },
      { property: "og:title", content: "Offres d'emploi du tourisme — TABITO" },
      { property: "og:description", content: "Emplois et stages du secteur touristique burundais." },
    ],
  }),
  component: () => (
    <OpportunityList
      kind="emploi"
      title="Emplois"
      subtitle="Les opportunités professionnelles du tourisme et de l'économie créative au Burundi."
      eyebrow="Carrières"
      heading="Offres d'emploi et de stage"
      empty="Aucune offre d'emploi n'est publiée pour le moment."
    />
  ),
});
