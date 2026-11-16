/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, Pencil, Plus, RefreshCw, Save, Search, Trash2, Upload, X } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { AdminShell } from "@/components/site/AdminShell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  RESOURCES,
  deleteRow,
  emptyValues,
  enFields,
  hasEnglishTab,
  listRows,
  saveRow,

  type Field,
  type Resource,
} from "@/lib/admin";
import { isHttpUrl, registerGalleryImage, uploadMedia } from "@/lib/media";
import { TrackingPanel } from "@/components/site/TrackingPanel";
import { AdminUsersPanel } from "@/components/site/AdminUsersPanel";
import { BookingChat } from "@/components/site/BookingChat";
import { ArticleEditor } from "@/components/site/ArticleEditor";
import { GalleryPicker } from "@/components/site/GalleryPicker";
import { packagesQuery } from "@/lib/content";
import { validateReferenceTariffs } from "@/lib/package-tariffs";



export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — TABITO" },
      { name: "description", content: "Gestion du contenu du site TABITO." },
      { property: "og:title", content: "Tableau de bord — TABITO" },
      { property: "og:description", content: "Espace de gestion du contenu TABITO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [resource, setResource] = useState<Resource>(RESOURCES[0] as Resource);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const requestVersion = useRef(0);
  const [editing, setEditing] = useState<{ id: string | null; values: Record<string, any> } | null>(
    null,
  );
  const [formLang, setFormLang] = useState<"fr" | "en">("fr");
  const [search, setSearch] = useState("");
  const [tracking, setTracking] = useState(false);
  const [administrators, setAdministrators] = useState(false);
  const allFields = [...resource.fields, ...enFields(resource)];
  const shownFields = formLang === "en" ? enFields(resource) : resource.fields;
  const visibleRows = rows.filter((row) => [row[resource.titleField], row.subject, row.summary, row.excerpt, row.message, row.slug, row.email].some((value) => String(value ?? "").toLocaleLowerCase().includes(search.toLocaleLowerCase())));
  function selectResource(next: Resource) {
    requestVersion.current += 1;
    setRows([]); setLoading(true);
    setResource(next); setEditing(null); setTracking(false); setAdministrators(false); setSearch("");
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/login" });
        return;
      }
      setEmail(data.session.user.email ?? null);
      setReady(true);
    });
  }, [navigate]);

  const refresh = useCallback(async () => {
    const version = ++requestVersion.current;
    setLoading(true);
    try {
      const nextRows = await listRows(resource);
      if (version !== requestVersion.current) return;
      setRows(nextRows);
    } catch {
      if (version !== requestVersion.current) return;
      toast.error("Chargement impossible. Vérifiez vos droits d'administrateur.");
      setRows([]);
    }
    setLoading(false);
  }, [resource]);

  useEffect(() => {
    if (ready) void refresh();
  }, [ready, refresh]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  function startCreate() {
    setFormLang("fr");
    setEditing({ id: null, values: emptyValues(resource) });
  }

  function startEdit(row: any) {
    const values: Record<string, any> = {};
    setFormLang("fr");
    for (const f of allFields) {
      const raw = row[f.name];
      values[f.name] =
        f.type === "list"
          ? Array.isArray(raw)
            ? raw.join("\n")
            : ""
          : f.type === "date" && typeof raw === "string"
            ? raw.slice(0, 10)
            : (raw ?? (f.type === "bool" ? false : ""));
    }
    setEditing({ id: row.id, values });
  }

  async function submit() {
    if (!editing) return;
    const payload: Record<string, any> = {};
    for (const f of allFields) {
      const v = editing.values[f.name];
      if (f.required && (v === "" || v === null || v === undefined)) {
        toast.error(`Le champ « ${f.label} » est obligatoire.`);
        return;
      }
      payload[f.name] =
        f.type === "number"
          ? v === "" || v === null
            ? null
            : Number(v)
          : f.type === "bool"
            ? Boolean(v)
            : f.type === "list"
              ? String(v ?? "")
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : v === ""
                ? null
                : v;
    }
    if (resource.table === "packages") {
      const error = validateReferenceTariffs(payload);
      if (error) { toast.error(error); return; }
    }
    try {
      const saved = await saveRow(resource, editing.id, payload);
      toast.success("Contenu enregistré.");
      void saved;
      setEditing(null);
      await refresh();
    } catch {
      toast.error("Enregistrement impossible.");
    }
  }

  async function remove(row: any) {
    if (!confirm("Supprimer définitivement cet élément ?")) return;
    try {
      await deleteRow(resource, row.id);
      toast.success("Élément supprimé.");
      await refresh();
    } catch {
      toast.error("Suppression impossible.");
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <p className="text-sm text-muted-foreground">Vérification de la session…</p>
      </div>
    );
  }

  return (
    <AdminShell resource={resource} mode={administrators ? "administrators" : tracking ? "tracking" : "content"} editing={Boolean(editing)} email={email} onResource={selectResource} onMode={(mode) => { setAdministrators(mode === "administrators"); setTracking(mode === "tracking"); setEditing(null); }} onSignOut={signOut}>
      <div className="space-y-6">
          {administrators ? <AdminUsersPanel /> : tracking ? (
            <>
              <h1 className="font-display text-xl font-bold text-primary">
                Suivi des trajets (GPS)
              </h1>
              <TrackingPanel />
            </>
          ) : (
          <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="mb-1 text-xs font-semibold text-muted-foreground">{editing ? "ESPACE ÉDITEUR" : "GESTION DES CONTENUS"}</p><h1 className="font-display text-2xl font-bold text-primary">{resource.label}</h1></div>
            {!resource.readOnly && !editing && (
              <Button variant="lagoon" size="sm" onClick={startCreate}>
                <Plus className="size-4" aria-hidden="true" />
                Ajouter
              </Button>
            )}
          </div>

          {!editing && <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
            <div className="flex flex-wrap items-center gap-5 text-sm"><span className="font-semibold">{rows.length} élément{rows.length > 1 ? "s" : ""}</span>{resource.fields.some((f) => f.name === "published") && <><span className="text-muted-foreground">{rows.filter((row) => row.published).length} publié(s)</span><span className="text-muted-foreground">{rows.filter((row) => !row.published).length} brouillon(s)</span></>}</div>
            <div className="flex w-full items-center gap-2 sm:w-auto"><div className="relative flex-1 sm:w-64"><Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input aria-label="Rechercher dans les contenus" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div><Button variant="outline" size="icon" aria-label="Actualiser" title="Actualiser" disabled={loading} onClick={() => void refresh()}><RefreshCw className={loading ? "animate-spin motion-reduce:animate-none" : ""} /></Button></div>
          </div>}
          {editing && resource.table === "blog_posts" ? (
            <ArticleEditor key={editing.id || "new"} id={editing.id} initial={editing.id ? rows.find((row) => row.id === editing.id) || editing.values : editing.values} onClose={() => setEditing(null)} onSaved={refresh} />
          ) : editing && (
            <div className="space-y-6 rounded-lg border border-border bg-card p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-semibold text-primary">
                  {editing.id ? "Modifier l'élément" : "Nouvel élément"}
                </h2>
                <Button variant="ghost" size="icon" type="button" aria-label="Fermer" onClick={() => setEditing(null)}>
                  <X className="size-5 text-muted-foreground" />
                </Button>
              </div>
              {hasEnglishTab(resource) && (
                <div
                  className="flex gap-2 border-b border-border"
                  role="tablist"
                  aria-label="Langue du contenu"
                >
                  {(
                    [
                      { id: "fr", label: "Français" },
                      { id: "en", label: "English" },
                    ] as const
                  ).map((tab) => (
                    <Button
                      variant="ghost"
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={formLang === tab.id}
                      onClick={() => setFormLang(tab.id)}
                      className={`-mb-px rounded-t-md px-4 py-2 text-sm font-semibold transition-colors ${
                        formLang === tab.id
                          ? "border-b-2 border-accent text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
              )}
              {formLang === "en" && (
                <p className="text-xs text-muted-foreground">
                  Traduction anglaise facultative : laissez vide pour afficher le texte français.
                </p>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                {shownFields.map((f, index) => (
                  <Fragment key={f.name}>
                  {f.section && f.section !== shownFields[index - 1]?.section && <h3 className="border-b border-border pb-2 pt-4 font-display font-semibold text-primary md:col-span-2">{f.section}</h3>}
                  <FieldInput
                    key={f.name}
                    field={f}
                    value={editing.values[f.name]}
                    galleryCategory={resource.label}
                    galleryTitle={String(editing.values[resource.titleField] ?? "")}
                    onChange={(v) =>
                      setEditing((e) => (e ? { ...e, values: { ...e.values, [f.name]: v } } : e))
                    }
                  />
                  </Fragment>
                ))}

              </div>
              {resource.table === "bookings" && editing.id && (
                <BookingChat
                  bookingId={editing.id}
                  role="admin"
                  travellerId={rows.find((r) => r.id === editing.id)?.user_id ?? null}
                />
              )}
              <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap gap-2 border-t border-border bg-card px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <Button variant="lagoon" onClick={submit}>
                  <Save className="size-4" aria-hidden="true" />
                  Enregistrer
                </Button>
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {!editing && <div className="overflow-hidden rounded-lg border border-border bg-card">
            {loading ? <p className="p-8 text-sm text-muted-foreground">Chargement…</p> : visibleRows.length === 0 ? <div className="flex flex-col items-center gap-3 px-6 py-16 text-center"><FileText className="size-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">{rows.length ? "Aucun résultat." : "Aucun élément pour le moment."}</p></div> : (
              <Table className="table-fixed min-w-[560px]">
                <TableHeader className="bg-muted/60"><TableRow><TableHead className="w-16 pl-5">Image</TableHead><TableHead>Contenu</TableHead><TableHead className="w-28">Statut</TableHead><TableHead className="w-28 pr-5 text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{visibleRows.map((row) => {
                  const image = row.image_url || row.photo_url || row.logo_url || row.hero_image_url;
                  return <TableRow key={row.id}>
                    <TableCell className="py-4 pl-5">{image ? <img src={image} alt="" className="size-10 rounded-md bg-muted object-contain" /> : <div className="flex size-10 items-center justify-center rounded-md bg-muted"><FileText className="size-4 text-muted-foreground" /></div>}</TableCell>
                    <TableCell className="px-4 py-4"><p className="break-words font-display text-sm font-semibold text-primary">{row[resource.titleField] || "(sans titre)"}</p><p className="mt-1 truncate text-xs text-muted-foreground">{row.subject || row.summary || row.excerpt || row.message || row.slug || row.email || ""}</p></TableCell>
                    <TableCell>{"published" in row ? <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${row.published ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>{row.published ? "Publié" : "Brouillon"}</span> : <span className="break-words text-xs text-muted-foreground">{row.status || ("handled" in row ? row.handled ? "Traité" : "À traiter" : "—")}</span>}</TableCell>
                    <TableCell className="pr-5"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" title={resource.readOnly ? "Voir" : "Modifier"} aria-label={`${resource.readOnly ? "Voir" : "Modifier"} ${row[resource.titleField] || "l’élément"}`} onClick={() => startEdit(row)}><Pencil /></Button><Button variant="ghost" size="icon" title="Supprimer" aria-label={`Supprimer ${row[resource.titleField] || "l’élément"}`} onClick={() => remove(row)} className="text-muted-foreground hover:text-destructive"><Trash2 /></Button></div></TableCell>
                  </TableRow>;
                })}</TableBody>
              </Table>
            )}
            {visibleRows.length > 0 && <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">{visibleRows.length} sur {rows.length} élément{rows.length > 1 ? "s" : ""}</div>}
          </div>}
          </>
          )}
      </div>
    </AdminShell>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  galleryCategory,
  galleryTitle,
}: {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  galleryCategory?: string;
  galleryTitle?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const { data: packages = [] } = useQuery({ ...packagesQuery, enabled: field.type === "circuit" });

  async function onFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadMedia(file, field.name);
      onChange(url);
      if (galleryCategory) {
        await registerGalleryImage(url, galleryCategory, galleryTitle).catch(() => undefined);
      }
      toast.success("Fichier téléversé et ajouté à la galerie.");
    } catch {
      toast.error("Téléversement impossible.");
    }
    setUploading(false);
  }


  const wide = field.type === "textarea" || field.type === "list";

  return (
    <div className={`space-y-2 ${wide ? "md:col-span-2" : ""}`}>
      <Label htmlFor={field.name}>{field.label}</Label>

      {field.type === "textarea" || field.type === "list" ? (
        <Textarea
          id={field.name}
          rows={field.type === "list" ? 4 : 6}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "bool" ? (
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            id={field.name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="size-4 accent-[var(--color-accent)]"
          />
          Activer
        </label>
      ) : field.type === "circuit" ? (
        <select id={field.name} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
          <option value="">—</option>
          {packages.filter((p) => p.type === "circuit").map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      ) : field.type === "select" ? (
        <select
          id={field.name}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">—</option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === "image" ? (
        <div className="space-y-2">
          <Input
            id={field.name}
            placeholder="URL de l'image ou téléversez un fichier"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-xs font-medium">
              <Upload className="size-4" aria-hidden="true" />
              {uploading ? "Téléversement…" : "Téléverser"}
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onFile(file);
                }}
              />
            </label>
            {field.name !== "file_url" && <GalleryPicker disabled={uploading} onSelect={(images) => { const image = images[0]; if (image) onChange(image.image_url); }} />}
            {isHttpUrl(value) && (
              <img src={value} alt="" className="size-12 rounded-md object-cover" />
            )}
          </div>
        </div>
      ) : (
        <Input
          id={field.name}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          step={field.type === "number" ? "any" : undefined}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
