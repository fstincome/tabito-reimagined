import { z } from "zod";

const imageUrl = z.string().url().refine((url) => /^https?:\/\//.test(url), "Utilisez une URL http ou https.");
export const articleSchema = z.object({
  title: z.string().trim().min(1, "Le titre est obligatoire.").max(1000),
  title_en: z.string().trim().max(1000).default(""),
  slug: z.string().trim().max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "L’adresse doit contenir des lettres minuscules, chiffres et tirets."),
  category: z.string().trim().min(1).max(100),
  author: z.string().trim().max(200).default(""),
  published_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  excerpt: z.string().max(5000).default(""),
  excerpt_en: z.string().max(5000).default(""),
  content: z.string().max(200000).default(""),
  content_en: z.string().max(200000).default(""),
  image_url: z.union([imageUrl, z.literal("")]).nullable(),
  gallery: z.array(z.object({ url: imageUrl, caption: z.string().max(1000).default(""), caption_en: z.string().max(1000).default("") })).default([]),
  published: z.boolean(),
});

export type ArticleValues = z.infer<typeof articleSchema>;
export function articleSlug(title: string) {
  return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 200).replace(/-$/, "");
}
export function categoryArticles<T extends { category: string; published: boolean }>(posts: T[], category: string): T[] {
  return posts.filter((post) => post.published && post.category === category);
}