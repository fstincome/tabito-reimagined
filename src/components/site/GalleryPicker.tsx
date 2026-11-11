import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { GalleryImage } from "@/lib/content";
import { isHttpUrl } from "@/lib/media";

export function GalleryPicker({ onSelect, multiple = false, disabled = false }: {
  onSelect: (images: GalleryImage[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const { data: images = [], isPending, isError, refetch } = useQuery({
    queryKey: ["gallery_images", "admin-picker"],
    enabled: open,
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const seen = new Set<string>();
      return (data ?? []).filter((image) => {
        if (!isHttpUrl(image.image_url) || seen.has(image.image_url)) return false;
        seen.add(image.image_url);
        return true;
      });
    },
  });
  const categories = Array.from(new Set(images.map((image) => image.categorie).filter((value): value is string => Boolean(value))));
  const visible = images.filter((image) => (!category || image.categorie === category) && `${image.title ?? ""} ${image.categorie ?? ""}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  function choose(image: GalleryImage) {
    if (!multiple) { onSelect([image]); setOpen(false); return; }
    setSelected((old) => old.includes(image.id) ? old.filter((id) => id !== image.id) : [...old, image.id]);
  }
  return <>
    <Button variant="outline" disabled={disabled} onClick={() => { setSearch(""); setCategory(""); setSelected([]); setOpen(true); }}><Images className="size-4" />Choisir dans la galerie</Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto" aria-describedby={undefined}>
        <DialogTitle>Choisir dans la galerie</DialogTitle>
        <div className="flex flex-wrap gap-3">
          <Input className="min-w-0 flex-1" aria-label="Rechercher une photo" placeholder="Rechercher une photo…" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Catégorie des photos" className="h-10 max-w-full rounded-md border border-input bg-background px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Toutes les catégories</option>
            {categories.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
        {isPending ? <p className="py-8 text-center text-muted-foreground">Chargement…</p> : isError ? <div className="py-8 text-center"><p>Chargement des photos impossible.</p><Button variant="outline" onClick={() => void refetch()}>Réessayer</Button></div> : !visible.length ? <p className="py-8 text-center text-muted-foreground">Aucune photo trouvée.</p> :
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((image, index) => <Button key={image.id} variant="ghost" aria-label={`Choisir ${image.title || `la photo ${index + 1}`}`} aria-pressed={multiple ? selected.includes(image.id) : undefined} onClick={() => choose(image)} className={`relative h-auto min-w-0 flex-col items-stretch gap-2 overflow-hidden border p-2 ${selected.includes(image.id) ? "border-accent bg-secondary" : "border-border"}`}>
              <img src={image.image_url} alt={image.title || "Photo"} loading="lazy" className="aspect-[4/3] w-full rounded-md bg-muted object-contain" />
              <span className="truncate text-left text-xs">{image.title || image.categorie || `Photo ${index + 1}`}</span>
              {selected.includes(image.id) && <Check className="absolute right-3 top-3 size-5 rounded-sm bg-accent text-accent-foreground" />}
            </Button>)}
          </div>}
        {multiple && <Button variant="lagoon" disabled={!selected.length} onClick={() => { onSelect(selected.flatMap((id) => { const image = images.find((item) => item.id === id); return image ? [image] : []; })); setOpen(false); }}>Ajouter les photos ({selected.length})</Button>}
      </DialogContent>
    </Dialog>
  </>;
}