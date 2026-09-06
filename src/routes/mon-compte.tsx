import { createFileRoute, Link } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import {
  CalendarCheck,
  LogOut,
  MapPin,
  Route as RouteIcon,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { CmsPageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/mon-compte")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Mon espace voyageur — TABITO" },
      {
        name: "description",
        content:
          "Créez votre compte TABITO pour suivre vos réservations, vos trajets et vos séjours au Burundi depuis un espace personnel.",
      },
      { property: "og:title", content: "Mon espace voyageur — TABITO" },
      {
        property: "og:description",
        content: "Suivez vos réservations et trajets TABITO depuis votre espace personnel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Account,
});

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

const STATUS_CLASSES: Record<string, string> = {
  en_attente: "bg-secondary text-primary",
  confirmee: "bg-accent text-accent-foreground",
  en_cours: "bg-primary text-primary-foreground",
  terminee: "bg-muted text-muted-foreground",
  annulee: "bg-destructive/10 text-destructive",
};

function Account() {
  const { L } = useI18n();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <SiteLayout hideNewsletter>
      <CmsPageHero slug="mon-compte"
        title={L("Mon espace voyageur", "My traveller account")}
        subtitle={L("Créez votre compte pour retrouver vos demandes de réservation et suivre l'avancement de vos trajets.", "Create your account to find your booking requests and track the progress of your trips.")}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          {!ready ? (
            <p className="text-center text-sm text-muted-foreground">{L("Chargement…", "Loading…")}</p>
          ) : session ? (
            <Space session={session} />
          ) : (
            <AuthPanel />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function AuthPanel() {
  const { L } = useI18n();
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });
    setLoading(false);
    if (error) {
      toast.error(L("Identifiants invalides.", "Invalid credentials."));
      return;
    }
    toast.success(L("Bon retour !", "Welcome back!"));
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error(L("Choisissez un mot de passe de 8 caractères minimum.", "Choose a password with at least 8 characters."));
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin + "/mon-compte",
        data: { full_name: form.name.trim() },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || L("Création de compte impossible.", "Unable to create account."));
      return;
    }
    if (!data.session) {
      toast.success(L("Compte créé ! Confirmez votre e-mail pour accéder à votre espace.", "Account created! Confirm your email to access your account."));
      return;
    }
    toast.success(L("Compte créé, bienvenue chez TABITO !", "Account created, welcome to TABITO!"));
  }

  return (
    <div className="mx-auto max-w-md">
      <SectionHeading
        eyebrow={L("Espace personnel", "Personal account")}
        title={L("Connexion ou création de compte", "Sign in or create an account")}
        description={L("Un compte gratuit vous permet de suivre vos réservations et vos trajets.", "A free account lets you track your bookings and trips.")}
      />
      <div className="surface-card mt-10 p-8">
        <div className="rainbow-bar mb-6 rounded-full" />
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{L("Se connecter", "Sign in")}</TabsTrigger>
            <TabsTrigger value="signup">{L("Créer un compte", "Create an account")}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={signIn} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{L("Adresse e-mail", "Email address")}</Label>
                <Input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">{L("Mot de passe", "Password")}</Label>
                <Input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
              </div>
              <Button type="submit" variant="lagoon" className="w-full" disabled={loading}>
                {loading ? L("Connexion…", "Signing in…") : L("Se connecter", "Sign in")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signUp} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{L("Nom complet", "Full name")}</Label>
                <Input
                  id="signup-name"
                  autoComplete="name"
                  maxLength={120}
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">{L("Adresse e-mail", "Email address")}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{L("Mot de passe (8 caractères min.)", "Password (8 characters min.)")}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
              </div>
              <Button type="submit" variant="lagoon" className="w-full" disabled={loading}>
                <UserPlus className="size-4" aria-hidden="true" />
                {loading ? L("Création…", "Creating…") : L("Créer mon compte", "Create my account")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Space({ session }: { session: Session }) {
  const { L, lang } = useI18n();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string>(
    (session.user.user_metadata?.["full_name"] as string) ?? "",
  );
  const [savingProfile, setSavingProfile] = useState(false);

  const STATUS_LABELS: Record<string, string> = {
    en_attente: L("En attente de confirmation", "Awaiting confirmation"),
    confirmee: L("Confirmée", "Confirmed"),
    en_cours: L("Trajet en cours", "Trip in progress"),
    terminee: L("Terminée", "Completed"),
    annulee: L("Annulée", "Cancelled"),
  };

  function formatDate(value: string | null) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, category, item_label, travel_date, return_date, departure_point, people, message, status, created_at",
      )
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error(L("Impossible de charger vos réservations.", "Unable to load your bookings."));
      return;
    }
    setBookings((data ?? []) as Booking[]);
  }, [L]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: session.user.id, email: session.user.email ?? null, full_name: fullName.trim() });
    setSavingProfile(false);
    if (error) {
      toast.error(L("Enregistrement impossible.", "Unable to save."));
      return;
    }
    toast.success(L("Profil mis à jour.", "Profile updated."));
  }

  async function cancel(id: string) {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast.error(L("Cette réservation ne peut plus être annulée.", "This booking can no longer be cancelled."));
      return;
    }
    toast.success(L("Réservation annulée.", "Booking cancelled."));
    void refresh();
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.success(L("Vous êtes déconnecté.", "You are signed out."));
  }

  const upcoming = bookings.filter((b) => b.status === "confirmee" || b.status === "en_cours");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{L("Connecté en tant que", "Signed in as")}</p>
          <p className="font-display text-lg font-bold text-primary">{session.user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="lagoon" size="sm">
            <Link to="/reservation">
              <CalendarCheck className="size-4" aria-hidden="true" />
              {L("Nouvelle réservation", "New booking")}
            </Link>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={signOut}>
            <LogOut className="size-4" aria-hidden="true" />
            {L("Se déconnecter", "Sign out")}
          </Button>
        </div>
      </div>

      <form onSubmit={saveProfile} className="surface-card mt-6 space-y-4 p-6">
        <h2 className="font-display text-lg font-bold text-primary">{L("Mon profil", "My profile")}</h2>
        <div className="space-y-2">
          <Label htmlFor="full-name">{L("Nom complet", "Full name")}</Label>
          <Input
            id="full-name"
            maxLength={120}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <Button type="submit" variant="secondary" size="sm" disabled={savingProfile}>
          {savingProfile ? L("Enregistrement…", "Saving…") : L("Enregistrer", "Save")}
        </Button>
      </form>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-primary">
          {L("Mes réservations et trajets", "My bookings and trips")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {upcoming.length > 0
            ? L(`${upcoming.length} trajet(s) confirmé(s) ou en cours.`, `${upcoming.length} confirmed or ongoing trip(s).`)
            : L("Suivez ici l'avancement de chacune de vos demandes.", "Track the progress of each of your requests here.")}
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">{L("Chargement…", "Loading…")}</p>
        ) : bookings.length === 0 ? (
          <div className="surface-card mt-6 p-8 text-center">
            <RouteIcon className="mx-auto size-8 text-accent" aria-hidden="true" />
            <p className="mt-4 text-sm text-muted-foreground">
              {L("Aucune réservation pour l'instant.", "No bookings yet.")}
            </p>
            <Button asChild variant="lagoon" size="sm" className="mt-4">
              <Link to="/reservation">{L("Réserver un séjour", "Book a stay")}</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {bookings.map((b) => (
              <li key={b.id} className="surface-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {b.category}
                    </p>
                    <p className="font-display text-lg font-bold text-primary">
                      {b.item_label ?? L("Séjour sur mesure", "Tailor-made stay")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_CLASSES[b.status] ?? "bg-secondary text-primary"
                    }`}
                  >
                    {STATUS_LABELS[b.status] ?? b.status}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  {formatDate(b.travel_date) && (
                    <div>
                      <dt className="text-xs text-muted-foreground">{L("Départ", "Departure")}</dt>
                      <dd className="font-medium">{formatDate(b.travel_date)}</dd>
                    </div>
                  )}
                  {formatDate(b.return_date) && (
                    <div>
                      <dt className="text-xs text-muted-foreground">{L("Retour", "Return")}</dt>
                      <dd className="font-medium">{formatDate(b.return_date)}</dd>
                    </div>
                  )}
                  {b.departure_point && (
                    <div>
                      <dt className="text-xs text-muted-foreground">{L("Point de départ", "Departure point")}</dt>
                      <dd className="flex items-center gap-1 font-medium">
                        <MapPin className="size-3.5 text-accent" aria-hidden="true" />
                        {b.departure_point}
                      </dd>
                    </div>
                  )}
                  {b.people && (
                    <div>
                      <dt className="text-xs text-muted-foreground">{L("Voyageurs", "Travellers")}</dt>
                      <dd className="font-medium">{b.people}</dd>
                    </div>
                  )}
                </dl>

                {b.message && (
                  <p className="mt-4 text-sm text-muted-foreground">{b.message}</p>
                )}

                {(b.status === "en_attente" || b.status === "annulee") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-destructive"
                    onClick={() => cancel(b.id)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    {L("Annuler cette demande", "Cancel this request")}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
