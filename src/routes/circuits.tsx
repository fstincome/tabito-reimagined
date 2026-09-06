import { createFileRoute } from "@tanstack/react-router";

import { PackageList } from "@/components/site/PackageList";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/circuits")({
  head: () => ({
    meta: [
      { title: "Circuits touristiques au Burundi — TABITO" },
      {
        name: "description",
        content:
          "Circuits de 1 à 10 jours au Burundi : Kibira, lac Tanganyika, chutes de la Karera, sources du Nil, musées vivants. Devis sur mesure avec TABITO.",
      },
      { property: "og:title", content: "Circuits touristiques au Burundi — TABITO" },
      {
        property: "og:description",
        content: "Des circuits prêts à partir, guidés par des professionnels burundais.",
      },
    ],
  }),
  component: CircuitsPage,
});

function CircuitsPage() {
  const { L } = useI18n();
  return (
    <PackageList
      mode="circuit"
      slug="circuits"
      heroImage={PLACEHOLDER_IMAGE}
      title={L("Circuits", "Tours")}
      subtitle={L(
        "Des itinéraires pensés par nos guides, du week-end à la grande traversée du pays.",
        "Itineraries designed by our guides, from a weekend getaway to a full crossing of the country.",
      )}
      eyebrow={L("Programmes", "Programs")}
      heading={L("Nos circuits au Burundi", "Our tours in Burundi")}
      description={L(
        "Chaque circuit inclut le transport, l'accompagnement et l'accès aux sites. Les hébergements et repas sont adaptés à votre budget.",
        "Each tour includes transport, guiding and site access. Accommodation and meals are tailored to your budget.",
      )}
      empty={L(
        "Les circuits seront publiés prochainement depuis le tableau de bord.",
        "Tours will be published soon from the dashboard.",
      )}
    />
  );
}
