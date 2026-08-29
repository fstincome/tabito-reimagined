import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";

export const Route = createFileRoute("/smedlab")({
  head: () => ({
    meta: [
      { title: "SMED LAB — Laboratoire d'innovation TABITO" },
      {
        name: "description",
        content:
          "SMED LAB, le laboratoire de TABITO dédié à l'innovation, à la formation et à l'accompagnement des entreprises du tourisme burundais.",
      },
      { property: "og:title", content: "SMED LAB — Laboratoire d'innovation TABITO" },
      {
        property: "og:description",
        content: "Innovation, formation et accompagnement des acteurs du tourisme au Burundi.",
      },
    ],
  }),
  component: () => (
    <CmsPage
      slug="smedlab"
      title="SMED LAB"
      subtitle="Le laboratoire d'innovation et de développement des métiers du tourisme."
      fallback={
        <>
          <p>
            <strong>SMED LAB</strong> est l'espace d'expérimentation de TABITO consacré au
            développement des micro, petites et moyennes entreprises du tourisme et de l'économie
            créative au Burundi.
          </p>
          <h2>Nos programmes</h2>
          <ul>
            <li>Formations courtes : accueil, guidage, hygiène, langues, gestion.</li>
            <li>Accompagnement à la structuration d'offres touristiques locales.</li>
            <li>Appui au numérique : présence en ligne, réservation, paiement.</li>
            <li>Mise en relation avec les financements et les partenaires techniques.</li>
          </ul>
          <h2>Pour qui ?</h2>
          <p>
            Guides indépendants, hébergeurs, restaurateurs, artisans, coopératives et jeunes
            entrepreneurs souhaitant se professionnaliser dans le tourisme.
          </p>
        </>
      }
    />
  ),
});
