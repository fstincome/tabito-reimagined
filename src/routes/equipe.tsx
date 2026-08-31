import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Linkedin, Twitter } from "lucide-react";

import tambours from "@/assets/hero-tambours.jpg";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { teamQuery } from "@/lib/content";
import { imageOr } from "@/lib/media";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Notre équipe — TABITO" },
      {
        name: "description",
        content:
          "Rencontrez l'équipe de TABITO : direction, guides, logistique et développement touristique au Burundi.",
      },
      { property: "og:title", content: "Notre équipe — TABITO" },
      { property: "og:description", content: "Les femmes et les hommes derrière l'agence TABITO." },
    ],
  }),
  component: Equipe,
});

function Equipe() {
  const { data: team = [], isLoading } = useQuery(teamQuery);

  return (
    <SiteLayout>
      <PageHero
        title="Notre équipe"
        subtitle="Des professionnels burundais du voyage, de la logistique et de la médiation culturelle."
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="L'équipe TABITO"
            title="Celles et ceux qui préparent votre voyage"
          />
          {isLoading ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : team.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              Les membres de l'équipe seront publiés prochainement.
            </p>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <article key={m.id} className="hover-lift surface-card overflow-hidden">
                  <img
                    src={imageOr(m.photo_url, tambours)}
                    alt={m.name}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-primary">{m.name}</h3>
                    {m.role_title && (
                      <p className="mt-1 text-xs uppercase tracking-wider text-accent">
                        {m.role_title}
                      </p>
                    )}
                    {m.bio && (
                      <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">{m.bio}</p>
                    )}
                    <div className="mt-4 flex gap-3 text-muted-foreground">
                      {m.facebook && (
                        <a href={m.facebook} aria-label={`Facebook de ${m.name}`}>
                          <Facebook className="size-4" aria-hidden="true" />
                        </a>
                      )}
                      {m.twitter && (
                        <a href={m.twitter} aria-label={`Twitter de ${m.name}`}>
                          <Twitter className="size-4" aria-hidden="true" />
                        </a>
                      )}
                      {m.linkedin && (
                        <a href={m.linkedin} aria-label={`LinkedIn de ${m.name}`}>
                          <Linkedin className="size-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <BioDialog
                      person={{
                        name: m.name,
                        photo: imageOr(m.photo_url, tambours),
                        role: m.role_title,
                        bio: m.bio,
                        facebook: m.facebook,
                        twitter: m.twitter,
                        linkedin: m.linkedin,
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
