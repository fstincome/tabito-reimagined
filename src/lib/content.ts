import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export type Site = Tables["sites"]["Row"];
export type Slide = Tables["slides"]["Row"];
export type Destination = Tables["destinations"]["Row"];
export type Package = Tables["packages"]["Row"];
export type BlogPost = Tables["blog_posts"]["Row"];
export type EventRow = Tables["events"]["Row"];
export type Opportunity = Tables["opportunities"]["Row"];
export type GalleryImage = Tables["gallery_images"]["Row"];
export type Partner = Tables["partners"]["Row"];
export type TeamMember = Tables["team_members"]["Row"];
export type Testimonial = Tables["testimonials"]["Row"];
export type Guide = Tables["guides"]["Row"];
export type PageRow = Tables["pages"]["Row"];
export type City = Tables["cities"]["Row"];

async function pub<T>(promise: PromiseLike<{ data: T | null; error: unknown }>): Promise<T> {
  const { data, error } = await promise;
  if (error) throw error;
  return (data ?? []) as T;
}

export const sitesQuery = queryOptions({
  queryKey: ["sites"],
  queryFn: () =>
    pub<Site[]>(
      supabase.from("sites").select("*").eq("published", true).order("nom_site", { ascending: true }),
    ),
});

export const slidesQuery = queryOptions({
  queryKey: ["slides"],
  queryFn: () =>
    pub<Slide[]>(supabase.from("slides").select("*").eq("published", true).order("sort_order")),
});

export const destinationsQuery = queryOptions({
  queryKey: ["destinations"],
  queryFn: () =>
    pub<Destination[]>(
      supabase.from("destinations").select("*").eq("published", true).order("sort_order"),
    ),
});

export const packagesQuery = queryOptions({
  queryKey: ["packages"],
  queryFn: () =>
    pub<Package[]>(supabase.from("packages").select("*").eq("published", true).order("sort_order")),
});

export const blogQuery = queryOptions({
  queryKey: ["blog_posts"],
  queryFn: () =>
    pub<BlogPost[]>(
      supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false }),
    ),
});

export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: () =>
    pub<EventRow[]>(
      supabase
        .from("events")
        .select("*")
        .eq("published", true)
        .order("start_date", { ascending: false, nullsFirst: false }),
    ),
});

export function opportunitiesQuery(kind: string) {
  return queryOptions({
    queryKey: ["opportunities", kind],
    queryFn: () =>
      pub<Opportunity[]>(
        supabase
          .from("opportunities")
          .select("*")
          .eq("published", true)
          .eq("kind", kind)
          .order("deadline", { ascending: true, nullsFirst: false }),
      ),
  });
}

export const galleryQuery = queryOptions({
  queryKey: ["gallery_images"],
  queryFn: () =>
    pub<GalleryImage[]>(
      supabase.from("gallery_images").select("*").eq("published", true).order("sort_order"),
    ),
});

export const partnersQuery = queryOptions({
  queryKey: ["partners"],
  queryFn: () =>
    pub<Partner[]>(supabase.from("partners").select("*").eq("published", true).order("sort_order")),
});

export const teamQuery = queryOptions({
  queryKey: ["team_members"],
  queryFn: () =>
    pub<TeamMember[]>(
      supabase.from("team_members").select("*").eq("published", true).order("sort_order"),
    ),
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: () =>
    pub<Testimonial[]>(
      supabase.from("testimonials").select("*").eq("published", true).order("sort_order"),
    ),
});

export const citiesQuery = queryOptions({
  queryKey: ["cities"],
  queryFn: () =>
    pub<City[]>(supabase.from("cities").select("*").eq("published", true).order("sort_order")),
});

export const guidesQuery = queryOptions({
  queryKey: ["guides"],
  queryFn: () =>
    pub<Guide[]>(supabase.from("guides").select("*").eq("published", true).order("sort_order")),
});

/** Homepage service cards (table créée après la génération des types). */
export type Service = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  published: boolean;
};

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data, error } = await db
      .from("services")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Service[];
  },
});

/** All editable homepage sections (pages whose slug starts with `accueil-`). */
export const homeSectionsQuery = queryOptions({
  queryKey: ["pages", "accueil"],
  queryFn: async () => {
    const { data, error } = await supabase.from("pages").select("*").like("slug", "accueil-%");
    if (error) throw error;
    const map: Record<string, PageRow> = {};
    for (const row of (data ?? []) as PageRow[]) map[row.slug] = row;
    return map;
  },
});

export function pageQuery(slug: string) {
  return queryOptions({
    queryKey: ["pages", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as PageRow | null;
    },
  });
}
