import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

import karera from "@/assets/karera.jpg";
import { PageHero } from "@/components/site/PageHero";
import { SiteLayout } from "@/components/site/SiteLayout";
import { blogQuery } from "@/lib/content";
import { imageOr } from "@/lib/media";

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
    ],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: posts = [], isLoading } = useQuery(blogQuery);
  const post = posts.find((p) => p.slug === slug) ?? posts.find((p) => p.id === slug);

  const date = post?.published_at
    ? new Date(post.published_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <SiteLayout>
      <PageHero
        title={post?.title ?? "Article"}
        subtitle={post?.excerpt ?? undefined}
        image={post?.image_url ? imageOr(post.image_url, karera) : undefined}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <div className="surface-card p-8 lg:p-12">
            <div className="rainbow-bar mb-8 rounded-full" />
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Chargement de l'article…</p>
            ) : !post ? (
              <p className="text-sm text-muted-foreground">
                Cet article n'existe pas ou n'est plus publié.
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
                <div className="prose-tabito mt-6 whitespace-pre-line text-sm lg:text-base">
                  {post.content || post.excerpt}
                </div>
              </>
            )}
            <Link
              to="/blog"
              className="mt-10 inline-flex items-center gap-2 font-display text-sm font-semibold text-accent hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Retour au blog
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
