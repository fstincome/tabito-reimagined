/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/integrations/supabase/client";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "bool"
  | "image"
  | "date"
  | "select"
  | "list";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
};

export type Resource = {
  table: string;
  /** Unique tab id when several tabs share one table. */
  key?: string;
  label: string;
  /** Column shown in the list view. */
  titleField: string;
  orderBy: { column: string; ascending: boolean };
  fields: Field[];
  readOnly?: boolean;
  /** Restricts the tab to rows matching these column values (also applied on create). */
  filter?: Record<string, string>;
};

export const resourceKey = (r: Resource) => r.key ?? r.table;


const PUBLISHED: Field = { name: "published", label: "Publié", type: "bool" };
const SORT: Field = { name: "sort_order", label: "Ordre d'affichage", type: "number" };

export const RESOURCES: Resource[] = [
  {
    table: "notifications",
    label: "Boîte de messages",
    titleField: "title",
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "title", label: "Objet", type: "text", required: true },
      { name: "kind", label: "Type", type: "text" },
      { name: "audience", label: "Destinataire (admin / user)", type: "text" },
      { name: "body", label: "Message", type: "textarea" },
      { name: "link", label: "Lien", type: "text" },
      { name: "read", label: "Lu", type: "bool" },
    ],
  },
  {
    table: "sites",
    label: "Sites touristiques (carte)",
    titleField: "nom_site",
    orderBy: { column: "nom_site", ascending: true },
    fields: [
      { name: "nom_site", label: "Nom du site", type: "text", required: true },
      { name: "latitude", label: "Latitude", type: "number", required: true },
      { name: "longitude", label: "Longitude", type: "number", required: true },
      { name: "province", label: "Province", type: "text" },
      { name: "commune", label: "Commune", type: "text" },
      { name: "categorie", label: "Catégorie", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image_url", label: "Image", type: "image" },
      PUBLISHED,
    ],
  },
  {
    table: "services",
    label: "Services (accueil)",
    titleField: "title",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "description", label: "Texte", type: "textarea" },
      {
        name: "icon",
        label: "Icône",
        type: "select",
        options: ["route", "bus", "compass", "ambulance", "mappin", "ticket"],
      },
      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "slides",
    label: "Diapositives d'accueil",
    titleField: "title",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "subtitle", label: "Sous-titre", type: "textarea" },
      { name: "cta_label", label: "Libellé du bouton", type: "text" },
      { name: "cta_link", label: "Lien du bouton", type: "text" },
      { name: "image_url", label: "Image", type: "image" },
      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "destinations",
    label: "Destinations",
    titleField: "name",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "categorie", label: "Catégorie", type: "text" },
      { name: "summary", label: "Résumé", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image_url", label: "Image", type: "image" },
      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "cities",
    label: "Villes du Burundi",
    titleField: "name",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "Nom de la ville", type: "text", required: true },
      { name: "province", label: "Province", type: "text" },
      { name: "summary", label: "Résumé", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "highlights", label: "À voir (un par ligne)", type: "list" },
      { name: "image_url", label: "Image", type: "image" },
      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "packages",
    key: "packages-circuits",
    label: "Circuits",
    titleField: "title",
    orderBy: { column: "sort_order", ascending: true },
    filter: { type: "circuit" },
    fields: [
      { name: "title", label: "Titre du circuit", type: "text", required: true },
      { name: "duration", label: "Durée", type: "text" },
      { name: "price", label: "Prix", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "highlights", label: "Points forts (un par ligne)", type: "list" },
      { name: "image_url", label: "Image", type: "image" },
      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "packages",
    key: "packages-bouquets",
    label: "Bouquets",
    titleField: "title",
    orderBy: { column: "sort_order", ascending: true },
    filter: { type: "bouquet" },
    fields: [
      { name: "title", label: "Titre du bouquet", type: "text", required: true },
      { name: "duration", label: "Durée", type: "text" },
      { name: "price", label: "Prix", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "highlights", label: "Points forts (un par ligne)", type: "list" },
      { name: "image_url", label: "Image", type: "image" },
      SORT,
      PUBLISHED,
    ],
  },

  {
    table: "blog_posts",
    label: "Articles du blog",
    titleField: "title",
    orderBy: { column: "published_at", ascending: false },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text" },
      { name: "author", label: "Auteur", type: "text" },
      { name: "published_at", label: "Date de publication", type: "date" },
      { name: "excerpt", label: "Chapeau", type: "textarea" },
      { name: "content", label: "Contenu", type: "textarea" },
      { name: "image_url", label: "Image", type: "image" },
      PUBLISHED,
    ],
  },
  {
    table: "events",
    label: "Évènements",
    titleField: "title",
    orderBy: { column: "start_date", ascending: false },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "status", label: "Statut", type: "select", options: ["à venir", "en cours", "passé"] },
      { name: "start_date", label: "Date de début", type: "date" },
      { name: "end_date", label: "Date de fin", type: "date" },
      { name: "place", label: "Lieu", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image_url", label: "Image", type: "image" },
      PUBLISHED,
    ],
  },
  {
    table: "opportunities",
    label: "Emplois / financements / formations",
    titleField: "title",
    orderBy: { column: "deadline", ascending: false },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "kind", label: "Type", type: "select", options: ["emploi", "financement", "formation"] },
      { name: "organisation", label: "Organisation", type: "text" },
      { name: "deadline", label: "Date limite", type: "date" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "link", label: "Lien externe", type: "text" },
      { name: "file_url", label: "Document (PDF)", type: "image" },
      { name: "image_url", label: "Image", type: "image" },
      PUBLISHED,
    ],
  },
  {
    table: "gallery_images",
    label: "Galerie photos (automatique)",
    titleField: "title",
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "title", label: "Légende", type: "text" },
      { name: "categorie", label: "Catégorie", type: "text" },
      { name: "image_url", label: "Image", type: "image", required: true },

      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "partners",
    label: "Partenaires",
    titleField: "name",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "website", label: "Site web", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "logo_url", label: "Logo", type: "image" },
      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "team_members",
    label: "Équipe",
    titleField: "name",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "role_title", label: "Fonction", type: "text" },
      {
        name: "groupe",
        label: "Groupe",
        type: "select",
        options: ["board", "advisors", "operational", "it"],
      },
      { name: "bio", label: "Biographie", type: "textarea" },
      { name: "photo_url", label: "Photo", type: "image" },
      { name: "facebook", label: "Facebook", type: "text" },
      { name: "twitter", label: "Twitter / X", type: "text" },
      { name: "linkedin", label: "LinkedIn", type: "text" },
      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "guides",
    label: "Guides touristiques",
    titleField: "name",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "speciality", label: "Spécialité", type: "text" },
      { name: "languages", label: "Langues", type: "text" },
      { name: "phone", label: "Téléphone", type: "text" },
      { name: "photo_url", label: "Photo", type: "image" },
      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "testimonials",
    label: "Témoignages",
    titleField: "author",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "author", label: "Auteur", type: "text", required: true },
      { name: "role_title", label: "Fonction / pays", type: "text" },
      { name: "message", label: "Témoignage", type: "textarea", required: true },
      { name: "rating", label: "Note (1-5)", type: "number" },
      { name: "photo_url", label: "Photo", type: "image" },
      SORT,
      PUBLISHED,
    ],
  },
  {
    table: "pages",
    label: "Pages éditables",
    titleField: "title",
    orderBy: { column: "slug", ascending: true },
    fields: [
      { name: "slug", label: "Slug (apropos, mission, villes…)", type: "text", required: true },
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "subtitle", label: "Sous-titre", type: "textarea" },
      { name: "body", label: "Contenu", type: "textarea" },
      { name: "hero_image_url", label: "Image d'entête", type: "image" },
    ],
  },
  {
    table: "contact_messages",
    label: "Messages reçus",
    titleField: "name",
    orderBy: { column: "created_at", ascending: false },
    readOnly: true,
    fields: [
      { name: "name", label: "Nom", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
      { name: "phone", label: "Téléphone", type: "text" },
      { name: "subject", label: "Sujet", type: "text" },
      { name: "message", label: "Message", type: "textarea" },
      { name: "handled", label: "Traité", type: "bool" },
    ],
  },
  {
    table: "bookings",
    label: "Réservations reçues",
    titleField: "name",
    orderBy: { column: "created_at", ascending: false },
    readOnly: true,
    fields: [
      { name: "name", label: "Nom", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
      { name: "phone", label: "Téléphone", type: "text" },
      { name: "category", label: "Catégorie", type: "text" },
      { name: "item_label", label: "Élément choisi", type: "text" },
      { name: "travel_date", label: "Date de voyage", type: "date" },
      { name: "return_date", label: "Date de retour", type: "date" },
      { name: "departure_point", label: "Point de départ", type: "text" },
      { name: "people", label: "Nombre de personnes", type: "number" },
      { name: "message", label: "Message", type: "textarea" },
      {
        name: "status",
        label: "Statut du trajet",
        type: "select",
        options: ["en_attente", "confirmee", "en_cours", "terminee", "annulee"],
      },
      { name: "handled", label: "Traité", type: "bool" },
    ],
  },
  {
    table: "newsletter_subscribers",
    label: "Abonnés newsletter",
    titleField: "email",
    orderBy: { column: "created_at", ascending: false },
    readOnly: true,
    fields: [{ name: "email", label: "E-mail", type: "text" }],
  },
];

const db = supabase as any;

export async function listRows(resource: Resource): Promise<any[]> {
  let q = db.from(resource.table).select("*");
  for (const [col, val] of Object.entries(resource.filter ?? {})) q = q.eq(col, val);
  const { data, error } = await q.order(resource.orderBy.column, {
    ascending: resource.orderBy.ascending,
    nullsFirst: false,
  });
  if (error) throw error;
  return data ?? [];
}

export async function saveRow(resource: Resource, id: string | null, values: any) {
  const payload = { ...values, ...(resource.filter ?? {}) };
  const query = id
    ? db.from(resource.table).update(payload).eq("id", id).select("id")
    : db.from(resource.table).insert(payload).select("id");
  const { data, error } = await query;
  if (error) throw error;
  return (data?.[0] as { id?: string } | undefined) ?? null;
}


export async function deleteRow(resource: Resource, id: string) {
  const { error } = await db.from(resource.table).delete().eq("id", id);
  if (error) throw error;
}

export function emptyValues(resource: Resource): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of resource.fields) {
    out[f.name] = f.type === "bool" ? f.name === "published" : f.type === "number" ? 0 : "";
  }
  return out;
}
