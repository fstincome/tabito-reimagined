import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { messageTeam } from "@/lib/messages";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });
    setLoading(false);
    if (error) {
      toast.error(
        error.code === "23505"
          ? t("newsletter.duplicate")
          : t("newsletter.error"),
      );
      return;
    }
    void notifyNewsletterSignup({ data: { email: email.trim() } }).catch(() => undefined);
    setEmail("");
    toast.success(t("newsletter.success"));
  }

  return (
    <section className="gradient-lagoon">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-14 lg:grid-cols-2">
        <div className="text-primary-foreground">
          <p className="eyebrow text-primary-foreground/70">{t("newsletter.eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-bold">{t("newsletter.title")}</h2>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/85">
{t("newsletter.text")}
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            aria-label={t("newsletter.emailLabel")}
            className="h-12 border-0 bg-card text-base"
          />
          <Button type="submit" size="xl" variant="sun" disabled={loading}>
            <Send aria-hidden="true" />
            {loading ? t("newsletter.sending") : t("newsletter.submit")}
          </Button>
        </form>
      </div>
    </section>
  );
}
