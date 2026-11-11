import { Check } from "lucide-react";
import type { Package } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { referenceTariffRows } from "@/lib/package-tariffs";

export function PackageTariffs({ offer }: { offer: Package }) {
  const { L, tx } = useI18n();
  const rows = referenceTariffRows(offer);
  if (!rows.length) return tx(offer, "price") ? <p className="font-display text-lg font-semibold text-accent">{tx(offer, "price")}</p> : null;
  return <div className="mt-5 border-t border-border pt-4">
    <h4 className="text-sm font-semibold text-primary">{L("Tarifs de référence", "Reference prices")}</h4>
    <dl className="mt-3 space-y-3 text-sm">{rows.map((row) => <div key={row.kind} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <dt className="text-muted-foreground">{row.kind === "economy" ? L("Économique individuel", "Individual economy") : row.kind === "vip" ? L("VIP individuel", "Individual VIP") : L(`Groupe de ${row.people} personnes`, `Group of ${row.people} people`)}</dt>
      <dd className="font-semibold text-accent">{row.amount}</dd>
    </div>)}</dl>
    {rows.some((r) => r.kind === "group") && <p className="mt-3 text-xs text-muted-foreground">{L("Tarif de groupe pour l’ensemble du groupe, non par personne.", "Group price for the whole group, not per person.")}</p>}
  </div>;
}

export function PackageContents({ offer }: { offer: Package }) {
  const { L, tlist } = useI18n();
  const items = tlist(offer, "highlights");
  if (!items.length) return null;
  return <div className="mt-4"><h4 className="text-sm font-semibold text-primary">{L("Contenu du bouquet", "Package inclusions")}</h4><ul className="mt-3 space-y-2">{items.map((item, i) => <li key={`${i}-${item}`} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />{item}</li>)}</ul></div>;
}