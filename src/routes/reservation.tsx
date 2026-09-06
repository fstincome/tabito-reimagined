import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Send, UserCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CmsPageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { messageTeam, messageUser } from "@/lib/messages";
import {
  citiesQuery,
  destinationsQuery,
  guidesQuery,
  packagesQuery,
  sitesQuery,
} from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Réserver un voyage au Burundi — TABITO" },
      {
        name: "description",
        content:
          "Formulaire de réservation TABITO : choisissez une catégorie (sites touristiques, destinations, circuits, bouquets, villes, guides) puis l'offre qui vous intéresse.",
      },
      { property: "og:title", content: "Réserver un voyage au Burundi — TABITO" },
      {
        property: "og:description",
        content: "Réservez en quelques clics votre site, circuit ou bouquet touristique au Burundi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reservation,
});

type Option = { id: string; label: string };

const CATEGORIES = [
  "Sites touristiques",
  "Destinations",
  "Circuits",
  "Bouquets",
  "Villes du Burundi",
  "Guide touristique",
] as const;

function Reservation() {
  const { L, tx } = useI18n();
  const { data: sites = [] } = useQuery(sitesQuery);
  const { data: destinations = [] } = useQuery(destinationsQuery);
  const { data: packages = [] } = useQuery(packagesQuery);
  const { data: cities = [] } = useQuery(citiesQuery);
  const { data: guides = [] } = useQuery(guidesQuery);

  const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
    "Sites touristiques": L("Sites touristiques", "Tourist sites"),
    Destinations: L("Destinations", "Destinations"),
    Circuits: L("Circuits", "Tours"),
    Bouquets: L("Bouquets", "Packages"),
    "Villes du Burundi": L("Villes du Burundi", "Cities of Burundi"),
    "Guide touristique": L("Guide touristique", "Tour guide"),
  };

  const [category, setCategory] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travel_date: "",
    people: "2",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) return;
      setUserId(user.id);
      setForm((f) => ({
        ...f,
        email: f.email || (user.email ?? ""),
        name: f.name || ((user.user_metadata?.["full_name"] as string) ?? ""),
      }));
    });
  }, []);

  const options = useMemo<Option[]>(() => {
    switch (category) {
      case "Sites touristiques":
        return sites.map((s) => ({ id: s.id, label: tx(s, "nom_site") }));
      case "Destinations":
        return destinations.map((d) => ({ id: d.id, label: tx(d, "name") }));
      case "Circuits":
        return packages.filter((p) => p.type === "circuit").map((p) => ({ id: p.id, label: tx(p, "title") }));
      case "Bouquets":
        return packages.filter((p) => p.type === "bouquet").map((p) => ({ id: p.id, label: tx(p, "title") }));
      case "Villes du Burundi":
        return cities.map((c) => ({ id: c.id, label: tx(c, "name") }));
      case "Guide touristique":
        return guides.map((g) => ({ id: g.id, label: tx(g, "name") }));
      default:
        return [];
    }
  }, [category, sites, destinations, packages, cities, guides, tx]);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !category) {
      toast.error(L("Merci d'indiquer votre nom, votre e-mail et la catégorie souhaitée.", "Please provide your name, email and the desired category."));
      return;
    }
    const selected = options.find((o) => o.id === item);
    setLoading(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: userId,
      name: form.name.trim().slice(0, 120),
      email: form.email.trim().slice(0, 255),
      phone: form.phone.trim().slice(0, 40) || null,
      category,
      item_id: selected?.id ?? null,
      item_label: selected?.label ?? null,
      travel_date: form.travel_date || null,
      people: form.people ? Math.max(1, Math.min(200, Number(form.people) || 1)) : null,
      message: form.message.trim().slice(0, 1500) || null,
    });
    setLoading(false);
    if (error) {
      toast.error(L("Réservation impossible pour le moment. Réessayez plus tard.", "Booking is not possible right now. Please try again later."));
      return;
    }
    const recap = [
      `Nom : ${form.name.trim()}`,
      `E-mail : ${form.email.trim()}`,
      form.phone.trim() ? `Téléphone : ${form.phone.trim()}` : null,
      `Catégorie : ${category}`,
      selected?.label ? `Choix : ${selected.label}` : null,
      form.travel_date ? `Date souhaitée : ${form.travel_date}` : null,
      form.people ? `Voyageurs : ${form.people}` : null,
      form.message.trim() ? `Message : ${form.message.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    void messageTeam({
      kind: "reservation",
      title: `Nouvelle réservation — ${form.name.trim()}`,
      body: recap,
      link: "/dashboard",
    }).catch(() => undefined);
    if (userId) {
      void messageUser(userId, {
        kind: "reservation",
        title: "Votre demande de réservation est enregistrée",
        body: `Nous avons bien reçu votre demande.\n\n${recap}\n\nNotre équipe vous répond très vite ici même.`,
        link: "/mon-compte",
      }).catch(() => undefined);
    }
    setCategory("");
    setItem("");
    setForm({ name: "", email: "", phone: "", travel_date: "", people: "2", message: "" });
    toast.success(
      userId
        ? L("Demande envoyée ! Suivez son avancement dans votre espace personnel.", "Request sent! Track its progress in your personal account.")
        : L("Demande de réservation envoyée ! Notre équipe vous contacte très vite.", "Booking request sent! Our team will contact you very soon."),
    );
  }

  return (
    <SiteLayout>
      <CmsPageHero slug="reservation"
        title={L("Réserver", "Book")}
        subtitle={L("Choisissez une catégorie, puis l'offre exacte qui vous intéresse : nous préparons votre séjour sur mesure.", "Choose a category, then the exact offer you're interested in: we'll prepare your tailor-made stay.")}
      />

      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            eyebrow={L("Réservation", "Booking")}
            title={L("Votre demande en une minute", "Your request in one minute")}
            description={L("Sites touristiques, destinations, circuits, bouquets, villes ou guide : la seconde liste s'adapte automatiquement à votre choix.", "Tourist sites, destinations, tours, packages, cities or guides: the second list adapts automatically to your choice.")}
          />

          <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-3xl">
            <div className="surface-card space-y-5 p-8">
              <div className="rainbow-bar rounded-full" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{L("Catégorie *", "Category *")}</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => {
                      setCategory(v);
                      setItem("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={L("Choisir une catégorie", "Choose a category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {CATEGORY_LABELS[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{category ? CATEGORY_LABELS[category as (typeof CATEGORIES)[number]] : L("Offre", "Offer")}</Label>
                  <Select value={item} onValueChange={setItem} disabled={!category}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !category
                            ? L("Sélectionnez d'abord une catégorie", "Select a category first")
                            : options.length === 0
                              ? L("Aucune offre publiée pour l'instant", "No offer published yet")
                              : L("Choisir dans la liste", "Choose from the list")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder={L("Votre nom *", "Your name *")}
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                <Input
                  type="email"
                  placeholder={L("Votre e-mail *", "Your email *")}
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <Input
                  placeholder={L("Téléphone / WhatsApp", "Phone / WhatsApp")}
                  maxLength={40}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{L("Date souhaitée", "Preferred date")}</Label>
                    <Input
                      type="date"
                      value={form.travel_date}
                      onChange={(e) => set("travel_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{L("Personnes", "Travellers")}</Label>
                    <Input
                      type="number"
                      min={1}
                      max={200}
                      value={form.people}
                      onChange={(e) => set("people", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Textarea
                rows={6}
                maxLength={1500}
                placeholder={L("Précisions : hébergement, langue du guide, budget, transport…", "Details: accommodation, guide language, budget, transport…")}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
              />

              <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="lagoon" disabled={loading}>
                {loading ? (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    {L("Envoi…", "Sending…")}
                  </>
                ) : (
                  <>
                    <CalendarCheck className="size-4" aria-hidden="true" />
                    {L("Envoyer ma réservation", "Send my booking")}
                  </>
                )}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link to="/mon-compte">
                  <UserCircle className="size-4" aria-hidden="true" />
                  {userId ? L("Mon espace voyageur", "My traveller account") : L("Créer un compte pour suivre mes trajets", "Create an account to track my trips")}
                </Link>
              </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
