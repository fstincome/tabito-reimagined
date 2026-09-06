import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";
/** ~10 years, so stored links keep working on a statically hosted build. */
const SIGNED_TTL = 315_360_000;

export function isHttpUrl(value: string | null | undefined): boolean {
  return !!value && /^(https?:)?\/\//.test(value);
}

/**
 * Uploads a file to the media bucket and returns a long-lived signed URL that
 * can be stored directly in a content row's `image_url` column.
 */
export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_TTL);
  if (signError || !data?.signedUrl) throw signError ?? new Error("Signature impossible");

  return data.signedUrl;
}

export function imageOr(url: string | null | undefined, fallback: string): string {
  return isHttpUrl(url) ? (url as string) : fallback;
}

/**
 * Registers an uploaded image in the gallery so every upload made anywhere in
 * the dashboard shows up on /galerie under its own category.
 */
export async function registerGalleryImage(
  imageUrl: string,
  categorie: string,
  title?: string | null,
): Promise<void> {
  if (!isHttpUrl(imageUrl)) return;
  const db = supabase as any;
  const { data: existing } = await db
    .from("gallery_images")
    .select("id")
    .eq("image_url", imageUrl)
    .limit(1);
  if (existing?.length) return;
  await db.from("gallery_images").insert({
    image_url: imageUrl,
    categorie,
    title: title?.trim() ? title.trim() : null,
    published: true,
  });
}
