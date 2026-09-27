import { Link } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import {
  Bell,
  CalendarCheck,
  Heart,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  Route as RouteIcon,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { listMyMessages, markMessageRead, type InternalMessage } from "@/lib/messages";

const db = supabase as any;

type Booking = {
  id: string;
  category: string;
  item_label: string | null;
  travel_date: string | null;
  return_date: string | null;
  departure_point: string | null;
  people: number | null;
  message: string | null;
  status: string;
  created_at: string;
};

type Profile = {
  full_name: string;
  phone: string;
  birth_date: string;
  gender: string;
  nationality: string;
  country: string;
  city: string;
  address: string;
  passport_number: string;
  emergency_name: string;
  emergency_phone: string;
  bio: string;
  preferred_language: string;
  interests: string[];
  travel_style: string;
  budget: string;
  accommodation: string;
  transport: string;
  dietary: string;
  accessibility: string;
  notify_messages: boolean;
  notify_offers: boolean;
};

const EMPTY: Profile = {
  full_name: "", phone: "", birth_date: "", gender: "", nationality: "", country: "", city: "",
  address: "", passport_number: "", emergency_name: "", emergency_phone: "", bio: "",
  preferred_language: "fr", interests: [], travel_style: "", budget: "", accommodation: "",
  transport: "", dietary: "", accessibility: "", notify_messages: true, notify_offers: false,
};

const PROFILE_FIELDS: (keyof Profile)[] = [
  "full_name", "phone", "birth_date", "nationality", "country", "city", "address",
  "emergency_name", "emergency_phone", "bio",
];

const STATUS_CLASSES: Record<string, string> = {
  en_attente: "bg-secondary text-primary",
  confirmee: "bg-accent text-accent-foreground",
  en_cours: "bg-primary text-primary-foreground",
  terminee: "bg-muted text-muted-foreground",
  annulee: "bg-destructive/10 text-destructive",
};

type Section = "overview" | "profile" | "preferences" | "bookings" | "messages" | "security";

export function TravellerSpace({ session }: { session: Session }) {
  const { L, lang } = useI18n();
  const [section, setSection] = useState<Section>("overview");
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const INTERESTS = [
    ["plages", L("Plages & lac Tanganyika", "Beaches & Lake Tanganyika")],
    ["nature", L("Parcs & nature", "Parks & nature")],
    ["culture", L("Culture & tambours", "Culture & drums")],
    ["gastronomie", L("Gastronomie", "Food")],
    ["histoire", L("Histoire & patrimoine", "History & heritage")],
    ["aventure", L("Randonnée & aventure", "Hiking & adventure")],
    ["photo", L("Photographie", "Photography")],
    ["ville", L("Vie urbaine", "City life")],
  ] as const;

  const CATEGORY_LABELS: Record<string, string> = {
    "Sites touristiques": L("Sites touristiques", "Tourist sites"),
    Destinations: "Destinations",
    Circuits: L("Circuits", "Tours"),
    Bouquets: L("Bouquets", "Packages"),
    "Villes du Burundi": L("Villes du Burundi", "Cities of Burundi"),
    "Guide touristique": L("Guide touristique", "Tour guide"),
  };
  const STATUS_LABELS: Record<string, string> = {
    en_attente: L("En attente", "Pending"),
    confirmee: L("Confirmée", "Confirmed"),
    en_cours: L("Trajet en cours", "In progress"),
    terminee: L("Terminée", "Completed"),
    annulee: L("Annulée", "Cancelled"),
  };

  const formatDate = (v: string | null) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime())
      ? v
      : d.toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const load = useCallback(async () => {
    setLoading(true);
    const [p, b, m] = await Promise.all([
      db.from("profiles").select("*").eq("id", session.user.id).maybeSingle(),
      db.from("bookings")
        .select("id, category, item_label, travel_date, return_date, departure_point, people, message, status, created_at")
        .order("created_at", { ascending: false }),
      listMyMessages().catch(() => [] as InternalMessage[]),
    ]);
    const row = p.data ?? {};
    const next: Profile = { ...EMPTY };
    (Object.keys(EMPTY) as (keyof Profile)[]).forEach((k) => {
      const v = row[k];
      if (v !== null && v !== undefined) (next as any)[k] = v;
    });
    if (!next.full_name) next.full_name = (session.user.user_metadata?.["full_name"] as string) ?? "";
    if (!Array.isArray(next.interests)) next.interests = [];
    setProfile(next);
    setBookings((b.data ?? []) as Booking[]);
    setMessages(m.filter((x) => x.audience === "user"));
    setLoading(false);
  }, [session.user.id]);

  useEffect(() => {
    void load();
  }, [load]);

  function set<K extends keyof Profile>(k: K, v: Profile[K]) {
    setProfile((p) => ({ ...p, [k]: v }));
  }

  async function save(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    const payload: Record<string, unknown> = { id: session.user.id, email: session.user.email ?? null };
    (Object.keys(profile) as (keyof Profile)[]).forEach((k) => {
      const v = profile[k];
      payload[k] = typeof v === "string" ? (v.trim() === "" ? null : v.trim().slice(0, 2000)) : v;
    });
    payload["preferred_language"] = profile.preferred_language || "fr";
    const { error } = await db.from("profiles").upsert(payload);
    setSaving(false);
    if (error) { toast.error(L("Enregistrement impossible.", "Unable to save.")); return; }
    toast.success(L("Modifications enregistrées.", "Changes saved."));
  }

  async function cancel(id: string) {
    const { error } = await db.from("bookings").delete().eq("id", id);
    if (error) { toast.error(L("Cette réservation ne peut plus être annulée.", "This booking can no longer be cancelled.")); return; }
    toast.success(L("Réservation annulée.", "Booking cancelled."));
    void load();
  }

  async function readMsg(id: string) {
    await markMessageRead(id).catch(() => null);
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.success(L("Vous êtes déconnecté.", "You are signed out."));
  }

  const completion = useMemo(() => {
    const filled = PROFILE_FIELDS.filter((k) => String(profile[k] ?? "").trim() !== "").length;
    return Math.round((filled / PROFILE_FIELDS.length) * 100);
  }, [profile]);

  const unread = messages.filter((m) => !m.read).length;
  const active = bookings.filter((b) => b.status === "confirmee" || b.status === "en_cours");
  const nextTrip = [...bookings]
    .filter((b) => b.travel_date && b.status !== "annulee" && new Date(b.travel_date) >= new Date(new Date().toDateString()))
    .sort((a, b) => (a.travel_date! < b.travel_date! ? -1 : 1))[0];

  const initials = (profile.full_name || session.user.email || "?")
    .split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  const NAV: { id: Section; label: string; icon: typeof User; badge?: number }[] = [
    { id: "overview", label: L("Tableau de bord", "Dashboard"), icon: LayoutDashboard },
    { id: "profile", label: L("Mon profil", "My profile"), icon: User },
    { id: "preferences", label: L("Préférences", "Preferences"), icon: Heart },
    { id: "bookings", label: L("Réservations & trajets", "Bookings & trips"), icon: RouteIcon, badge: bookings.length },
    { id: "messages", label: L("Messages", "Messages"), icon: Bell, badge: unread },
    { id: "security", label: L("Sécurité", "Security"), icon: KeyRound },
  ];

  const field = (k: keyof Profile, label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={`p-${k}`}>{label}</Label>
      <Input id={`p-${k}`} type={type} maxLength={200} value={(profile[k] as string) ?? ""} onChange={(e) => set(k, e.target.value as never)} />
    </div>
  );
  const select = (k: keyof Profile, label: string, opts: [string, string][]) => (
    <div className="space-y-2">
      <Label htmlFor={`p-${k}`}>{label}</Label>
      <select
        id={`p-${k}`}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        value={(profile[k] as string) ?? ""}
        onChange={(e) => set(k, e.target.value as never)}
      >
        <option value="">{L("— Choisir —", "— Choose —")}</option>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="surface-card h-fit p-5 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display font-bold text-primary">{profile.full_name || L("Voyageur", "Traveller")}</p>
            <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{L("Profil complété", "Profile completed")}</span><span>{completion}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${completion}%` }} />
          </div>
        </div>
        <nav className="mt-5 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setSection(n.id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                section === n.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <n.icon className="size-4" aria-hidden="true" />
              <span className="flex-1">{n.label}</span>
              {!!n.badge && (
                <span className="rounded-full bg-accent px-2 text-xs text-accent-foreground">{n.badge}</span>
              )}
            </button>
          ))}
          <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10">
            <LogOut className="size-4" aria-hidden="true" />{L("Se déconnecter", "Sign out")}
          </button>
        </nav>
      </aside>

      <main className="min-w-0">
        {loading ? (
          <p className="text-sm text-muted-foreground">{L("Chargement…", "Loading…")}</p>
        ) : section === "overview" ? (
          <div className="space-y-6">
            <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{L("Bienvenue", "Welcome")}</p>
                <h2 className="font-display text-2xl font-bold text-primary">{profile.full_name || session.user.email}</h2>
              </div>
              <Button asChild variant="lagoon" size="sm">
                <Link to="/reservation"><CalendarCheck className="size-4" aria-hidden="true" />{L("Nouvelle réservation", "New booking")}</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                [L("Réservations", "Bookings"), bookings.length],
                [L("Trajets actifs", "Active trips"), active.length],
                [L("Messages non lus", "Unread messages"), unread],
                [L("Profil complété", "Profile completed"), `${completion}%`],
              ].map(([l, v]) => (
                <div key={String(l)} className="surface-card p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{l}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-primary">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="surface-card p-6">
                <h3 className="font-display font-bold text-primary">{L("Prochain départ", "Next departure")}</h3>
                {nextTrip ? (
                  <div className="mt-3 text-sm">
                    <p className="font-semibold">{nextTrip.item_label ?? L("Séjour sur mesure", "Tailor-made stay")}</p>
                    <p className="text-muted-foreground">{formatDate(nextTrip.travel_date)} · {STATUS_LABELS[nextTrip.status] ?? nextTrip.status}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">{L("Aucun départ planifié.", "No departure planned.")}</p>
                )}
              </div>
              <div className="surface-card p-6">
                <h3 className="font-display font-bold text-primary">{L("Derniers messages", "Latest messages")}</h3>
                {messages.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">{L("Aucun message.", "No messages.")}</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm">
                    {messages.slice(0, 3).map((m) => (
                      <li key={m.id} className="flex items-center gap-2">
                        {!m.read && <span className="size-2 rounded-full bg-accent" />}
                        <span className="truncate">{m.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {completion < 100 && (
              <div className="surface-card flex flex-wrap items-center justify-between gap-3 p-6">
                <p className="text-sm">{L("Complétez votre profil pour des propositions de voyage adaptées.", "Complete your profile for tailored travel suggestions.")}</p>
                <Button size="sm" variant="secondary" onClick={() => setSection("profile")}>{L("Compléter", "Complete")}</Button>
              </div>
            )}
          </div>
        ) : section === "profile" ? (
          <form onSubmit={save} className="space-y-6">
            <div className="surface-card space-y-4 p-6">
              <h2 className="font-display text-lg font-bold text-primary">{L("Identité", "Identity")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("full_name", L("Nom complet", "Full name"))}
                {field("birth_date", L("Date de naissance", "Date of birth"), "date")}
                {select("gender", L("Genre", "Gender"), [["femme", L("Femme", "Female")], ["homme", L("Homme", "Male")], ["autre", L("Autre / ne pas préciser", "Other / prefer not to say")]])}
                {field("nationality", L("Nationalité", "Nationality"))}
                {field("passport_number", L("N° passeport / pièce d'identité", "Passport / ID number"))}
              </div>
            </div>
            <div className="surface-card space-y-4 p-6">
              <h2 className="font-display text-lg font-bold text-primary">{L("Coordonnées", "Contact details")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("phone", L("Téléphone / WhatsApp", "Phone / WhatsApp"), "tel")}
                {field("country", L("Pays de résidence", "Country of residence"))}
                {field("city", L("Ville", "City"))}
                {field("address", L("Adresse", "Address"))}
              </div>
            </div>
            <div className="surface-card space-y-4 p-6">
              <h2 className="font-display text-lg font-bold text-primary">{L("Contact d'urgence", "Emergency contact")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("emergency_name", L("Nom", "Name"))}
                {field("emergency_phone", L("Téléphone", "Phone"), "tel")}
              </div>
            </div>
            <div className="surface-card space-y-2 p-6">
              <Label htmlFor="p-bio" className="font-display text-lg font-bold text-primary">{L("À propos de moi", "About me")}</Label>
              <Textarea id="p-bio" rows={4} maxLength={2000} value={profile.bio} onChange={(e) => set("bio", e.target.value)} />
            </div>
            <Button type="submit" variant="lagoon" disabled={saving}>{saving ? L("Enregistrement…", "Saving…") : L("Enregistrer le profil", "Save profile")}</Button>
          </form>
        ) : section === "preferences" ? (
          <form onSubmit={save} className="space-y-6">
            <div className="surface-card space-y-4 p-6">
              <h2 className="font-display text-lg font-bold text-primary">{L("Centres d'intérêt", "Interests")}</h2>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(([v, l]) => {
                  const on = profile.interests.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set("interests", on ? profile.interests.filter((x) => x !== v) : [...profile.interests, v])}
                      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="surface-card space-y-4 p-6">
              <h2 className="font-display text-lg font-bold text-primary">{L("Style de voyage", "Travel style")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {select("travel_style", L("Je voyage", "I travel"), [["solo", L("Seul(e)", "Solo")], ["couple", L("En couple", "As a couple")], ["famille", L("En famille", "With family")], ["groupe", L("En groupe", "In a group")], ["affaires", L("Pour affaires", "For business")]])}
                {select("budget", L("Budget", "Budget"), [["economique", L("Économique", "Budget")], ["confort", L("Confort", "Comfort")], ["premium", L("Premium", "Premium")]])}
                {select("accommodation", L("Hébergement", "Accommodation"), [["hotel", L("Hôtel", "Hotel")], ["lodge", L("Lodge / éco-lodge", "Lodge / eco-lodge")], ["guesthouse", L("Maison d'hôtes", "Guesthouse")], ["camping", "Camping"]])}
                {select("transport", L("Transport", "Transport"), [["voiture", L("Voiture avec chauffeur", "Car with driver")], ["minibus", "Minibus"], ["moto", L("Moto-taxi", "Motorbike taxi")], ["bateau", L("Bateau", "Boat")]])}
                {select("preferred_language", L("Langue préférée", "Preferred language"), [["fr", "Français"], ["en", "English"], ["rn", "Kirundi"], ["sw", "Kiswahili"]])}
              </div>
            </div>
            <div className="surface-card space-y-4 p-6">
              <h2 className="font-display text-lg font-bold text-primary">{L("Besoins particuliers", "Special needs")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("dietary", L("Régime alimentaire / allergies", "Diet / allergies"))}
                {field("accessibility", L("Accessibilité / mobilité", "Accessibility / mobility"))}
              </div>
            </div>
            <div className="surface-card space-y-4 p-6">
              <h2 className="font-display text-lg font-bold text-primary">{L("Notifications", "Notifications")}</h2>
              <label className="flex items-center justify-between gap-4 text-sm">
                {L("Recevoir les messages de suivi de mes réservations", "Receive booking follow-up messages")}
                <Switch checked={profile.notify_messages} onCheckedChange={(v) => set("notify_messages", v)} />
              </label>
              <label className="flex items-center justify-between gap-4 text-sm">
                {L("Recevoir les offres et nouveaux circuits", "Receive offers and new tours")}
                <Switch checked={profile.notify_offers} onCheckedChange={(v) => set("notify_offers", v)} />
              </label>
            </div>
            <Button type="submit" variant="lagoon" disabled={saving}>{saving ? L("Enregistrement…", "Saving…") : L("Enregistrer mes préférences", "Save my preferences")}</Button>
          </form>
        ) : section === "bookings" ? (
          bookings.length === 0 ? (
            <div className="surface-card p-8 text-center">
              <RouteIcon className="mx-auto size-8 text-accent" aria-hidden="true" />
              <p className="mt-4 text-sm text-muted-foreground">{L("Aucune réservation pour l'instant.", "No bookings yet.")}</p>
              <Button asChild variant="lagoon" size="sm" className="mt-4"><Link to="/reservation">{L("Réserver un séjour", "Book a stay")}</Link></Button>
            </div>
          ) : (
            <div className="surface-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3">{L("Séjour", "Stay")}</th>
                    <th className="p-3">{L("Dates", "Dates")}</th>
                    <th className="p-3">{L("Départ", "From")}</th>
                    <th className="p-3">{L("Voyageurs", "Travellers")}</th>
                    <th className="p-3">{L("Statut", "Status")}</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b last:border-0 align-top">
                      <td className="p-3">
                        <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[b.category] ?? b.category}</p>
                        <p className="font-semibold text-primary">{b.item_label ?? L("Séjour sur mesure", "Tailor-made stay")}</p>
                      </td>
                      <td className="p-3 whitespace-nowrap">{formatDate(b.travel_date) ?? "—"}{b.return_date ? ` → ${formatDate(b.return_date)}` : ""}</td>
                      <td className="p-3">{b.departure_point ? <span className="flex items-center gap-1"><MapPin className="size-3.5 text-accent" aria-hidden="true" />{b.departure_point}</span> : "—"}</td>
                      <td className="p-3">{b.people ?? "—"}</td>
                      <td className="p-3"><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[b.status] ?? "bg-secondary text-primary"}`}>{STATUS_LABELS[b.status] ?? b.status}</span></td>
                      <td className="p-3">
                        {(b.status === "en_attente" || b.status === "annulee") && (
                          <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => cancel(b.id)} aria-label={L("Annuler", "Cancel")}>
                            <Trash2 className="size-4" aria-hidden="true" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : section === "messages" ? (
          messages.length === 0 ? (
            <div className="surface-card p-8 text-center text-sm text-muted-foreground">{L("Aucun message.", "No messages.")}</div>
          ) : (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li key={m.id} className={`surface-card p-5 ${m.read ? "" : "border-l-4 border-accent"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-primary">{m.title}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(m.created_at)}</span>
                  </div>
                  {m.body && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{m.body}</p>}
                  {!m.read && <Button size="sm" variant="ghost" className="mt-2" onClick={() => readMsg(m.id)}>{L("Marquer comme lu", "Mark as read")}</Button>}
                </li>
              ))}
            </ul>
          )
        ) : (
          <SecurityForm />
        )}
      </main>
    </div>
  );
}

function SecurityForm() {
  const { L } = useI18n();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) { toast.error(L("8 caractères minimum.", "At least 8 characters.")); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: next, current_password: current } as any);
    setBusy(false);
    if (error) { toast.error(L("Modification impossible. Vérifiez votre mot de passe actuel.", "Unable to update. Check your current password.")); return; }
    setCurrent(""); setNext("");
    toast.success(L("Mot de passe modifié.", "Password updated."));
  }
  return (
    <form onSubmit={submit} className="surface-card max-w-lg space-y-4 p-6">
      <h2 className="font-display text-lg font-bold text-primary">{L("Changer mon mot de passe", "Change my password")}</h2>
      <div className="space-y-2">
        <Label htmlFor="cur-pw">{L("Mot de passe actuel", "Current password")}</Label>
        <Input id="cur-pw" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-pw">{L("Nouveau mot de passe", "New password")}</Label>
        <Input id="new-pw" type="password" autoComplete="new-password" minLength={8} required value={next} onChange={(e) => setNext(e.target.value)} />
      </div>
      <Button type="submit" variant="lagoon" disabled={busy}>{busy ? "…" : L("Mettre à jour", "Update")}</Button>
    </form>
  );
}
