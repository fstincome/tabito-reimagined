import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";
import { useI18n } from "@/lib/i18n";

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
  component: Mission,
});

function Mission() {
  const { L } = useI18n();
  return (
    <CmsPage
      slug="mission"
      title={L("Notre mission", "Our mission")}
      subtitle={L(
        "Faire du tourisme un moteur de développement pour le Burundi.",
        "Making tourism a driver of development for Burundi.",
      )}
      fallback={
        <>
          <p>
            {L(
              "TABITO a pour mission de",
              "TABITO's mission is to",
            )}{" "}
            <strong>{L("promouvoir la destination Burundi", "promote Burundi as a destination")}</strong>{" "}
            {L(
              "et de faciliter l'accès des voyageurs aux richesses du pays, tout en garantissant un impact positif pour les communautés d'accueil.",
              "and to make it easier for travellers to access the country's riches, while ensuring a positive impact for host communities.",
            )}
          </p>
          <h2>{L("Nos axes de mission", "Our mission areas")}</h2>
          <ul>
            <li>
              {L(
                "Structurer une offre touristique lisible, fiable et de qualité.",
                "Structure a clear, reliable and high-quality tourism offer.",
              )}
            </li>
            <li>
              {L(
                "Digitaliser l'information touristique : sites, cartes, circuits, évènements.",
                "Digitalise tourism information: sites, maps, tours, events.",
              )}
            </li>
            <li>
              {L(
                "Créer des emplois durables pour les jeunes et les femmes du secteur.",
                "Create sustainable jobs for young people and women in the sector.",
              )}
            </li>
            <li>
              {L(
                "Protéger et valoriser le patrimoine naturel et culturel burundais.",
                "Protect and promote Burundi's natural and cultural heritage.",
              )}
            </li>
            <li>
              {L(
                "Faciliter la coopération régionale autour du lac Tanganyika.",
                "Facilitate regional cooperation around Lake Tanganyika.",
              )}
            </li>
          </ul>
        </>
      }
    />
  );
}
