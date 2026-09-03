import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Send, UserCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHero } from "@/components/site/PageHero";
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
import {
  citiesQuery,
  destinationsQuery,
  guidesQuery,
  packagesQuery,
  sitesQuery,
} from "@/lib/content";

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
  const { data: sites = [] } = useQuery(sitesQuery);
  const { data: destinations = [] } = useQuery(destinationsQuery);
  const { data: packages = [] } = useQuery(packagesQuery);
  const { data: cities = [] } = useQuery(citiesQuery);
  const { data: guides = [] } = useQuery(guidesQuery);

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
        return sites.map((s) => ({ id: s.id, label: s.nom_site }));
      case "Destinations":
        return destinations.map((d) => ({ id: d.id, label: d.name }));
      case "Circuits":
        return packages.filter((p) => p.type === "circuit").map((p) => ({ id: p.id, label: p.title }));
      case "Bouquets":
        return packages.filter((p) => p.type === "bouquet").map((p) => ({ id: p.id, label: p.title }));
      case "Villes du Burundi":
        return cities.map((c) => ({ id: c.id, label: c.name }));
      case "Guide touristique":
        return guides.map((g) => ({ id: g.id, label: g.name }));
      default:
        return [];
    }
  }, [category, sites, destinations, packages, cities, guides]);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !category) {
      toast.error("Merci d'indiquer votre nom, votre e-mail et la catégorie souhaitée.");
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
      toast.error("Réservation impossible pour le moment. Réessayez plus tard.");
      return;
    }
    setCategory("");
    setItem("");
    setForm({ name: "", email: "", phone: "", travel_date: "", people: "2", message: "" });
    toast.success(
      userId
        ? "Demande envoyée ! Suivez son avancement dans votre espace personnel."
        : "Demande de réservation envoyée ! Notre équipe vous contacte très vite.",
    );
  }

  return (
    <SiteLayout>
      <PageHero
        title="Réserver"
        subtitle="Choisissez une catégorie, puis l'offre exacte qui vous intéresse : nous préparons votre séjour sur mesure."
      />

      <section className="section-y bg-sand">
        <div className="mx-auto max-w-[95%] px-6">
          <SectionHeading
            eyebrow="Réservation"
            title="Votre demande en une minute"
            description="Sites touristiques, destinations, circuits, bouquets, villes ou guide : la seconde liste s'adapte automatiquement à votre choix."
          />

          <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-3xl">
            <div className="surface-card space-y-5 p-8">
              <div className="rainbow-bar rounded-full" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Catégorie *</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => {
                      setCategory(v);
                      setItem("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{category || "Offre"}</Label>
                  <Select value={item} onValueChange={setItem} disabled={!category}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !category
                            ? "Sélectionnez d'abord une catégorie"
                            : options.length === 0
                              ? "Aucune offre publiée pour l'instant"
                              : "Choisir dans la liste"
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
                  placeholder="Votre nom *"
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Votre e-mail *"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <Input
                  placeholder="Téléphone / WhatsApp"
                  maxLength={40}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Date souhaitée</Label>
                    <Input
                      type="date"
                      value={form.travel_date}
                      onChange={(e) => set("travel_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Personnes</Label>
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
                placeholder="Précisions : hébergement, langue du guide, budget, transport…"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
              />

              <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="lagoon" disabled={loading}>
                {loading ? (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    Envoi…
                  </>
                ) : (
                  <>
                    <CalendarCheck className="size-4" aria-hidden="true" />
                    Envoyer ma réservation
                  </>
                )}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link to="/mon-compte">
                  <UserCircle className="size-4" aria-hidden="true" />
                  {userId ? "Mon espace voyageur" : "Créer un compte pour suivre mes trajets"}
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
