import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";

export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "Notre mission — TABITO" },
      {
        name: "description",
        content:
          "La mission de TABITO : promouvoir le tourisme burundais, créer de la valeur locale et offrir des expériences de voyage authentiques.",
      },
      { property: "og:title", content: "Notre mission — TABITO" },
      {
        property: "og:description",
        content: "Promouvoir le tourisme burundais et créer de la valeur pour les communautés.",
      },
    ],
  }),
  component: () => (
    <CmsPage
      slug="mission"
      title="Notre mission"
      subtitle="Faire du tourisme un moteur de développement pour le Burundi."
      fallback={
        <>
          <p>
            TABITO a pour mission de <strong>promouvoir la destination Burundi</strong> et de
            faciliter l'accès des voyageurs aux richesses du pays, tout en garantissant un impact
            positif pour les communautés d'accueil.
          </p>
          <h2>Nos axes de mission</h2>
          <ul>
            <li>Structurer une offre touristique lisible, fiable et de qualité.</li>
            <li>Digitaliser l'information touristique : sites, cartes, circuits, évènements.</li>
            <li>Créer des emplois durables pour les jeunes et les femmes du secteur.</li>
            <li>Protéger et valoriser le patrimoine naturel et culturel burundais.</li>
            <li>Faciliter la coopération régionale autour du lac Tanganyika.</li>
          </ul>
        </>
      }
    />
  ),
});
