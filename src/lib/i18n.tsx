import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";

const STORAGE_KEY = "tabito-lang";

/** Translation dictionary. French is the source language. */
const DICT: Record<string, { fr: string; en: string }> = {
  // Nav
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.about": { fr: "À propos", en: "About" },
  "nav.who": { fr: "Qui sommes-nous", en: "Who we are" },
  "nav.mission": { fr: "Notre mission", en: "Our mission" },
  "nav.vision": { fr: "Notre vision", en: "Our vision" },
  "nav.values": { fr: "Nos valeurs", en: "Our values" },
  "nav.principles": { fr: "Nos principes", en: "Our principles" },
  "nav.team": { fr: "Notre équipe", en: "Our team" },
  "nav.smedlab": { fr: "SMED LAB", en: "SMED LAB" },
  "nav.news": { fr: "Actualités", en: "News" },
  "nav.blog": { fr: "Blog", en: "Blog" },
  "nav.events": { fr: "Évènements", en: "Events" },
  "nav.jobs": { fr: "Emplois", en: "Jobs" },
  "nav.funding": { fr: "Financements", en: "Funding" },
  "nav.training": { fr: "Formations", en: "Training" },
  "nav.destinations": { fr: "Destinations", en: "Destinations" },
  "nav.sites": { fr: "Sites touristiques", en: "Tourist sites" },
  "nav.cities": { fr: "Villes du Burundi", en: "Cities of Burundi" },
  "nav.tours": { fr: "Circuits", en: "Tours" },
  "nav.bundles": { fr: "Bouquets", en: "Packages" },
  "nav.guides": { fr: "Guides touristiques", en: "Tour guides" },
  "nav.gallery": { fr: "Galerie", en: "Gallery" },
  "nav.book": { fr: "Réserver", en: "Book now" },
  "nav.account": { fr: "Mon espace", en: "My account" },
  "nav.partners": { fr: "Partenaires", en: "Partners" },
  "nav.contacts": { fr: "Contacts", en: "Contact" },

  // Top bar
  "top.admin": { fr: "Espace admin", en: "Admin area" },
  "top.language": { fr: "Langue", en: "Language" },

  // Navbar
  "navbar.tagline": { fr: "Tanganyika e-Bridge", en: "Tanganyika e-Bridge" },
  "navbar.openMenu": { fr: "Ouvrir le menu", en: "Open menu" },
  "navbar.submenu": { fr: "Sous-menu", en: "Submenu" },
  "navbar.logoAlt": { fr: "Logo TABITO", en: "TABITO logo" },

  // Footer
  "footer.about": {
    fr: "Tanganyika e-Bridge International Tours — l'agence qui fait rayonner le patrimoine naturel et culturel du Burundi auprès des voyageurs du monde entier.",
    en: "Tanganyika e-Bridge International Tours — the agency showcasing Burundi's natural and cultural heritage to travellers from around the world.",
  },
  "footer.navigation": { fr: "Navigation", en: "Navigation" },
  "footer.discover": { fr: "Découvrir", en: "Discover" },
  "footer.contact": { fr: "Contact", en: "Contact" },
  "footer.social": { fr: "Réseau social TABITO", en: "TABITO social network" },
  "footer.rights": { fr: "Tous droits réservés.", en: "All rights reserved." },

  // Newsletter
  "newsletter.eyebrow": { fr: "Restons en contact", en: "Stay in touch" },
  "newsletter.title": {
    fr: "Recevez nos circuits et actualités",
    en: "Get our tours and latest news",
  },
  "newsletter.text": {
    fr: "Nouvelles destinations, évènements culturels, appels à financement et opportunités de formation : tout arrive directement dans votre boîte mail.",
    en: "New destinations, cultural events, funding calls and training opportunities — delivered straight to your inbox.",
  },
  "newsletter.emailLabel": { fr: "Adresse email", en: "Email address" },
  "newsletter.submit": { fr: "Je m'abonne", en: "Subscribe" },
  "newsletter.sending": { fr: "Envoi…", en: "Sending…" },
  "newsletter.duplicate": {
    fr: "Cette adresse est déjà inscrite.",
    en: "This address is already subscribed.",
  },
  "newsletter.error": {
    fr: "Inscription impossible pour le moment.",
    en: "Subscription is not possible right now.",
  },
  "newsletter.success": {
    fr: "Merci ! Vous êtes inscrit à notre newsletter.",
    en: "Thank you! You are subscribed to our newsletter.",
  },

  // Shared UI
  "ui.seeBio": { fr: "Voir bio", en: "View bio" },
  "ui.close": { fr: "Fermer", en: "Close" },
  "ui.readMore": { fr: "Lire la suite", en: "Read more" },
  "ui.loading": { fr: "Chargement…", en: "Loading…" },
};

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  /** Inline translation: L("texte français", "english text"). */
  L: (fr: string, en: string) => string;
  /** Localized CMS column: tx(row, "title") reads title_en in English when filled. */
  tx: <T extends Record<string, unknown>>(row: T | null | undefined, field: string) => string;
  /** Localized CMS list column (jsonb arrays). */
  tlist: <T extends Record<string, unknown>>(
    row: T | null | undefined,
    field: string,
  ) => string[];
};

const I18nContext = createContext<I18nValue | null>(null);

function makeHelpers(lang: Lang) {
  const L = (fr: string, en: string) => (lang === "en" ? en : fr);

  const tx = <T extends Record<string, unknown>>(row: T | null | undefined, field: string) => {
    if (!row) return "";
    const en = row[`${field}_en`];
    if (lang === "en" && typeof en === "string" && en.trim() !== "") return en;
    const fr = row[field];
    return typeof fr === "string" ? fr : "";
  };

  const tlist = <T extends Record<string, unknown>>(row: T | null | undefined, field: string) => {
    if (!row) return [];
    const pick = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => !!x) : []);
    const en = pick(row[`${field}_en`]);
    if (lang === "en" && en.length > 0) return en;
    return pick(row[field]);
  };

  return { L, tx, tlist };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") {
      setLangState(stored);
      return;
    }
    if (navigator.language?.toLowerCase().startsWith("en")) setLangState("en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback((key: string) => DICT[key]?.[lang] ?? key, [lang]);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t, ...makeHelpers(lang) }),
    [lang, setLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  // Safe fallback (e.g. components rendered outside the provider during SSR).
  return {
    lang: "fr",
    setLang: () => {},
    t: (key) => DICT[key]?.fr ?? key,
    ...makeHelpers("fr"),
  };
}

