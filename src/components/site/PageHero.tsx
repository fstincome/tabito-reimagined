import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { pageQuery } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { isHttpUrl } from "@/lib/media";

export function PageHero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string | undefined;
  image?: string | undefined;
}) {
  const { L } = useI18n();

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={image ?? PLACEHOLDER_IMAGE}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 gradient-lagoon opacity-80" />
      <div className="relative mx-auto max-w-[95%] px-6 py-20 text-primary-foreground lg:py-28">
        <h1 className="rainbow-underline text-4xl font-bold lg:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-8 max-w-2xl text-sm text-primary-foreground/85 lg:text-base">
            {subtitle}
          </p>
        )}
        <nav
          aria-label={L("Fil d'ariane", "Breadcrumb")}
          className="mt-6 flex items-center gap-2 text-xs text-primary-foreground/80"
        >
          <Link to="/" className="hover:text-primary-foreground">
            {L("Accueil", "Home")}
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="font-medium text-primary-foreground">{title}</span>
        </nav>
      </div>
    </section>
  );
}

/**
 * PageHero whose title, subtitle and background image can be overridden
 * from the dashboard (rubrique « Pages », champ « Image d'entête »).
 */
export function CmsPageHero({
  slug,
  title,
  subtitle,
  image,
}: {
  slug: string;
  title: string;
  subtitle?: string | undefined;
  image?: string | undefined;
}) {
  const { tx } = useI18n();
  const { data: page } = useQuery(pageQuery(slug));
  return (
    <PageHero
      title={tx(page, "title") || title}
      subtitle={tx(page, "subtitle") || subtitle}
      image={isHttpUrl(page?.hero_image_url) ? (page?.hero_image_url as string) : image}
    />
  );
}
