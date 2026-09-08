import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TeamGroups } from "@/components/site/TeamGroups";
import { useI18n } from "@/lib/i18n";

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
  component: Apropos,
});

function Apropos() {
  const { L } = useI18n();
  return (
    <CmsPage
      slug="apropos"
      title={L("Qui sommes-nous", "Who we are")}
      subtitle={L(
        "Tanganyika e-Bridge International Tours, le pont entre le Burundi et les voyageurs du monde.",
        "Tanganyika e-Bridge International Tours, the bridge between Burundi and travellers from around the world.",
      )}
      fallback={
        <>
          <p>
            <strong>TABITO</strong>{" "}
            {L(
              "(Tanganyika e-Bridge International Tours) est une agence de voyages et de promotion touristique basée à Bujumbura, au Burundi. Notre mission est de faire connaître et d'aimer le Burundi : ses collines, son lac, sa faune, sa culture et surtout ses habitants.",
              "(Tanganyika e-Bridge International Tours) is a travel and tourism promotion agency based in Bujumbura, Burundi. Our mission is to make Burundi known and loved: its hills, its lake, its wildlife, its culture and above all its people.",
            )}
          </p>
          <h2>{L("Ce que nous faisons", "What we do")}</h2>
          <ul>
            <li>
              {L(
                "Conception et organisation de circuits touristiques au Burundi et dans la région.",
                "Design and organisation of tours across Burundi and the region.",
              )}
            </li>
            <li>
              {L(
                "Accueil, transport, hébergement et accompagnement des visiteurs.",
                "Welcoming, transport, accommodation and support for visitors.",
              )}
            </li>
            <li>
              {L(
                "Promotion numérique des sites, des villes et des évènements culturels.",
                "Digital promotion of sites, cities and cultural events.",
              )}
            </li>
            <li>
              {L(
                "Appui aux acteurs locaux du tourisme : guides, artisans, hébergeurs et communautés.",
                "Support for local tourism players: guides, artisans, hosts and communities.",
              )}
            </li>
          </ul>
          <h2>{L("Notre approche", "Our approach")}</h2>
          <p>
            {L(
              "Nous croyons à un tourisme responsable, qui profite d'abord aux communautés locales et qui protège les écosystèmes fragiles du pays. Chaque circuit est construit avec des partenaires burundais, et une part de nos activités est réinvestie dans la formation des jeunes professionnels du secteur.",
              "We believe in responsible tourism that first benefits local communities and protects the country's fragile ecosystems. Every tour is built with Burundian partners, and part of our activities is reinvested in training young professionals in the sector.",
            )}
          </p>
        </>
      }
    >
      <section className="section-y bg-card">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            eyebrow={L("Gouvernance", "Governance")}
            title={L(
              "Conseil d'administration et conseil de direction",
              "Board of Directors and Board of Advisors",
            )}
          />
          <TeamGroups only={["board", "advisors"]} />
        </div>
      </section>
    </CmsPage>
  );
}
