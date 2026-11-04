import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdministrator, listAdministrators } from "@/lib/admin-users.functions";
import { newAdminSchema } from "@/lib/admin-users.schema";

type AdminEntry = { id: string; email: string; fullName: string; createdAt: string };

export function AdminUsersPanel() {
  const createAdmin = useServerFn(createAdministrator);
  const fetchAdmins = useServerFn(listAdministrators);
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let active = true;
    fetchAdmins().then((entries) => { if (active) setAdmins(entries); })
      .catch(() => { if (active) setError("Chargement impossible. Cet espace est réservé aux administrateurs."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetchAdmins]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newAdminSchema.safeParse({ fullName, email, password }).success) {
      toast.error("Renseignez le nom, une adresse valide et un mot de passe de 12 caractères minimum.");
      return;
    }
    setSaving(true);
    try {
      const result = await createAdmin({ data: { fullName, email, password } });
      if (!result.ok) { toast.error(result.message); return; }
      setFullName(""); setEmail(""); setPassword("");
      toast.success("Administrateur créé.");
      setAdmins(await fetchAdmins());
    } catch {
      toast.error("Création impossible. Vérifiez vos droits et réessayez.");
    } finally { setSaving(false); }
  }

  return (
    <section className="space-y-6">
      <h1 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
        <ShieldCheck className="size-5" aria-hidden="true" /> Administrateurs
      </h1>
      <form onSubmit={submit} className="space-y-4 border-b border-border pb-6">
        <h2 className="font-display font-semibold text-primary">Nouvel administrateur</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="admin-full-name">Nom complet</Label><Input id="admin-full-name" required maxLength={120} autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} disabled={saving || loading || Boolean(error)} /></div>
          <div className="space-y-2"><Label htmlFor="admin-email">Adresse e-mail</Label><Input id="admin-email" type="email" required autoComplete="off" value={email} onChange={(event) => setEmail(event.target.value)} disabled={saving || loading || Boolean(error)} /></div>
          <div className="space-y-2"><Label htmlFor="admin-password">Mot de passe (12 caractères minimum)</Label><Input id="admin-password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={saving || loading || Boolean(error)} /></div>
        </div>
        <Button type="submit" variant="lagoon" disabled={saving || loading || Boolean(error)}><UserPlus className="size-4" aria-hidden="true" />{saving ? "Création…" : "Créer l’administrateur"}</Button>
      </form>
      <h2 className="font-display font-semibold text-primary">Administrateurs du site</h2>
      {loading ? <p className="text-sm text-muted-foreground">Chargement…</p> : error ? <p role="alert" className="text-sm text-destructive">{error}</p> : (
        <ul className="divide-y divide-border">
          {admins.map((admin) => <li key={admin.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="font-semibold text-primary">{admin.fullName || "Administrateur"}</p><p className="break-all text-sm text-muted-foreground">{admin.email}</p></div><span className="text-xs font-semibold text-primary">Administrateur</span></li>)}
        </ul>
      )}
    </section>
  );
}