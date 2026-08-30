import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import logoAsset from "@/assets/tabito-logo.png.asset.json";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const logo = logoAsset.url;

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
      toast.error("Identifiants invalides.");
      return;
    }
    toast.success("Bienvenue !");
    navigate({ to: "/dashboard" });
  }

  return (
    <SiteLayout hideNewsletter>
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-md px-6">
          <div className="surface-card p-8">
            <div className="rainbow-bar mb-8 rounded-full" />
            <div className="flex flex-col items-center text-center">
              <img src={logo} alt="Logo TABITO" width={72} height={72} className="size-16 object-contain" />
              <h1 className="mt-4 font-display text-2xl font-bold text-primary">Espace admin</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Connectez-vous pour gérer le contenu du site.
              </p>
            </div>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
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
                <Label htmlFor="password">Mot de passe</Label>
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
                {loading ? "Connexion…" : "Se connecter"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
