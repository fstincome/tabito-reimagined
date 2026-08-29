import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";

export const Route = createFileRoute("/apropos")({
  head: () => ({
    meta: [
      { title: "À propos de TABITO — Qui sommes-nous" },
      {
        name: "description",
        content:
          "TABITO, Tanganyika e-Bridge International Tours : une agence burundaise de voyages qui valorise le patrimoine naturel et culturel du Burundi.",
      },
      { property: "og:title", content: "À propos de TABITO — Qui sommes-nous" },
      {
        property: "og:description",
        content: "Découvrez l'histoire et les métiers de l'agence TABITO au Burundi.",
      },
    ],
  }),
  component: () => (
    <CmsPage
      slug="apropos"
      title="Qui sommes-nous"
      subtitle="Tanganyika e-Bridge International Tours, le pont entre le Burundi et les voyageurs du monde."
      fallback={
        <>
          <p>
            <strong>TABITO</strong> (Tanganyika e-Bridge International Tours) est une agence de
            voyages et de promotion touristique basée à Bujumbura, au Burundi. Notre mission est de
            faire connaître et d'aimer le Burundi : ses collines, son lac, sa faune, sa culture et
            surtout ses habitants.
          </p>
          <h2>Ce que nous faisons</h2>
          <ul>
            <li>Conception et organisation de circuits touristiques au Burundi et dans la région.</li>
            <li>Accueil, transport, hébergement et accompagnement des visiteurs.</li>
            <li>Promotion numérique des sites, des villes et des évènements culturels.</li>
            <li>
              Appui aux acteurs locaux du tourisme : guides, artisans, hébergeurs et communautés.
            </li>
          </ul>
          <h2>Notre approche</h2>
          <p>
            Nous croyons à un tourisme responsable, qui profite d'abord aux communautés locales et
            qui protège les écosystèmes fragiles du pays. Chaque circuit est construit avec des
            partenaires burundais, et une part de nos activités est réinvestie dans la formation des
            jeunes professionnels du secteur.
          </p>
        </>
      }
    />
  ),
});
