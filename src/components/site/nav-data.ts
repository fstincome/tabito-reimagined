export type NavItem = {
  /** i18n key resolved with `t()` at render time. */
  labelKey: string;
  to: string;
  children?: { labelKey: string; to: string }[];
};

export const NAV: NavItem[] = [
  { labelKey: "nav.home", to: "/" },
  {
    labelKey: "nav.about",
    to: "/apropos",
    children: [
      { labelKey: "nav.who", to: "/apropos" },
      { labelKey: "nav.mission", to: "/mission" },
      { labelKey: "nav.vision", to: "/vision" },
      { labelKey: "nav.values", to: "/valeurs" },
      { labelKey: "nav.principles", to: "/principes" },
      { labelKey: "nav.team", to: "/equipe" },
      { labelKey: "nav.smedlab", to: "/smedlab" },
    ],
  },
  {
    labelKey: "nav.news",
    to: "/blog",
    children: [
      { labelKey: "nav.blog", to: "/blog" },
      { labelKey: "nav.events", to: "/evenements" },
      { labelKey: "nav.jobs", to: "/emplois" },
      { labelKey: "nav.funding", to: "/financements" },
      { labelKey: "nav.training", to: "/formations" },
    ],
  },
  {
    labelKey: "nav.destinations",
    to: "/destinations",
    children: [
      { labelKey: "nav.sites", to: "/destinations" },
      { labelKey: "nav.cities", to: "/villes" },
      { labelKey: "nav.tours", to: "/circuits" },
      { labelKey: "nav.bundles", to: "/bouquets" },
      { labelKey: "nav.guides", to: "/guides" },
      { labelKey: "nav.gallery", to: "/galerie" },
    ],
  },
  { labelKey: "nav.book", to: "/reservation" },
  { labelKey: "nav.account", to: "/mon-compte" },
  { labelKey: "nav.partners", to: "/partenaires" },
  { labelKey: "nav.contacts", to: "/contacts" },
];

export const CONTACT = {
  phone: "+257 79 505 127",
  email: "info@tabito.travel",
  address: "Avenue du Lac Tanganyika, Bujumbura, Burundi",
};
