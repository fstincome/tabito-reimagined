import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";
import { useI18n } from "@/lib/i18n";

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
  component: SmedLab,
});

function SmedLab() {
  const { L } = useI18n();
  return (
    <CmsPage
      slug="smedlab"
      title="SMED LAB"
      subtitle={L(
        "Le laboratoire d'innovation et de développement des métiers du tourisme.",
        "The innovation and development lab for tourism professions.",
      )}
      fallback={
        <>
          <p>
            <strong>SMED LAB</strong>{" "}
            {L(
              "est l'espace d'expérimentation de TABITO consacré au développement des micro, petites et moyennes entreprises du tourisme et de l'économie créative au Burundi.",
              "is TABITO's experimentation space dedicated to developing micro, small and medium-sized enterprises in tourism and the creative economy in Burundi.",
            )}
          </p>
          <h2>{L("Nos programmes", "Our programmes")}</h2>
          <ul>
            <li>
              {L(
                "Formations courtes : accueil, guidage, hygiène, langues, gestion.",
                "Short trainings: hospitality, guiding, hygiene, languages, management.",
              )}
            </li>
            <li>
              {L(
                "Accompagnement à la structuration d'offres touristiques locales.",
                "Support in structuring local tourism offers.",
              )}
            </li>
            <li>
              {L(
                "Appui au numérique : présence en ligne, réservation, paiement.",
                "Digital support: online presence, booking, payment.",
              )}
            </li>
            <li>
              {L(
                "Mise en relation avec les financements et les partenaires techniques.",
                "Connecting with funding and technical partners.",
              )}
            </li>
          </ul>
          <h2>{L("Pour qui ?", "Who is it for?")}</h2>
          <p>
            {L(
              "Guides indépendants, hébergeurs, restaurateurs, artisans, coopératives et jeunes entrepreneurs souhaitant se professionnaliser dans le tourisme.",
              "Independent guides, hosts, restaurateurs, artisans, cooperatives and young entrepreneurs wishing to professionalise in tourism.",
            )}
          </p>
        </>
      }
    />
  );
}
