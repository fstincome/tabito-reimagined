export type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
};

export const NAV: NavItem[] = [
  { label: "Accueil", to: "/" },
  {
    label: "À propos",
    to: "/apropos",
    children: [
      { label: "Qui sommes-nous", to: "/apropos" },
      { label: "Notre mission", to: "/mission" },
      { label: "Notre vision", to: "/vision" },
      { label: "Nos valeurs", to: "/valeurs" },
      { label: "Nos principes", to: "/principes" },
      { label: "Notre équipe", to: "/equipe" },
      { label: "SMED LAB", to: "/smedlab" },
    ],
  },
  {
    label: "Actualités",
    to: "/blog",
    children: [
      { label: "Blog", to: "/blog" },
      { label: "Évènements", to: "/evenements" },
      { label: "Emplois", to: "/emplois" },
      { label: "Financements", to: "/financements" },
      { label: "Formations", to: "/formations" },
    ],
  },
  {
    label: "Destinations",
    to: "/destinations",
    children: [
      { label: "Sites touristiques", to: "/destinations" },
      { label: "Villes du Burundi", to: "/villes" },
      { label: "Circuits", to: "/circuits" },
      { label: "Bouquets", to: "/bouquets" },
      { label: "Guides touristiques", to: "/guides" },
      { label: "Galerie", to: "/galerie" },
    ],
  },
  { label: "Réserver", to: "/reservation" },
  { label: "Partenaires", to: "/partenaires" },
  { label: "Contacts", to: "/contacts" },
];

export const CONTACT = {
  phone: "+257 79 505 127",
  email: "info@tabito.travel",
  address: "Avenue du Lac Tanganyika, Bujumbura, Burundi",
};
