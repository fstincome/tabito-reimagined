import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, CalendarDays, ChevronRight, Compass, FileText, Image, LayoutDashboard, LogOut, MapPin, Menu, MessageSquare, PanelLeftClose, Route, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESOURCES, resourceKey, type Resource } from "@/lib/admin";
import logo from "@/assets/tabito-logo.png";
import { useState } from "react";

const groups = [
  { label: "Échanges & voyages", keys: ["notifications", "bookings", "contact_messages", "newsletter_subscribers"] },
  { label: "Contenus du site", keys: ["pages", "slides", "services", "blog_posts", "events", "gallery_images"] },
  { label: "Destinations & offres", keys: ["sites", "destinations", "cities", "packages-circuits", "packages-bouquets", "opportunities"] },
  { label: "Équipe & réseau", keys: ["team_members", "guides", "partners", "testimonials"] },
];
const icons: Record<string, typeof FileText> = {
  notifications: MessageSquare, bookings: CalendarDays, contact_messages: MessageSquare,
  newsletter_subscribers: Users, pages: FileText, slides: Image, services: LayoutDashboard,
  blog_posts: BookOpen, events: CalendarDays, gallery_images: Image, sites: MapPin,
  destinations: Compass, cities: MapPin, packages: Route, opportunities: BookOpen,
  team_members: Users, guides: Compass, partners: Users, testimonials: MessageSquare,
};

export function AdminShell({ children, resource, mode, editing, email, onResource, onMode, onSignOut }: {
  children: ReactNode;
  resource: Resource;
  mode: "content" | "tracking" | "administrators";
  editing: boolean;
  email: string | null;
  onResource: (resource: Resource) => void;
  onMode: (mode: "tracking" | "administrators") => void;
  onSignOut: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const title = mode === "tracking" ? "Suivi des trajets (GPS)" : mode === "administrators" ? "Administrateurs" : resource.label;
  return (
    <div className="admin-workspace min-h-screen bg-muted/40">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card">
        <div className="rainbow-bar" />
        <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu /></Button>
            <Link to="/" className="flex shrink-0 items-center gap-2"><img src={logo} alt="Logo TABITO" width={44} height={44} className="size-11 object-contain" /><span className="font-display text-xl font-bold text-primary">TABITO</span></Link>
            <span className="hidden border-l border-border pl-4 text-sm text-muted-foreground sm:block">Administration</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 lg:gap-4">
            <span className="hidden max-w-64 truncate text-xs text-muted-foreground xl:block">{email}</span>
            <Button asChild variant="outline" size="sm"><Link to="/"><span className="hidden sm:inline">Voir le site</span><ArrowUpRight /></Link></Button>
            <Button variant="ghost" size="icon" title="Déconnexion" aria-label="Déconnexion" onClick={onSignOut}><LogOut /></Button>
          </div>
        </div>
      </header>
      {menuOpen && <div className="fixed inset-0 top-[68px] z-20 bg-foreground/30 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <aside className={`${menuOpen ? "flex" : "hidden"} fixed bottom-0 left-0 top-[68px] z-30 w-64 flex-col border-r border-border bg-card lg:flex`}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4"><span className="flex items-center gap-2 font-display text-sm font-semibold text-primary"><LayoutDashboard className="size-4" />Espace de gestion</span><Button className="lg:hidden" variant="ghost" size="icon" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)}><PanelLeftClose /></Button></div>
        <nav aria-label="Rubriques de l’administration" className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
          {groups.map((group) => <div key={group.label} className="pt-5"><p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">{group.label}</p><div className="space-y-0.5">{group.keys.map((key) => {
            const item = RESOURCES.find((r) => resourceKey(r) === key);
            if (!item) return null;
            const Icon = icons[item.table] || FileText;
            const selected = mode === "content" && resourceKey(resource) === key;
            return <Button key={key} variant="ghost" aria-current={selected ? "page" : undefined} onClick={() => { onResource(item); setMenuOpen(false); }} className={`h-auto min-h-9 w-full justify-start gap-2.5 px-3 py-2 text-left text-xs whitespace-normal ${selected ? "bg-secondary font-semibold text-primary" : "text-foreground hover:bg-muted"}`}><Icon /><span className="min-w-0 flex-1">{item.label}</span>{selected && <ChevronRight />}</Button>;
          })}</div></div>)}
          <div className="mt-5 border-t border-border pt-4"><p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Administration</p>{([{ mode: "tracking", label: "Suivi des trajets (GPS)", icon: MapPin }, { mode: "administrators", label: "Administrateurs", icon: Settings }] as const).map((item) => <Button key={item.mode} variant="ghost" aria-current={mode === item.mode ? "page" : undefined} className={`w-full justify-start px-3 text-xs ${mode === item.mode ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`} onClick={() => { onMode(item.mode); setMenuOpen(false); }}><item.icon />{item.label}</Button>)}</div>
        </nav>
      </aside>
      <div className="pt-[68px] lg:pl-64">
        <div className="flex min-h-12 flex-wrap items-center gap-2 border-b border-border bg-card px-5 py-3 text-xs text-muted-foreground lg:px-8"><LayoutDashboard className="size-3.5" /><span>Administration</span><ChevronRight className="size-3.5" /><span className="text-foreground">{title}</span>{editing && <><ChevronRight className="size-3.5" /><span className="font-semibold text-primary">Éditeur</span></>}</div>
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}