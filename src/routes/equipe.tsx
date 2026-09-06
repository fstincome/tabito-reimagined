import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Linkedin, Twitter } from "lucide-react";

import tambours from "@/assets/hero-tambours.jpg";
import { BioDialog } from "@/components/site/BioDialog";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { teamQuery, type TeamMember } from "@/lib/content";
import { imageOr } from "@/lib/media";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Notre équipe — TABITO" },
      {
        name: "description",
        content:
          "Rencontrez l'équipe de TABITO : conseil d'administration, conseil consultatif, équipe opérationnelle et équipe technique au Burundi.",
      },
      { property: "og:title", content: "Notre équipe — TABITO" },
      { property: "og:description", content: "Les femmes et les hommes derrière l'agence TABITO." },
    ],
  }),
  component: Equipe,
});

const GROUPS: { key: string; label: string; subtitle: string }[] = [
  {
    key: "board",
    label: "Conseil d'administration",
    subtitle: "Board of Directors — la gouvernance de l'agence.",
  },
  {
    key: "advisors",
    label: "Conseil consultatif",
    subtitle: "Board of Advisors — nos sages conseillers.",
  },
  {
    key: "operational",
    label: "Équipe opérationnelle",
    subtitle: "Les responsables qui préparent et accompagnent vos voyages.",
  },
  {
    key: "it",
    label: "Équipe IT & webmasters",
    subtitle: "Développeurs et administrateurs de nos outils numériques.",
  },
];

function MemberCard({ m }: { m: TeamMember }) {
  return (
    <article className="hover-lift surface-card overflow-hidden">
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
          <p className="mt-1 text-xs uppercase tracking-wider text-accent">{m.role_title}</p>
        )}
        {m.bio && <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">{m.bio}</p>}
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
  );
}

function Equipe() {
  const { data: team = [], isLoading } = useQuery(teamQuery);

  const byGroup = new Map<string, TeamMember[]>();
  for (const m of team) {
    const key = (m as { groupe?: string }).groupe || "operational";
    const list = byGroup.get(key) ?? [];
    list.push(m);
    byGroup.set(key, list);
  }
  // Membres dont le groupe est inconnu : on les range dans l'équipe opérationnelle.
  const known = new Set(GROUPS.map((g) => g.key));
  for (const [key, list] of byGroup) {
    if (!known.has(key)) {
      byGroup.set("operational", [...(byGroup.get("operational") ?? []), ...list]);
      byGroup.delete(key);
    }
  }

  return (
    <SiteLayout>
      <PageHero
        title="Notre équipe"
        subtitle="Des professionnels burundais du voyage, de la logistique et de la médiation culturelle."
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
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
            GROUPS.map((g) => {
              const members = byGroup.get(g.key) ?? [];
              if (members.length === 0) return null;
              return (
                <div key={g.key} className="mt-16 first:mt-14">
                  <div className="mb-8">
                    <h2 className="font-display text-2xl font-semibold text-primary">
                      {g.label}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{g.subtitle}</p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {members.map((m) => (
                      <MemberCard key={m.id} m={m} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
