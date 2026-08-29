import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";

export const Route = createFileRoute("/valeurs")({
  head: () => ({
    meta: [
      { title: "Nos valeurs — TABITO" },
      {
        name: "description",
        content:
          "Hospitalité, intégrité, respect de la nature et des cultures : les valeurs qui guident l'agence TABITO au Burundi.",
      },
      { property: "og:title", content: "Nos valeurs — TABITO" },
      {
        property: "og:description",
        content: "Hospitalité, intégrité, durabilité : les valeurs de TABITO.",
      },
    ],
  }),
  component: () => (
    <CmsPage
      slug="valeurs"
      title="Nos valeurs"
      subtitle="Ce qui guide chacune de nos décisions et chacun de nos voyages."
      fallback={
        <>
          <h2>Hospitalité</h2>
          <p>
            L'accueil burundais est notre première richesse. Chaque voyageur est reçu comme un hôte,
            pas comme un client.
          </p>
          <h2>Intégrité</h2>
          <p>
            Des prix clairs, des engagements tenus, une information honnête sur les conditions de
            voyage et de sécurité.
          </p>
          <h2>Respect</h2>
          <p>
            Respect des communautés, de leurs traditions et de leur consentement ; respect des
            milieux naturels et des espèces protégées.
          </p>
          <h2>Excellence</h2>
          <p>
            Formation continue de nos équipes, exigence sur la qualité du transport, de
            l'hébergement et du guidage.
          </p>
          <h2>Solidarité</h2>
          <p>
            Une part de notre activité soutient les initiatives locales : artisanat, jeunesse,
            éducation environnementale.
          </p>
        </>
      }
    />
  ),
});
