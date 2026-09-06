import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";
import { useI18n } from "@/lib/i18n";

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
  component: Vision,
});

function Vision() {
  const { L } = useI18n();
  return (
    <CmsPage
      slug="vision"
      title={L("Notre vision", "Our vision")}
      subtitle={L(
        "Un Burundi reconnu comme destination incontournable de l'Afrique des Grands Lacs.",
        "A Burundi recognised as a must-visit destination in the African Great Lakes region.",
      )}
      fallback={
        <>
          <p>
            {L(
              "Nous voulons voir le Burundi figurer parmi les",
              "We want to see Burundi ranked among the",
            )}{" "}
            <strong>{L("destinations phares", "leading destinations")}</strong>{" "}
            {L(
              "de l'Afrique de l'Est : un pays où le voyageur trouve facilement l'information, où les services sont professionnels et où chaque visite bénéficie aux populations locales.",
              "of East Africa: a country where travellers easily find information, where services are professional and where every visit benefits local populations.",
            )}
          </p>
          <h2>{L("À l'horizon", "On the horizon")}</h2>
          <ul>
            <li>
              {L(
                "Une plateforme numérique de référence pour le tourisme burundais.",
                "A leading digital platform for Burundian tourism.",
              )}
            </li>
            <li>
              {L(
                "Un réseau national de guides et d'opérateurs certifiés.",
                "A national network of certified guides and operators.",
              )}
            </li>
            <li>
              {L(
                "Des circuits transfrontaliers autour du lac Tanganyika.",
                "Cross-border tours around Lake Tanganyika.",
              )}
            </li>
            <li>
              {L(
                "Un tourisme sobre en carbone et respectueux des milieux naturels.",
                "Low-carbon tourism that respects natural environments.",
              )}
            </li>
          </ul>
        </>
      }
    />
  );
}
