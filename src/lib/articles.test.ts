import { test } from "node:test";
import { strict as assert } from "node:assert";
import { articleSchema, categoryArticles } from "./articles";

test("SMED LAB imports only published articles in its category", () => {
  const posts = [{ category: "smedlab", published: true, id: 1 }, { category: "actualites", published: true, id: 2 }, { category: "smedlab", published: false, id: 3 }];
  assert.deepEqual(categoryArticles(posts, "smedlab").map((post) => post.id), [1]);
});
test("articles preserve cover, inline photos and optional gallery", () => {
  const values = articleSchema.parse({ title: "Article", slug: "article", category: "smedlab", published: true, published_at: "2026-11-09", image_url: "https://example.org/cover.jpg", content: "Texte\n\n![Photo](https://example.org/inline.jpg)", gallery: [{ url: "https://example.org/gallery.jpg", caption: "Lac" }] });
  assert.equal(values.image_url, "https://example.org/cover.jpg");
  assert.equal(values.content, "Texte\n\n![Photo](https://example.org/inline.jpg)");
  assert.equal(values.gallery[0]?.url, "https://example.org/gallery.jpg");
  assert.deepEqual(articleSchema.parse({ ...values, gallery: [] }).gallery, []);
});
test("unsafe gallery URLs are rejected", () => {
  assert.equal(articleSchema.safeParse({ title: "Article", slug: "article", category: "smedlab", published: true, published_at: null, image_url: null, gallery: [{ url: "javascript:alert(1)" }] }).success, false);
});