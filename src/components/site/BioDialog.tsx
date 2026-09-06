import { Facebook, Languages, Linkedin, Phone, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export type BioPerson = {
  name: string;
  photo?: string | null;
  role?: string | null;
  bio?: string | null;
  speciality?: string | null;
  languages?: string | null;
  phone?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
};

/** "Voir bio" button + modal detailing a team member or a tourist guide. */
export function BioDialog({ person, label = "Voir bio" }: { person: BioPerson; label?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4">
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary">{person.name}</DialogTitle>
          <DialogDescription>
            {person.role || person.speciality || "Équipe TABITO"}
          </DialogDescription>
        </DialogHeader>

        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            width={800}
            height={600}
            className="max-h-72 w-full rounded-xl bg-muted object-contain p-2"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-40 w-full items-center justify-center rounded-xl bg-primary/10 font-display text-4xl font-semibold text-primary"
          >
            {initialsOf(person.name)}
          </div>
        )}


        {person.bio && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {person.bio}
          </p>
        )}

        <dl className="space-y-2 text-sm">
          {person.speciality && (
            <div className="flex gap-2">
              <dt className="font-medium text-primary">Spécialité :</dt>
              <dd className="text-muted-foreground">{person.speciality}</dd>
            </div>
          )}
          {person.languages && (
            <div className="flex items-center gap-2">
              <Languages className="size-4 text-accent" aria-hidden="true" />
              <dd className="text-muted-foreground">{person.languages}</dd>
            </div>
          )}
          {person.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-accent" aria-hidden="true" />
              <dd className="text-muted-foreground">
                <a href={`tel:${person.phone.replace(/\s+/g, "")}`}>{person.phone}</a>
              </dd>
            </div>
          )}
        </dl>

        {(person.facebook || person.twitter || person.linkedin) && (
          <div className="flex gap-4 text-muted-foreground">
            {person.facebook && (
              <a href={person.facebook} aria-label={`Facebook de ${person.name}`}>
                <Facebook className="size-4" aria-hidden="true" />
              </a>
            )}
            {person.twitter && (
              <a href={person.twitter} aria-label={`Twitter de ${person.name}`}>
                <Twitter className="size-4" aria-hidden="true" />
              </a>
            )}
            {person.linkedin && (
              <a href={person.linkedin} aria-label={`LinkedIn de ${person.name}`}>
                <Linkedin className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
