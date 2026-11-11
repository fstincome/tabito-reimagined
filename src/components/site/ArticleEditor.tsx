import { useRef, useState } from "react";
import { Bold, Heading2, ImagePlus, Italic, Link2, Save, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { articleSchema, articleSlug, type ArticleValues } from "@/lib/articles";
import { registerGalleryImage, uploadMedia } from "@/lib/media";
import { ArticleBody } from "./ArticleBody";
import { ArticleGallery } from "./ArticleGallery";
import { GalleryPicker } from "./GalleryPicker";

export function ArticleEditor({ id, initial, onClose, onSaved }: { id: string | null; initial: Record<string, unknown>; onClose: () => void; onSaved: () => Promise<void> }) {
  const queryClient = useQueryClient();
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [values, setValues] = useState<ArticleValues>(() => ({
    title: String(initial["title"] ?? ""), title_en: String(initial["title_en"] ?? ""),
    slug: String(initial["slug"] ?? ""), category: String(initial["category"] || "actualites"), author: String(initial["author"] ?? ""),
    published_at: String(initial["published_at"] || new Date().toISOString().slice(0, 10)),
    excerpt: String(initial["excerpt"] ?? ""), excerpt_en: String(initial["excerpt_en"] ?? ""),
    content: String(initial["content"] ?? ""), content_en: String(initial["content_en"] ?? ""),
    image_url: typeof initial["image_url"] === "string" ? initial["image_url"] : "",
    gallery: Array.isArray(initial["gallery"]) ? initial["gallery"] as ArticleValues["gallery"] : [], published: initial["published"] !== false,
  }));
  const textField = lang === "en" ? "content_en" : "content";
  const titleField = lang === "en" ? "title_en" : "title";
  const excerptField = lang === "en" ? "excerpt_en" : "excerpt";
  function set<K extends keyof ArticleValues>(key: K, value: ArticleValues[K]) { setValues((old) => ({ ...old, [key]: value })); }
  function insert(before: string, after = "", fallback = "") {
    const el = textarea.current;
    const start = el?.selectionStart ?? values[textField].length;
    const end = el?.selectionEnd ?? start;
    setValues((old) => ({ ...old, [textField]: old[textField].slice(0, start) + before + (old[textField].slice(start, end) || fallback) + after + old[textField].slice(end) }));
  }
  async function images(files: FileList | null, target: "cover" | "inline" | "gallery") {
    if (!files?.length) return;
    const position = textarea.current?.selectionStart ?? values[textField].length;
    setBusy(true);
    try {
      const urls: { url: string; caption: string; caption_en: string }[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) throw new Error("Choisissez un fichier image.");
        const url = await uploadMedia(file, "articles");
        await registerGalleryImage(url, values.category === "smedlab" ? "SMED LAB" : "Articles", values.title);
        urls.push({ url, caption: "", caption_en: "" });
      }
      if (target === "cover") set("image_url", urls[0]?.url ?? "");
      if (target === "gallery") setValues((old) => ({ ...old, gallery: [...old.gallery, ...urls] }));
      if (target === "inline") setValues((old) => ({ ...old, [textField]: old[textField].slice(0, position) + urls.map((image) => `\n\n![Photo](${image.url})\n\n`).join("") + old[textField].slice(position) }));
      toast.success("Photos ajoutées.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Téléversement impossible."); }
    finally { setBusy(false); }
  }
  async function save() {
    const parsed = articleSchema.safeParse({ ...values, slug: values.slug || articleSlug(values.title) });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Vérifiez les champs."); return; }
    setBusy(true);
    try {
      const payload = { ...parsed.data, image_url: parsed.data.image_url || null };
      const result = id ? await supabase.from("blog_posts").update(payload).eq("id", id).select("id").single() : await supabase.from("blog_posts").insert(payload).select("id").single();
      if (result.error) throw result.error;
      await queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
      await onSaved();
      toast.success(values.published ? "Article publié." : "Brouillon enregistré.");
      onClose();
    } catch { toast.error("Enregistrement impossible. Vérifiez l’adresse de l’article et vos droits."); }
    finally { setBusy(false); }
  }
  return <div className="surface-card space-y-6 p-6">
    <div className="flex items-center justify-between gap-4"><h2 className="font-display text-xl font-semibold text-primary">{id ? "Modifier l’article" : "Nouvel article"}</h2><Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer"><X /></Button></div>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Langue de l’article">
      <Button role="tab" aria-selected={lang === "fr"} variant={lang === "fr" ? "secondary" : "ghost"} onClick={() => setLang("fr")}>Français</Button>
      <Button role="tab" aria-selected={lang === "en"} variant={lang === "en" ? "secondary" : "ghost"} onClick={() => setLang("en")}>English</Button>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2"><Label htmlFor="article-title">{lang === "en" ? "Title" : "Titre"}</Label><Input id="article-title" value={values[titleField]} maxLength={1000} onChange={(e) => set(titleField, e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="article-category">Catégorie</Label><Input id="article-category" list="article-categories" value={values.category} maxLength={100} onChange={(e) => set("category", e.target.value)} /><datalist id="article-categories"><option value="smedlab">SMED LAB</option><option value="actualites">Actualités</option></datalist></div>
      <div className="space-y-2"><Label htmlFor="article-slug">Adresse de l’article</Label><Input id="article-slug" value={values.slug} placeholder={articleSlug(values.title)} maxLength={200} onChange={(e) => set("slug", e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="article-author">Auteur</Label><Input id="article-author" value={values.author} onChange={(e) => set("author", e.target.value)} maxLength={200} /></div>
      <div className="space-y-2"><Label htmlFor="article-date">Date de publication</Label><Input type="date" id="article-date" value={values.published_at || ""} onChange={(e) => set("published_at", e.target.value || null)} /></div>
      <div className="space-y-2 md:col-span-2"><Label htmlFor="article-excerpt">{lang === "en" ? "Summary" : "Chapeau"}</Label><Textarea id="article-excerpt" value={values[excerptField]} rows={3} maxLength={5000} onChange={(e) => set(excerptField, e.target.value)} /></div>
    </div>
    <div className="space-y-3"><Label htmlFor="article-cover">Image de couverture</Label><Input id="article-cover" type="url" value={values.image_url || ""} onChange={(e) => set("image_url", e.target.value)} />
      <div className="flex flex-wrap gap-3"><Button variant="outline" disabled={busy} onClick={() => document.getElementById("article-cover-file")?.click()}><Upload className="size-4" />Téléverser la couverture</Button><GalleryPicker disabled={busy} onSelect={(images) => { const image = images[0]; if (image) set("image_url", image.image_url); }} />{values.image_url && <Button variant="ghost" disabled={busy} onClick={() => set("image_url", "")}>Retirer</Button>}</div>
      <input id="article-cover-file" type="file" accept="image/*" className="hidden" onChange={(e) => { void images(e.target.files, "cover"); e.target.value = ""; }} />
      {values.image_url && <img src={values.image_url} alt="Couverture" className="max-h-64 w-full rounded-md bg-muted object-contain" />}
    </div>
    <div className="space-y-3"><Label htmlFor="article-content">{lang === "en" ? "Article content" : "Contenu de l’article"}</Label>
      <div className="flex flex-wrap items-center gap-1 border-b border-border pb-2">
        <Button variant="ghost" size="icon" title="Gras" aria-label="Gras" onClick={() => insert("**", "**", "Texte")}><Bold className="size-4" /></Button>
        <Button variant="ghost" size="icon" title="Italique" aria-label="Italique" onClick={() => insert("*", "*", "Texte")}><Italic className="size-4" /></Button>
        <Button variant="ghost" size="icon" title="Titre de section" aria-label="Titre de section" onClick={() => insert("\n\n## ", "\n\n", "Titre")}><Heading2 className="size-4" /></Button>
        <Button variant="ghost" size="icon" title="Lien" aria-label="Lien" onClick={() => insert("[", "](https://)", "Lien")}><Link2 className="size-4" /></Button>
        <Button variant="ghost" size="icon" title="Insérer une photo" aria-label="Insérer une photo" disabled={busy} onClick={() => { setPreview(false); document.getElementById("article-inline-file")?.click(); }}><ImagePlus className="size-4" /></Button>
        <GalleryPicker disabled={busy} multiple onSelect={(images) => { setPreview(false); insert(images.map((image) => `\n\n![Photo](${image.image_url})\n\n`).join("")); }} />
        <Button variant={preview ? "secondary" : "ghost"} onClick={() => setPreview(!preview)}>{preview ? "Éditer" : "Aperçu"}</Button>
      </div>
      <input id="article-inline-file" type="file" accept="image/*" multiple className="hidden" onChange={(e) => { void images(e.target.files, "inline"); e.target.value = ""; }} />
      {preview ? <ArticleBody content={values[textField]} /> : <Textarea ref={textarea} id="article-content" value={values[textField]} rows={18} maxLength={200000} onChange={(e) => set(textField, e.target.value)} />}
    </div>
    <div className="space-y-4 border-t border-border pt-6"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-lg font-semibold text-primary">Galerie en bas de l’article</h3><Button variant="outline" disabled={busy} onClick={() => document.getElementById("article-gallery-file")?.click()}><ImagePlus className="size-4" />Ajouter des photos</Button></div>
      <input id="article-gallery-file" type="file" multiple accept="image/*" className="hidden" onChange={(e) => { void images(e.target.files, "gallery"); e.target.value = ""; }} />
      <GalleryPicker disabled={busy} multiple onSelect={(images) => setValues((old) => ({ ...old, gallery: [...old.gallery, ...images.filter((image) => !old.gallery.some((item) => item.url === image.image_url)).map((image) => ({ url: image.image_url, caption: image.title || "", caption_en: image.title_en || "" }))] }))} />
      <div className="grid gap-4 sm:grid-cols-2">{values.gallery.map((image, index) => <div key={`${image.url}-${index}`} className="space-y-2"><img src={image.url} alt={image.caption} className="h-40 w-full rounded-md bg-muted object-contain" /><Input aria-label={`Légende photo ${index + 1}`} maxLength={1000} value={(lang === "en" ? image.caption_en : image.caption) || ""} onChange={(e) => set("gallery", values.gallery.map((item, i) => i === index ? { ...item, [lang === "en" ? "caption_en" : "caption"]: e.target.value } : item))} /><Button variant="ghost" size="sm" onClick={() => set("gallery", values.gallery.filter((_, i) => i !== index))}><Trash2 className="size-4" />Retirer</Button></div>)}</div>
      {preview && <ArticleGallery images={values.gallery} />}
    </div>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={values.published} onChange={(e) => set("published", e.target.checked)} />Publié</label>
    <div className="flex gap-3"><Button variant="lagoon" onClick={save} disabled={busy}><Save className="size-4" />{busy ? "Enregistrement…" : values.published ? "Publier" : "Enregistrer le brouillon"}</Button><Button variant="outline" onClick={onClose} disabled={busy}>Annuler</Button></div>
  </div>;
}