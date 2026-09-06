import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Home, Mail } from "lucide-react";

import { CmsPageHero } from "@/components/site/PageHero";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CONTACT } from "@/components/site/nav-data";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/merci")({
  head: () => ({
    meta: [
      { title: "Merci — Votre message a bien été envoyé | TABITO" },
      {
        name: "description",
        content:
          "Merci d'avoir contacté TABITO. Notre équipe à Bujumbura vous répond dans les meilleurs délais pour votre voyage au Burundi.",
      },
      { property: "og:title", content: "Merci — Message envoyé | TABITO" },
      {
        property: "og:description",
        content: "Votre message a bien été reçu par l'équipe TABITO. Réponse rapide garantie.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  const { L } = useI18n();

  return (
    <SiteLayout>
      <CmsPageHero
        slug="merci"
        title={L("Merci !", "Thank you!")}
        subtitle={L(
          "Votre message est bien arrivé chez TABITO.",
          "Your message has reached the TABITO team.",
        )}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <div className="surface-card mx-auto max-w-2xl space-y-6 p-10 text-center">
            <div className="rainbow-bar mx-auto w-24 rounded-full" />
            <CheckCircle2 className="mx-auto size-14 text-accent" aria-hidden="true" />
            <h1 className="font-display text-3xl font-semibold text-primary">
              {L("Merci pour votre message", "Thank you for your message")}
            </h1>
            <p className="text-muted-foreground">
              {L(
                "Notre équipe vous répond généralement sous 24 heures ouvrables. En attendant, découvrez nos destinations et nos circuits au Burundi.",
                "Our team usually replies within 24 working hours. In the meantime, explore our destinations and tours across Burundi.",
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {L("Une urgence ? Écrivez-nous à", "Something urgent? Write to us at")}{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-accent hover:underline">
                {CONTACT.email}
              </a>
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild variant="lagoon">
                <Link to="/">
                  <Home className="size-4" aria-hidden="true" />
                  {L("Retour à l'accueil", "Back to home")}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/destinations">
                  {L("Voir les destinations", "See destinations")}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contacts">
                  <Mail className="size-4" aria-hidden="true" />
                  {L("Envoyer un autre message", "Send another message")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
