import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });
    setLoading(false);
    if (error) {
      toast.error(
        error.code === "23505"
          ? "Cette adresse est déjà inscrite."
          : "Inscription impossible pour le moment.",
      );
      return;
    }
    setEmail("");
    toast.success("Merci ! Vous êtes inscrit à notre newsletter.");
  }

  return (
    <section className="gradient-lagoon">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-14 lg:grid-cols-2">
        <div className="text-primary-foreground">
          <p className="eyebrow text-primary-foreground/70">Restons en contact</p>
          <h2 className="mt-2 text-3xl font-bold">Recevez nos circuits et actualités</h2>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/85">
            Nouvelles destinations, évènements culturels, appels à financement et opportunités de
            formation : tout arrive directement dans votre boîte mail.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            aria-label="Adresse email"
            className="h-12 border-0 bg-card text-base"
          />
          <Button type="submit" size="xl" variant="sun" disabled={loading}>
            <Send aria-hidden="true" />
            {loading ? "Envoi…" : "Je m'abonne"}
          </Button>
        </form>
      </div>
    </section>
  );
}
