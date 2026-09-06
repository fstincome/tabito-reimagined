import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CmsPageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CONTACT } from "@/components/site/nav-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { messageTeam } from "@/lib/messages";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contacter TABITO — Réservez votre circuit au Burundi" },
      {
        name: "description",
        content:
          "Écrivez à l'équipe TABITO pour réserver un circuit, demander un devis ou obtenir des informations sur le tourisme au Burundi.",
      },
      { property: "og:title", content: "Contacter TABITO" },
      {
        property: "og:description",
        content: "Téléphone, e-mail et formulaire de contact de l'agence TABITO à Bujumbura.",
      },
    ],
  }),
  component: Contacts,
});

function Contacts() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Merci de remplir votre nom, votre e-mail et votre message.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Envoi impossible pour le moment. Réessayez plus tard.");
      return;
    }
    void messageTeam({
      kind: "contact",
      title: `Message de ${form.name.trim()}${form.subject.trim() ? ` — ${form.subject.trim()}` : ""}`,
      body: [
        `E-mail : ${form.email.trim()}`,
        form.phone.trim() ? `Téléphone : ${form.phone.trim()}` : null,
        "",
        form.message.trim(),
      ]
        .filter((l) => l !== null)
        .join("\n"),
      link: "/dashboard",
    }).catch(() => undefined);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    toast.success("Message envoyé ! Nous vous répondons dans les meilleurs délais.");
  }

  return (
    <SiteLayout>
      <CmsPageHero slug="contacts"
        title="Contacts"
        subtitle="Une question, un devis, une réservation ? Notre équipe vous répond depuis Bujumbura."
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading eyebrow="Écrivez-nous" title="Parlons de votre voyage" />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div className="surface-card space-y-6 p-8">
              <div className="rainbow-bar rounded-full" />
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 text-accent" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-semibold text-primary">Téléphone</p>
                  <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="text-sm text-muted-foreground hover:text-accent">
                    {CONTACT.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 text-accent" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-semibold text-primary">E-mail</p>
                  <a href={`mailto:${CONTACT.email}`} className="text-sm text-muted-foreground hover:text-accent">
                    {CONTACT.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 text-accent" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-semibold text-primary">Adresse</p>
                  <p className="text-sm text-muted-foreground">{CONTACT.address}</p>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="surface-card space-y-4 p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Votre nom *"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Votre e-mail *"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <Input
                  placeholder="Téléphone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <Input
                  placeholder="Sujet"
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                />
              </div>
              <Textarea
                rows={7}
                placeholder="Votre message *"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
              />
              <Button type="submit" variant="lagoon" disabled={loading}>
                <Send className="size-4" aria-hidden="true" />
                {loading ? "Envoi…" : "Envoyer le message"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
