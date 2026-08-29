import { useQuery } from "@tanstack/react-query";
import { CalendarClock, Download, ExternalLink } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { opportunitiesQuery } from "@/lib/content";

export function OpportunityList({
  kind,
  title,
  subtitle,
  eyebrow,
  heading,
  empty,
}: {
  kind: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  heading: string;
  empty: string;
}) {
  const { data: items = [], isLoading } = useQuery(opportunitiesQuery(kind));

  return (
    <SiteLayout>
      <PageHero title={title} subtitle={subtitle} />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading eyebrow={eyebrow} title={heading} />
          {isLoading ? (
            <div className="mt-14 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">{empty}</p>
          ) : (
            <div className="mt-14 space-y-5">
              {items.map((o) => (
                <article key={o.id} className="hover-lift surface-card p-7">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {o.organisation && (
                      <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-primary">
                        {o.organisation}
                      </span>
                    )}
                    {o.deadline && (
                      <span className="flex items-center gap-1.5 text-coral">
                        <CalendarClock className="size-3.5" aria-hidden="true" />
                        Échéance :{" "}
                        {new Date(o.deadline).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-primary">
                    {o.title}
                  </h3>
                  {o.description && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {o.description}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
                    {o.link && (
                      <a
                        href={o.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-accent"
                      >
                        Postuler / en savoir plus{" "}
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </a>
                    )}
                    {o.file_url && (
                      <a
                        href={o.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary"
                      >
                        Télécharger le document{" "}
                        <Download className="size-3.5" aria-hidden="true" />
                      </a>
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
