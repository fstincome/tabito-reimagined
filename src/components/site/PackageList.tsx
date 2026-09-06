import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Check } from "lucide-react";

import kibira from "@/assets/hero-kibira.jpg";
import { CmsPageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { packagesQuery } from "@/lib/content";
import { imageOr } from "@/lib/media";

export function PackageList({
  mode,
  title,
  subtitle,
  eyebrow,
  heading,
  description,
  empty,
  heroImage,
}: {
  mode: "circuit" | "bouquet";
  title: string;
  subtitle: string;
  eyebrow: string;
  heading: string;
  description: string;
  empty: string;
  heroImage?: string;
}) {
  const { data: packages = [], isLoading } = useQuery(packagesQuery);
  const items = packages.filter((p) =>
    mode === "bouquet" ? p.type === "bouquet" : p.type !== "bouquet",
  );

  return (
    <SiteLayout>
      <PageHero title={title} subtitle={subtitle} image={heroImage} />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading eyebrow={eyebrow} title={heading} description={description} />
          {isLoading ? (
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">{empty}</p>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => {
                const highlights = Array.isArray(p.highlights) ? (p.highlights as string[]) : [];
                return (
                  <article key={p.id} className="hover-lift surface-card flex flex-col overflow-hidden">
                    <img
                      src={imageOr(p.image_url, kibira)}
                      alt={p.title}
                      width={1200}
                      height={800}
                      loading="lazy"
                      className="h-52 w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      {p.duration && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays className="size-3.5" aria-hidden="true" />
                          {p.duration}
                        </p>
                      )}
                      <h3 className="mt-2 font-display text-lg font-semibold text-primary">
                        {p.title}
                      </h3>
                      {p.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {p.description}
                        </p>
                      )}
                      {highlights.length > 0 && (
                        <ul className="mt-4 space-y-1.5">
                          {highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 text-sm">
                              <Check className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto pt-6">
                        {p.price && (
                          <p className="font-display text-xl font-semibold text-accent">{p.price}</p>
                        )}
                        <Button asChild className="mt-3 w-full" variant="hero">
                          <Link to="/contacts">Demander un devis</Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
