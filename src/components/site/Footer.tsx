import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

import logoAsset from "@/assets/tabito-logo.png.asset.json";

const logo = logoAsset.url;

import { useI18n } from "@/lib/i18n";

import { CONTACT, NAV } from "./nav-data";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt={t("navbar.logoAlt")}
              width={56}
              height={56}
              loading="lazy"
              className="size-14 rounded-lg bg-card object-contain p-1"
            />
            <span className="font-display text-xl font-bold">TABITO</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/75">
{t("footer.about")}
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={t("footer.social")}
                className="flex size-9 items-center justify-center rounded-full bg-sidebar-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold">{t("footer.navigation")}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.labelKey}>
                <Link
                  to={item.to}
                  className="text-sidebar-foreground/75 transition-colors hover:text-accent"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold">{t("footer.discover")}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { labelKey: "nav.sites", to: "/destinations" },
              { labelKey: "nav.tours", to: "/circuits" },
              { labelKey: "nav.bundles", to: "/bouquets" },
              { labelKey: "nav.guides", to: "/guides" },
              { labelKey: "nav.gallery", to: "/galerie" },
              { labelKey: "nav.smedlab", to: "/smedlab" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sidebar-foreground/75 transition-colors hover:text-accent"
                >
                  {t(l.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold">{t("footer.contact")}</h3>
          <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              {CONTACT.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-sidebar-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TABITO — Tanganyika e-Bridge International Tours.</p>
          <p>{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
