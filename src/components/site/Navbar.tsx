import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

import logoAsset from "@/assets/tabito-logo.png.asset.json";

const logo = logoAsset.url;
import { Button } from "@/components/ui/button";

import { NAV } from "./nav-data";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="rainbow-bar" />
      <div className="mx-auto flex max-w-[95%] items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo TABITO" width={56} height={56} className="size-14 object-contain" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-primary">TABITO</span>
            <span className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              Tanganyika e-Bridge
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                to={item.to}
                activeProps={{ className: "text-accent" }}
                className="flex items-center gap-1 rounded-md px-3 py-2 font-display text-sm font-medium text-foreground transition-colors hover:text-accent"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5" aria-hidden="true" />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-60 translate-y-2 rounded-xl border border-border bg-card p-2 opacity-0 shadow-[var(--shadow-card)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      activeProps={{ className: "bg-secondary text-primary" }}
                      className="block rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="lagoon" size="sm" className="hidden sm:inline-flex">
            <Link to="/reservation">Réserver</Link>
          </Button>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-primary lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <div className="mx-auto max-w-[95%] px-6 py-3">
            {NAV.map((item) => (
              <div key={item.label} className="border-b border-border/60 last:border-0">
                <div className="flex items-center justify-between">
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block flex-1 py-3 font-display text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-label={`Sous-menu ${item.label}`}
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      className="p-2 text-muted-foreground"
                    >
                      <ChevronDown
                        className={`size-4 transition-transform ${expanded === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {item.children && expanded === item.label && (
                  <div className="pb-2 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-sm text-muted-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-3 block py-2 text-sm font-medium text-accent"
            >
              Espace admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
