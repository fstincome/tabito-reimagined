import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";

import karera from "@/assets/karera.jpg";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { galleryQuery } from "@/lib/content";
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
  const { data: images = [] } = useQuery(galleryQuery);
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState("Tous");

  const categories = [
    "Tous",
    ...Array.from(new Set(images.map((i) => i.categorie).filter(Boolean) as string[])),
  ];
  const visible = filter === "Tous" ? images : images.filter((i) => i.categorie === filter);

  return (
    <SiteLayout>
      <PageHero
        title="Galerie"
        subtitle="Un aperçu de ce que vous verrez : collines, lac, faune, traditions et villes."
        image={karera}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading eyebrow="Images" title="Le Burundi en photos" />

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
              Les photos seront ajoutées prochainement depuis le tableau de bord.
            </p>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActive(imageOr(img.image_url, karera))}
                  className="hover-lift group block overflow-hidden rounded-2xl"
                >
                  <img
                    src={imageOr(img.image_url, karera)}
                    alt={img.title ?? "Photo du Burundi"}
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
          aria-label="Photo agrandie"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[oklch(0.19_0.05_262/0.92)] p-6"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Fermer"
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
