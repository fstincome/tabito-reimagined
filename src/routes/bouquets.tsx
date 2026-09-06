import { createFileRoute } from "@tanstack/react-router";

import { PackageList } from "@/components/site/PackageList";
import { useI18n } from "@/lib/i18n";

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
  component: BouquetsPage,
});

function BouquetsPage() {
  const { L } = useI18n();
  return (
    <PackageList
      mode="bouquet"
      slug="bouquets"
      title={L("Bouquets", "Packages")}
      subtitle={L(
        "Des formules modulables : vous choisissez les composantes, nous assemblons le séjour.",
        "Flexible packages: you choose the components, we assemble the trip.",
      )}
      eyebrow={L("Formules", "Packages")}
      heading={L("Nos bouquets de voyage", "Our travel packages")}
      description={L(
        "Nature, culture, détente ou affaires : chaque bouquet regroupe un ensemble de prestations cohérentes.",
        "Nature, culture, relaxation or business: each package brings together a coherent set of services.",
      )}
      empty={L(
        "Les bouquets seront publiés prochainement depuis le tableau de bord.",
        "Packages will be published soon from the dashboard.",
      )}
    />
  );
}
