import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Linkedin, Twitter } from "lucide-react";

import { BioDialog, initialsOf } from "@/components/site/BioDialog";
import { CmsPageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useI18n } from "@/lib/i18n";
import { teamQuery, type TeamMember } from "@/lib/content";

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

function MemberCard({ m }: { m: TeamMember }) {
  const { L, tx } = useI18n();
  const roleTitle = tx(m, "role_title");
  const bio = tx(m, "bio");
  return (
    <article className="hover-lift surface-card overflow-hidden">
      {m.photo_url ? (
        <img
          src={m.photo_url}
          alt={m.name}
          width={600}
          height={600}
          loading="lazy"
          className="h-64 w-full bg-muted object-contain p-2"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-64 w-full items-center justify-center bg-primary/10 font-display text-5xl font-semibold text-primary"
        >
          {initialsOf(m.name)}
        </div>
      )}
      <div className="p-5">
        <h3 className="font-display text-base font-semibold text-primary">{m.name}</h3>
        {roleTitle && (
          <p className="mt-1 text-xs uppercase tracking-wider text-accent">{roleTitle}</p>
        )}
        {bio && <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">{bio}</p>}
        <div className="mt-4 flex gap-3 text-muted-foreground">
          {m.facebook && (
            <a href={m.facebook} aria-label={L(`Facebook de ${m.name}`, `Facebook of ${m.name}`)}>
              <Facebook className="size-4" aria-hidden="true" />
            </a>
          )}
          {m.twitter && (
            <a href={m.twitter} aria-label={L(`Twitter de ${m.name}`, `Twitter of ${m.name}`)}>
              <Twitter className="size-4" aria-hidden="true" />
            </a>
          )}
          {m.linkedin && (
            <a href={m.linkedin} aria-label={L(`LinkedIn de ${m.name}`, `LinkedIn of ${m.name}`)}>
              <Linkedin className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
        <BioDialog
          person={{
            name: m.name,
            photo: m.photo_url,
            role: roleTitle,
            bio,
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
  const { L } = useI18n();
  const { data: team = [], isLoading } = useQuery(teamQuery);

  const GROUPS: { key: string; label: string; subtitle: string }[] = [
    {
      key: "board",
      label: L("Conseil d'administration", "Board of Directors"),
      subtitle: L(
        "Board of Directors — la gouvernance de l'agence.",
        "The governing body of the agency.",
      ),
    },
    {
      key: "advisors",
      label: L("Conseil consultatif", "Advisory Board"),
      subtitle: L("Board of Advisors — nos sages conseillers.", "Our trusted advisors."),
    },
    {
      key: "operational",
      label: L("Équipe opérationnelle", "Operational team"),
      subtitle: L(
        "Les responsables qui préparent et accompagnent vos voyages.",
        "The managers who prepare and support your trips.",
      ),
    },
    {
      key: "it",
      label: L("Équipe IT & webmasters", "IT & webmasters team"),
      subtitle: L(
        "Développeurs et administrateurs de nos outils numériques.",
        "Developers and administrators of our digital tools.",
      ),
    },
  ];

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
      <CmsPageHero
        slug="equipe"
        title={L("Notre équipe", "Our team")}
        subtitle={L(
          "Des professionnels burundais du voyage, de la logistique et de la médiation culturelle.",
          "Burundian professionals in travel, logistics and cultural mediation.",
        )}
      />
      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            eyebrow={L("L'équipe TABITO", "The TABITO team")}
            title={L(
              "Celles et ceux qui préparent votre voyage",
              "The people who prepare your journey",
            )}
          />
          {isLoading ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : team.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              {L(
                "Les membres de l'équipe seront publiés prochainement.",
                "Team members will be published soon.",
              )}
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
