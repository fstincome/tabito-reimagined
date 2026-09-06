import { createFileRoute } from "@tanstack/react-router";

import { OpportunityList } from "@/components/site/OpportunityList";
import { useI18n } from "@/lib/i18n";

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
  component: EmploisPage,
});

function EmploisPage() {
  const { L } = useI18n();
  return (
    <OpportunityList
      kind="emploi"
      slug="emplois"
      title={L("Emplois", "Jobs")}
      subtitle={L(
        "Les opportunités professionnelles du tourisme et de l'économie créative au Burundi.",
        "Professional opportunities in tourism and the creative economy in Burundi.",
      )}
      eyebrow={L("Carrières", "Careers")}
      heading={L("Offres d'emploi et de stage", "Job and internship offers")}
      empty={L(
        "Aucune offre d'emploi n'est publiée pour le moment.",
        "No job offers are published at the moment.",
      )}
    />
  );
}
