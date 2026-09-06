import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";

import { CmsPageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { galleryQuery } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { imageOr } from "@/lib/media";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie photos du Burundi — TABITO" },
      {
        name: "description",
        content:
          "Photos des paysages, de la faune, des villes et des traditions du Burundi prises lors de nos circuits.",
      },
      { property: "og:title", content: "Galerie photos du Burundi — TABITO" },
      { property: "og:description", content: "Le Burundi en images, par TABITO." },
    ],
  }),
  component: Galerie,
});

function Galerie() {
  const { L, tx } = useI18n();
  const { data: images = [] } = useQuery(galleryQuery);
  const [active, setActive] = useState<string | null>(null);
  const allLabel = L("Tous", "All");
  const [filter, setFilter] = useState(allLabel);

  const categories = [
    allLabel,
    ...Array.from(new Set(images.map((i) => i.categorie).filter(Boolean) as string[])),
  ];
  const visible = filter === allLabel ? images : images.filter((i) => i.categorie === filter);

  return (
    <SiteLayout>
      <CmsPageHero slug="galerie"
        title={L("Galerie", "Gallery")}
        subtitle={L(
          "Un aperçu de ce que vous verrez : collines, lac, faune, traditions et villes.",
          "A preview of what you'll see: hills, lake, wildlife, traditions and cities.",
        )}
        image={PLACEHOLDER_IMAGE}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading eyebrow={L("Images", "Images")} title={L("Le Burundi en photos", "Burundi in pictures")} />

          {categories.length > 1 && (
            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-4 py-2 font-display text-sm font-medium transition-colors ${
                    filter === c
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {visible.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              {L(
                "Les photos seront ajoutées prochainement depuis le tableau de bord.",
                "Photos will be added soon from the dashboard.",
              )}
            </p>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActive(imageOr(img.image_url, PLACEHOLDER_IMAGE))}
                  className="hover-lift group block overflow-hidden rounded-2xl"
                >
                  <img
                    src={imageOr(img.image_url, PLACEHOLDER_IMAGE)}
                    alt={tx(img, "title") || L("Photo du Burundi", "Photo of Burundi")}
                    width={1200}
                    height={900}
                    loading="lazy"
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <div
          role="dialog"
          aria-label={L("Photo agrandie", "Enlarged photo")}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[oklch(0.19_0.05_262/0.92)] p-6"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label={L("Fermer", "Close")}
            onClick={() => setActive(null)}
            className="absolute right-6 top-6 text-primary-foreground"
          >
            <X className="size-7" />
          </button>
          <img src={active} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </SiteLayout>
  );
}
