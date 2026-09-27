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
import { TravellerSpace } from "@/components/site/TravellerSpace";

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
            <TravellerSpace session={session} />
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

