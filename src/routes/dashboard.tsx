/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import logoAsset from "@/assets/tabito-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  RESOURCES,
  deleteRow,
  emptyValues,
  listRows,
  resourceKey,
  saveRow,

  type Field,
  type Resource,
} from "@/lib/admin";
import { isHttpUrl, uploadMedia } from "@/lib/media";


const logo = logoAsset.url;

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — TABITO" },
      { name: "description", content: "Gestion du contenu du site TABITO." },
      { property: "og:title", content: "Tableau de bord — TABITO" },
      { property: "og:description", content: "Espace de gestion du contenu TABITO." },
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
  const [editing, setEditing] = useState<{ id: string | null; values: Record<string, any> } | null>(
    null,
  );

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
    setLoading(true);
    try {
      setRows(await listRows(resource));
    } catch {
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
    setEditing({ id: null, values: emptyValues(resource) });
  }

  function startEdit(row: any) {
    const values: Record<string, any> = {};
    for (const f of resource.fields) {
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
    for (const f of resource.fields) {
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
    <div className="min-h-screen bg-sand">
      <div className="rainbow-bar" />
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo TABITO" width={44} height={44} className="size-11 object-contain" />
            <span className="font-display text-lg font-bold text-primary">
              Tableau de bord TABITO
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {email && <span className="text-xs text-muted-foreground">{email}</span>}
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-4" aria-hidden="true" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="surface-card h-fit p-3">
          <nav className="space-y-1">
            {RESOURCES.map((r) => (
              <button
                key={resourceKey(r)}
                type="button"
                onClick={() => {
                  setResource(r);
                  setEditing(null);
                }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  resourceKey(resource) === resourceKey(r)
                    ? "bg-secondary font-semibold text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >

                {r.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-xl font-bold text-primary">{resource.label}</h1>
            {!resource.readOnly && (
              <Button variant="lagoon" size="sm" onClick={startCreate}>
                <Plus className="size-4" aria-hidden="true" />
                Ajouter
              </Button>
            )}
          </div>

          {editing && (
            <div className="surface-card space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-semibold text-primary">
                  {editing.id ? "Modifier l'élément" : "Nouvel élément"}
                </h2>
                <button type="button" aria-label="Fermer" onClick={() => setEditing(null)}>
                  <X className="size-5 text-muted-foreground" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {resource.fields.map((f) => (
                  <FieldInput
                    key={f.name}
                    field={f}
                    value={editing.values[f.name]}
                    onChange={(v) =>
                      setEditing((e) => (e ? { ...e, values: { ...e.values, [f.name]: v } } : e))
                    }
                  />
                ))}
              </div>
              <div className="flex gap-2">
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

          <div className="surface-card overflow-hidden">
            {loading ? (
              <p className="p-6 text-sm text-muted-foreground">Chargement…</p>
            ) : rows.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">Aucun élément pour le moment.</p>
            ) : (
              <ul className="divide-y divide-border">
                {rows.map((row) => (
                  <li key={row.id} className="flex items-center gap-4 p-4">
                    {(row.image_url || row.photo_url || row.logo_url || row.hero_image_url) && (
                      <img
                        src={row.image_url || row.photo_url || row.logo_url || row.hero_image_url}
                        alt=""
                        className="size-12 shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold text-primary">
                        {row[resource.titleField] || "(sans titre)"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {row.subject || row.summary || row.excerpt || row.message || row.slug || ""}
                      </p>
                    </div>
                    {"published" in row && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                          row.published
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {row.published ? "Publié" : "Brouillon"}
                      </span>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(row)}>
                        {resource.readOnly ? "Voir" : "Modifier"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => remove(row)}>
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: any;
  onChange: (value: any) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadMedia(file, field.name);
      onChange(url);
      toast.success("Fichier téléversé.");
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
          <div className="flex items-center gap-3">
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
