import { createFileRoute } from "@tanstack/react-router";

import { OpportunityList } from "@/components/site/OpportunityList";

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
  component: () => (
    <OpportunityList
      kind="formation"
      title="Formations"
      subtitle="Se former aux métiers de l'accueil, du guidage et de la gestion touristique."
      eyebrow="SMED LAB"
      heading="Formations ouvertes"
      empty="Aucune formation n'est ouverte aux inscriptions pour le moment."
    />
  ),
});
