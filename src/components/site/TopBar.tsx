import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, Phone, ShieldCheck, Twitter } from "lucide-react";

import { CONTACT } from "./nav-data";

export function TopBar() {
  return (
    <div className="hidden bg-primary text-primary-foreground lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 text-[0.8rem]">
        <div className="flex items-center gap-6">
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            {CONTACT.phone}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100"
          >
            <Mail className="size-3.5" aria-hidden="true" />
            {CONTACT.email}
          </a>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Twitter, label: "Twitter" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Linkedin, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <Icon className="size-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
          <Link
            to="/login"
            className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground transition-transform hover:-translate-y-px"
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Espace admin
          </Link>
        </div>
      </div>
    </div>
  );
}
