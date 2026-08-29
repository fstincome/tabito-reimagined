import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";

export const Route = createFileRoute("/vision")({
  head: () => ({
    meta: [
      { title: "Notre vision — TABITO" },
      {
        name: "description",
        content:
          "La vision de TABITO : un Burundi reconnu comme destination incontournable de l'Afrique des Grands Lacs.",
      },
      { property: "og:title", content: "Notre vision — TABITO" },
      {
        property: "og:description",
        content: "Un Burundi reconnu comme destination phare de l'Afrique des Grands Lacs.",
      },
    ],
  }),
  component: () => (
    <CmsPage
      slug="vision"
      title="Notre vision"
      subtitle="Un Burundi reconnu comme destination incontournable de l'Afrique des Grands Lacs."
      fallback={
        <>
          <p>
            Nous voulons voir le Burundi figurer parmi les <strong>destinations phares</strong> de
            l'Afrique de l'Est : un pays où le voyageur trouve facilement l'information, où les
            services sont professionnels et où chaque visite bénéficie aux populations locales.
          </p>
          <h2>À l'horizon</h2>
          <ul>
            <li>Une plateforme numérique de référence pour le tourisme burundais.</li>
            <li>Un réseau national de guides et d'opérateurs certifiés.</li>
            <li>Des circuits transfrontaliers autour du lac Tanganyika.</li>
            <li>Un tourisme sobre en carbone et respectueux des milieux naturels.</li>
          </ul>
        </>
      }
    />
  ),
});
