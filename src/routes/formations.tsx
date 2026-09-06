import { createFileRoute } from "@tanstack/react-router";

import { OpportunityList } from "@/components/site/OpportunityList";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/formations")({
  head: () => ({
    meta: [
      { title: "Formations du tourisme — TABITO & SMED LAB" },
      {
        name: "description",
        content:
          "Formations en accueil, guidage, langues et gestion touristique proposées par TABITO et SMED LAB au Burundi.",
      },
      { property: "og:title", content: "Formations du tourisme — TABITO & SMED LAB" },
      { property: "og:description", content: "Se former aux métiers du tourisme au Burundi." },
    ],
  }),
  component: FormationsPage,
});

function FormationsPage() {
  const { L } = useI18n();
  return (
    <OpportunityList
      kind="formation"
      slug="formations"
      title={L("Formations", "Training")}
      subtitle={L(
        "Se former aux métiers de l'accueil, du guidage et de la gestion touristique.",
        "Train for careers in hospitality, guiding and tourism management.",
      )}
      eyebrow={L("SMED LAB", "SMED LAB")}
      heading={L("Formations ouvertes", "Open training programs")}
      empty={L(
        "Aucune formation n'est ouverte aux inscriptions pour le moment.",
        "No training program is open for registration at the moment.",
      )}
    />
  );
}
