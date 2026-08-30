import { createFileRoute } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";

export const Route = createFileRoute("/villes")({
  head: () => ({
    meta: [
      { title: "Villes du Burundi à visiter — TABITO" },
      {
        name: "description",
        content:
          "Bujumbura, Gitega, Ngozi, Rumonge, Makamba : découvrez les villes du Burundi, leurs atouts et leurs attractions touristiques.",
      },
      { property: "og:title", content: "Villes du Burundi à visiter — TABITO" },
      {
        property: "og:description",
        content: "Guide des principales villes burundaises et de leurs attractions.",
      },
    ],
  }),
  component: () => (
    <CmsPage
      slug="villes"
      title="Villes du Burundi"
      subtitle="Des rives du lac Tanganyika aux collines du centre, chaque ville a son caractère."
      fallback={
        <>
          <h2>Bujumbura</h2>
          <p>
            Capitale économique, posée sur les rives du lac Tanganyika : plages de Saga, marché
            central, musée vivant, vie nocturne et couchers de soleil sur les monts de la RDC.
          </p>
          <h2>Gitega</h2>
          <p>
            Capitale politique au cœur du pays, berceau du tambour sacré. Le musée national et les
            sites royaux racontent l'histoire du royaume du Burundi.
          </p>
          <h2>Ngozi</h2>
          <p>
            Ville du nord entourée de plantations de café et de thé, point de départ vers le parc de
            la Kibira et les sources thermales de la région.
          </p>
          <h2>Rumonge</h2>
          <p>
            Ville de pêcheurs au sud de Bujumbura : palmeraies, plages, sanctuaire de Vyanda et
            source chaude de Mugara.
          </p>
          <h2>Makamba, Rutana et Bururi</h2>
          <p>
            Le grand sud touristique : chutes de la Karera, faille de Nyakazu (« la brèche des
            Allemands »), réserves forestières et paysages de collines.
          </p>
          <p>
            Chaque ville peut être combinée dans un circuit sur mesure. Contactez-nous pour composer
            votre itinéraire.
          </p>
        </>
      }
    />
  ),
});
