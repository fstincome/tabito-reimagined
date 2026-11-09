import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import type { ArticleValues } from "@/lib/articles";

export function ArticleGallery({ images }: { images: ArticleValues["gallery"] }) {
  const { lang, L } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  if (!images.length) return null;
  const active = selected === null ? undefined : images[selected];
  const caption = (image: ArticleValues["gallery"][number]) => lang === "en" ? image.caption_en || image.caption : image.caption;
  return <section className="mt-12 border-t border-border pt-8">
    <h2 className="mb-6 font-display text-2xl font-semibold text-primary">{L("Galerie photos", "Photo gallery")}</h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => <figure key={`${image.url}-${index}`}>
        <Button variant="ghost" className="h-auto w-full p-0" onClick={() => setSelected(index)} aria-label={caption(image) || L(`Ouvrir la photo ${index + 1}`, `Open photo ${index + 1}`)}>
          <img src={image.url} alt={caption(image)} loading="lazy" className="aspect-[4/3] w-full rounded-md bg-muted object-contain" />
        </Button>
        {caption(image) && <figcaption className="mt-2 text-sm text-muted-foreground">{caption(image)}</figcaption>}
      </figure>)}
    </div>
    <Dialog open={!!active} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      <DialogContent className="max-w-5xl">
        <DialogTitle>{active ? caption(active) || L("Photo", "Photo") : "Photo"}</DialogTitle>
        {active && <img src={active.url} alt={caption(active)} className="max-h-[75vh] w-full object-contain" />}
      </DialogContent>
    </Dialog>
  </section>;
}