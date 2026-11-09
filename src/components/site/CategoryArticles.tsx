import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { blogQuery } from "@/lib/content";
import { categoryArticles } from "@/lib/articles";
import { useI18n } from "@/lib/i18n";
import { imageOr, PLACEHOLDER_IMAGE } from "@/lib/media";

export function CategoryArticles({ category }: { category: string }) {
  const { L, tx } = useI18n();
  const { data: all = [] } = useQuery(blogQuery);
  const posts = categoryArticles(all, category);
  return <section className="section-y bg-background"><div className="mx-auto max-w-[95%] px-6">
    <h2 className="font-display text-3xl font-semibold text-primary">{L("Articles SMED LAB", "SMED LAB articles")}</h2>
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.id} className="surface-card overflow-hidden">
      {post.image_url && <img src={imageOr(post.image_url, PLACEHOLDER_IMAGE)} alt={tx(post, "title")} loading="lazy" className="h-52 w-full object-cover" />}
      <div className="p-6"><h3 className="font-display text-lg font-semibold text-primary">{tx(post, "title")}</h3><p className="mt-3 line-clamp-4 text-sm text-muted-foreground">{tx(post, "excerpt")}</p><Link to="/blog/$slug" params={{ slug: post.slug || post.id }} className="mt-4 inline-flex font-semibold text-accent hover:underline">{L("Lire l’article", "Read article")}</Link></div>
    </article>)}</div>
  </div></section>;
}