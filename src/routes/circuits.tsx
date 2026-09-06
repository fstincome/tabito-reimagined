import { createFileRoute } from "@tanstack/react-router";

import kibira from "@/assets/hero-kibira.jpg";
import { PackageList } from "@/components/site/PackageList";

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
  component: () => (
    <PackageList
      mode="circuit"
      slug="circuits"
      heroImage={kibira}
      title="Circuits"
      subtitle="Des itinéraires pensés par nos guides, du week-end à la grande traversée du pays."
      eyebrow="Programmes"
      heading="Nos circuits au Burundi"
      description="Chaque circuit inclut le transport, l'accompagnement et l'accès aux sites. Les hébergements et repas sont adaptés à votre budget."
      empty="Les circuits seront publiés prochainement depuis le tableau de bord."
    />
  ),
});
