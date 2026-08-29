import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";

export const Route = createFileRoute("/principes")({
  head: () => ({
    meta: [
      { title: "Nos principes — TABITO" },
      {
        name: "description",
        content:
          "Les principes d'action de TABITO : transparence, sécurité des voyageurs, retombées locales et tourisme durable au Burundi.",
      },
      { property: "og:title", content: "Nos principes — TABITO" },
      {
        property: "og:description",
        content: "Transparence, sécurité, retombées locales et durabilité.",
      },
    ],
  }),
  component: () => (
    <CmsPage
      slug="principes"
      title="Nos principes"
      subtitle="Des règles simples appliquées à tous nos séjours."
      fallback={
        <>
          <ol>
            <li>
              <strong>Sécurité d'abord</strong> — évaluation des itinéraires, kits de premiers
              secours, contacts d'urgence pour chaque circuit.
            </li>
            <li>
              <strong>Transparence des prix</strong> — ce qui est inclus et ce qui ne l'est pas est
              écrit noir sur blanc.
            </li>
            <li>
              <strong>Priorité au local</strong> — guides, hébergeurs, restaurateurs et artisans
              burundais.
            </li>
            <li>
              <strong>Empreinte minimale</strong> — groupes de taille réduite, gestion des déchets,
              sensibilisation des visiteurs.
            </li>
            <li>
              <strong>Consentement des communautés</strong> — aucune visite de village ou de site
              sacré sans accord préalable.
            </li>
            <li>
              <strong>Amélioration continue</strong> — chaque voyage se termine par un retour
              d'expérience exploité par nos équipes.
            </li>
          </ol>
        </>
      }
    />
  ),
});
