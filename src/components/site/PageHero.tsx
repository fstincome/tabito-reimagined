import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import heroDefault from "@/assets/hero-tanganyika.jpg";

export function PageHero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string | undefined;
  image?: string | undefined;
}) {

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={image ?? heroDefault}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 gradient-lagoon opacity-80" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 text-primary-foreground lg:py-28">
        <h1 className="rainbow-underline text-4xl font-bold lg:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-8 max-w-2xl text-sm text-primary-foreground/85 lg:text-base">
            {subtitle}
          </p>
        )}
        <nav
          aria-label="Fil d'ariane"
          className="mt-6 flex items-center gap-2 text-xs text-primary-foreground/80"
        >
          <Link to="/" className="hover:text-primary-foreground">
            Accueil
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="font-medium text-primary-foreground">{title}</span>
        </nav>
      </div>
    </section>
  );
}
