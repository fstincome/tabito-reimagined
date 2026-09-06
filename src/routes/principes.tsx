import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";
import { useI18n } from "@/lib/i18n";

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
  component: Principes,
});

function Principes() {
  const { L } = useI18n();
  return (
    <CmsPage
      slug="principes"
      title={L("Nos principes", "Our principles")}
      subtitle={L(
        "Des règles simples appliquées à tous nos séjours.",
        "Simple rules applied to all our stays.",
      )}
      fallback={
        <>
          <ol>
            <li>
              <strong>{L("Sécurité d'abord", "Safety first")}</strong>{" "}
              {L(
                "— évaluation des itinéraires, kits de premiers secours, contacts d'urgence pour chaque circuit.",
                "— route assessment, first-aid kits and emergency contacts for every tour.",
              )}
            </li>
            <li>
              <strong>{L("Transparence des prix", "Transparent pricing")}</strong>{" "}
              {L(
                "— ce qui est inclus et ce qui ne l'est pas est écrit noir sur blanc.",
                "— what is included and what is not is stated in black and white.",
              )}
            </li>
            <li>
              <strong>{L("Priorité au local", "Local priority")}</strong>{" "}
              {L(
                "— guides, hébergeurs, restaurateurs et artisans burundais.",
                "— Burundian guides, hosts, restaurateurs and artisans.",
              )}
            </li>
            <li>
              <strong>{L("Empreinte minimale", "Minimal footprint")}</strong>{" "}
              {L(
                "— groupes de taille réduite, gestion des déchets, sensibilisation des visiteurs.",
                "— small group sizes, waste management, visitor awareness.",
              )}
            </li>
            <li>
              <strong>{L("Consentement des communautés", "Community consent")}</strong>{" "}
              {L(
                "— aucune visite de village ou de site sacré sans accord préalable.",
                "— no visit to a village or sacred site without prior agreement.",
              )}
            </li>
            <li>
              <strong>{L("Amélioration continue", "Continuous improvement")}</strong>{" "}
              {L(
                "— chaque voyage se termine par un retour d'expérience exploité par nos équipes.",
                "— every trip ends with feedback that our teams use to improve.",
              )}
            </li>
          </ol>
        </>
      }
    />
  );
}
