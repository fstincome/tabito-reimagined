import { useQuery } from "@tanstack/react-query";

import { PageHero } from "@/components/site/PageHero";
import { SiteLayout } from "@/components/site/SiteLayout";
import { pageQuery } from "@/lib/content";
import { isHttpUrl } from "@/lib/media";
import { useI18n } from "@/lib/i18n";

/**
 * Renders an editable page (managed from the dashboard) identified by slug.
 * `fallback` is used until an administrator saves content for that slug.
 */
export function CmsPage({
  slug,
  title,
  subtitle,
  fallback,
}: {
  slug: string;
  title: string;
  subtitle?: string;
  fallback: React.ReactNode;
}) {
  const { tx } = useI18n();
  const { data: page } = useQuery(pageQuery(slug));
  const body = tx(page, "body");

  return (
    <SiteLayout>
      <PageHero
        title={tx(page, "title") || title}
        subtitle={tx(page, "subtitle") || subtitle}
        image={isHttpUrl(page?.hero_image_url) ? (page?.hero_image_url as string) : undefined}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <div className="surface-card p-8 lg:p-12">
            <div className="rainbow-bar mb-8 rounded-full" />
            {body ? (
              <div className="prose-tabito whitespace-pre-line text-sm lg:text-base">
                {body}
              </div>
            ) : (
              <div className="prose-tabito text-sm lg:text-base">{fallback}</div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
