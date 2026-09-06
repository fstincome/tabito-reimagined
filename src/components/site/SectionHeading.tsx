import { useQuery } from "@tanstack/react-query";

import { pageQuery } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

/**
 * Section heading whose eyebrow (sous-titre), title and description
 * (contenu) are editable from the dashboard via a `pages` row.
 */
export function CmsSectionHeading({
  slug,
  eyebrow,
  title,
  description,
  align = "center",
}: {
  slug: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const { tx } = useI18n();
  const { data: page } = useQuery(pageQuery(slug));
  return (
    <SectionHeading
      eyebrow={tx(page, "subtitle") || eyebrow}
      title={tx(page, "title") || title}
      description={tx(page, "body") || description}
      align={align}
    />
  );
}


export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  align?: "center" | "left" | undefined;
  light?: boolean | undefined;
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`eyebrow ${light ? "text-primary-foreground/70" : ""}`}>{eyebrow}</p>}
      <h2
        className={`mt-2 text-3xl font-bold lg:text-4xl ${light ? "text-primary-foreground" : "text-primary"} ${
          centered ? "rainbow-underline-center" : "rainbow-underline"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-8 text-sm leading-relaxed lg:text-base ${
            light ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
