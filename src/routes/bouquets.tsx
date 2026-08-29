import { createFileRoute } from "@tanstack/react-router";

import { PackageList } from "@/components/site/PackageList";

export const Route = createFileRoute("/bouquets")({
  head: () => ({
    meta: [
      { title: "Bouquets de voyage — TABITO Burundi" },
      {
        name: "description",
        content:
          "Assemblez votre séjour au Burundi à partir de bouquets thématiques : nature, culture, détente au lac Tanganyika ou voyage d'affaires.",
      },
      { property: "og:title", content: "Bouquets de voyage — TABITO Burundi" },
      {
        property: "og:description",
        content: "Des bouquets thématiques à composer selon vos envies et votre budget.",
      },
    ],
  }),
  component: () => (
    <PackageList
      mode="bouquet"
      title="Bouquets"
      subtitle="Des formules modulables : vous choisissez les composantes, nous assemblons le séjour."
      eyebrow="Formules"
      heading="Nos bouquets de voyage"
      description="Nature, culture, détente ou affaires : chaque bouquet regroupe un ensemble de prestations cohérentes."
      empty="Les bouquets seront publiés prochainement depuis le tableau de bord."
    />
  ),
});
