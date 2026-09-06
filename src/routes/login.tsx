import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import logo from "@/assets/tabito-logo.png";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";


export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Espace administrateur — TABITO" },
      {
        name: "description",
        content: "Connexion réservée à l'équipe TABITO pour gérer le contenu du site.",
      },
      { property: "og:title", content: "Espace administrateur — TABITO" },
      { property: "og:description", content: "Connexion à l'espace de gestion TABITO." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const { L } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      toast.error(L("Identifiants invalides.", "Invalid credentials."));
      return;
    }
    toast.success(L("Bienvenue !", "Welcome!"));
    navigate({ to: "/dashboard" });
  }

  return (
    <SiteLayout hideNewsletter>
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-md px-6">
          <div className="surface-card p-8">
            <div className="rainbow-bar mb-8 rounded-full" />
            <div className="flex flex-col items-center text-center">
              <img src={logo} alt={L("Logo TABITO", "TABITO logo")} width={72} height={72} className="size-16 object-contain" />
              <h1 className="mt-4 font-display text-2xl font-bold text-primary">{L("Espace admin", "Admin area")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {L("Connectez-vous pour gérer le contenu du site.", "Sign in to manage the site's content.")}
              </p>
            </div>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{L("Adresse e-mail", "Email address")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{L("Mot de passe", "Password")}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="lagoon" className="w-full" disabled={loading}>
                <LockKeyhole className="size-4" aria-hidden="true" />
                {loading ? L("Connexion…", "Signing in…") : L("Se connecter", "Sign in")}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
