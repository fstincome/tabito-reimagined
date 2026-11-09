import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { SiteLayout } from "@/components/site/SiteLayout";
import { blogQuery } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { PLACEHOLDER_IMAGE, imageOr } from "@/lib/media";
import { ArticleBody } from "@/components/site/ArticleBody";
import { ArticleGallery } from "@/components/site/ArticleGallery";
import { articleSchema } from "@/lib/articles";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Article — Blog TABITO" },
      {
        name: "description",
        content: "Article du blog TABITO sur le tourisme, la culture et les voyages au Burundi.",
      },
      { property: "og:title", content: "Article — Blog TABITO" },
      {
        property: "og:description",
        content: "Article du blog TABITO sur le tourisme au Burundi.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { L, tx, lang } = useI18n();
  const { slug } = Route.useParams();
  const { data: posts = [], isLoading } = useQuery(blogQuery);
  const post = posts.find((p) => p.slug === slug) ?? posts.find((p) => p.id === slug);

  const date = post?.published_at
    ? new Date(post.published_at).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <SiteLayout>
      <PageHero
        title={post ? tx(post, "title") : L("Article", "Article")}
        subtitle={post ? tx(post, "excerpt") || undefined : undefined}
        image={post?.image_url ? imageOr(post.image_url, PLACEHOLDER_IMAGE) : undefined}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <div className="surface-card p-8 lg:p-12">
            <div className="rainbow-bar mb-8 rounded-full" />
            {isLoading ? (
              <p className="text-sm text-muted-foreground">{L("Chargement de l'article…", "Loading the article…")}</p>
            ) : !post ? (
              <p className="text-sm text-muted-foreground">
                {L(
                  "Cet article n'existe pas ou n'est plus publié.",
                  "This article does not exist or is no longer published.",
                )}
              </p>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  {date && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {date}
                    </span>
                  )}
                  {post.author && (
                    <span className="inline-flex items-center gap-1.5">
                      <User className="size-3.5" aria-hidden="true" />
                      {post.author}
                    </span>
                  )}
                </div>
                <div className="mt-6"><ArticleBody content={tx(post, "content") || tx(post, "excerpt")} /></div>
                <ArticleGallery images={articleSchema.shape.gallery.safeParse(post.gallery).data || []} />
              </>
            )}
            <Link
              to={post?.category === "smedlab" ? "/smedlab" : "/blog"}
              className="mt-10 inline-flex items-center gap-2 font-display text-sm font-semibold text-accent hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {post?.category === "smedlab" ? L("Retour à SMED LAB", "Back to SMED LAB") : L("Retour au blog", "Back to blog")}
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
