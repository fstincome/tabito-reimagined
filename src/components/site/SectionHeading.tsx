export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
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
