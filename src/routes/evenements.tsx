import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";

import karera from "@/assets/karera.jpg";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { eventsQuery } from "@/lib/content";
import { imageOr } from "@/lib/media";

export const Route = createFileRoute("/evenements")({
  head: () => ({
    meta: [
      { title: "Évènements touristiques et culturels au Burundi — TABITO" },
      {
        name: "description",
        content:
          "Agenda des évènements culturels, festivals et rencontres touristiques organisés ou couverts par TABITO au Burundi.",
      },
      { property: "og:title", content: "Évènements au Burundi — TABITO" },
      {
        property: "og:description",
        content: "Festivals, expositions et rencontres à ne pas manquer au Burundi.",
      },
    ],
  }),
  component: Evenements,
});

function fmt(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Evenements() {
  const { data: events = [] } = useQuery(eventsQuery);

  return (
    <SiteLayout>
      <PageHero
        title="Évènements"
        subtitle="Festivals, expositions, rencontres professionnelles et célébrations culturelles."
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Agenda" title="Prochains et derniers évènements" />

          {events.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              L'agenda sera alimenté prochainement depuis le tableau de bord.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {events.map((ev) => (
                <article
                  key={ev.id}
                  className="surface-card hover-lift flex flex-col overflow-hidden sm:flex-row"
                >
                  <img
                    src={imageOr(ev.image_url, karera)}
                    alt={ev.title}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="h-48 w-full object-cover sm:h-auto sm:w-44"
                  />
                  <div className="flex-1 p-6">
                    <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-secondary-foreground">
                      {ev.status}
                    </span>
                    <h2 className="mt-3 font-display text-lg font-semibold text-primary">
                      {ev.title}
                    </h2>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {fmt(ev.start_date) && (
                        <p className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" aria-hidden="true" />
                          {fmt(ev.start_date)}
                          {fmt(ev.end_date) ? ` — ${fmt(ev.end_date)}` : ""}
                        </p>
                      )}
                      {ev.place && (
                        <p className="flex items-center gap-1.5">
                          <MapPin className="size-3.5" aria-hidden="true" />
                          {ev.place}
                        </p>
                      )}
                    </div>
                    {ev.description && (
                      <p className="mt-3 text-sm text-muted-foreground">{ev.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
