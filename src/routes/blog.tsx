import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, User } from "lucide-react";

import karera from "@/assets/karera.jpg";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { blogQuery } from "@/lib/content";
import { imageOr } from "@/lib/media";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog TABITO — Actualités du tourisme au Burundi" },
      {
        name: "description",
        content:
          "Articles, conseils de voyage et actualités du tourisme burundais publiés par l'équipe TABITO.",
      },
      { property: "og:title", content: "Blog TABITO — Actualités du tourisme au Burundi" },
      {
        property: "og:description",
        content: "Récits de voyage, conseils pratiques et actualités du tourisme au Burundi.",
      },
    ],
  }),
  component: Blog,
});

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Blog() {
  const { data: posts = [] } = useQuery(blogQuery);

  return (
    <SiteLayout>
      <PageHero
        title="Blog"
        subtitle="Nos récits, conseils pratiques et actualités sur le tourisme au Burundi."
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Actualités" title="Derniers articles" />

          {posts.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              Les articles seront publiés prochainement depuis le tableau de bord.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="surface-card hover-lift overflow-hidden">
                  <img
                    src={imageOr(post.image_url, karera)}
                    alt={post.title}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="h-52 w-full object-cover"
                  />
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      {formatDate(post.published_at) && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" aria-hidden="true" />
                          {formatDate(post.published_at)}
                        </span>
                      )}
                      {post.author && (
                        <span className="inline-flex items-center gap-1.5">
                          <User className="size-3.5" aria-hidden="true" />
                          {post.author}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 font-display text-lg font-semibold text-primary">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug || post.id }}
                      className="mt-4 inline-flex font-display text-sm font-semibold text-accent hover:underline"
                    >
                      Lire l'article
                    </Link>
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
