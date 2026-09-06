import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";
import { useI18n } from "@/lib/i18n";

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
  component: Valeurs,
});

function Valeurs() {
  const { L } = useI18n();
  return (
    <CmsPage
      slug="valeurs"
      title={L("Nos valeurs", "Our values")}
      subtitle={L(
        "Ce qui guide chacune de nos décisions et chacun de nos voyages.",
        "What guides every one of our decisions and every one of our journeys.",
      )}
      fallback={
        <>
          <h2>{L("Hospitalité", "Hospitality")}</h2>
          <p>
            {L(
              "L'accueil burundais est notre première richesse. Chaque voyageur est reçu comme un hôte, pas comme un client.",
              "Burundian hospitality is our greatest asset. Every traveller is welcomed as a guest, not just a customer.",
            )}
          </p>
          <h2>{L("Intégrité", "Integrity")}</h2>
          <p>
            {L(
              "Des prix clairs, des engagements tenus, une information honnête sur les conditions de voyage et de sécurité.",
              "Clear pricing, commitments kept, and honest information about travel and safety conditions.",
            )}
          </p>
          <h2>{L("Respect", "Respect")}</h2>
          <p>
            {L(
              "Respect des communautés, de leurs traditions et de leur consentement ; respect des milieux naturels et des espèces protégées.",
              "Respect for communities, their traditions and their consent; respect for natural environments and protected species.",
            )}
          </p>
          <h2>{L("Excellence", "Excellence")}</h2>
          <p>
            {L(
              "Formation continue de nos équipes, exigence sur la qualité du transport, de l'hébergement et du guidage.",
              "Ongoing training of our teams, high standards for transport, accommodation and guiding quality.",
            )}
          </p>
          <h2>{L("Solidarité", "Solidarity")}</h2>
          <p>
            {L(
              "Une part de notre activité soutient les initiatives locales : artisanat, jeunesse, éducation environnementale.",
              "Part of our activity supports local initiatives: crafts, youth and environmental education.",
            )}
          </p>
        </>
      }
    />
  );
}
