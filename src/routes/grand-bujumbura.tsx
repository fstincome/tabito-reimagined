import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Check } from "lucide-react";

import { CmsPage } from "@/components/site/CmsPage";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { packagesQuery } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { PLACEHOLDER_IMAGE, imageOr } from "@/lib/media";

const FLAGSHIP = ["Le Tour de la Ville BUJA"];

export const Route = createFileRoute("/grand-bujumbura")({
  head: () => ({
    meta: [
      { title: "Destination du Grand Bujumbura — TABITO" },
      {
        name: "description",
        content:
          "Bujumbura Great City Destination : plages du lac Tanganyika, patrimoine urbain, marchés et le circuit phare Le Tour de la Ville BUJA.",
      },
      { property: "og:title", content: "Destination du Grand Bujumbura — TABITO" },
      {
        property: "og:description",
        content: "Découvrez la Destination du Grand Bujumbura et le circuit Le Tour de la Ville BUJA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GrandBujumbura,
});

function GrandBujumbura() {
  const { L, tx, tlist } = useI18n();
  const { data: packages = [] } = useQuery(packagesQuery);
  const tours = packages.filter((p) => FLAGSHIP.includes(p.title));

  return (
    <CmsPage
      slug="grand-bujumbura"
      title={L("Destination du Grand Bujumbura", "Bujumbura Great City Destination")}
      subtitle={L(
        "Bujumbura et sa région : plages, littoral, patrimoine urbain et évènements.",
        "Bujumbura and its region: beaches, lakeshore, urban heritage and events.",
      )}
      fallback={
        <p>
          {L(
            "La Destination du Grand Bujumbura rassemble la ville de Bujumbura et ses environs : les plages du lac Tanganyika, les marchés, les quartiers historiques et un agenda régulier d'évènements touristiques et culturels.",
            "The Bujumbura Great City Destination brings together the city of Bujumbura and its surroundings: Lake Tanganyika beaches, markets, historic districts and a regular calendar of tourism and cultural events.",
          )}
        </p>
      }
    >
      {tours.length > 0 && (
        <section className="section-y bg-card">
          <div className="mx-auto max-w-[95%] px-6">
            <SectionHeading
              eyebrow={L("Circuit phare", "Flagship tour")}
              title={L("Le Tour de la Ville BUJA", "BUJA City Tour")}
              description={L(
                "Notre produit vedette dans la Destination du Grand Bujumbura.",
                "Our signature product in the Bujumbura Great City Destination.",
              )}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {tours.map((p) => (
                <article key={p.id} className="hover-lift surface-card overflow-hidden">
                  <img
                    src={imageOr(p.image_url, PLACEHOLDER_IMAGE)}
                    alt={tx(p, "title")}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {tx(p, "title")}
                    </h3>
                    {tx(p, "duration") && (
                      <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="size-4" aria-hidden="true" />
                        {tx(p, "duration")}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-muted-foreground">{tx(p, "description")}</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {tlist(p, "highlights").map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="lagoon" className="mt-6">
                      <Link to="/reservation">{L("Réserver ce circuit", "Book this tour")}</Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </CmsPage>
  );
}
