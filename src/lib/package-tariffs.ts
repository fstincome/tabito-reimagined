export type ReferenceTariffs = {
  economy_price?: number | null;
  vip_price?: number | null;
  group_price_min?: number | null;
  group_price_max?: number | null;
  group_people_min?: number | null;
  group_people_max?: number | null;
  currency?: string | null;
};

export function referenceTariffRows(p: ReferenceTariffs) {
  const currency = p.currency || "USD";
  const rows: { kind: "economy" | "vip" | "group"; amount: string; people?: string }[] = [];
  if (p.economy_price != null) rows.push({ kind: "economy", amount: `${p.economy_price} ${currency}` });
  if (p.vip_price != null) rows.push({ kind: "vip", amount: `${p.vip_price} ${currency}` });
  if (p.group_price_min != null && p.group_price_max != null) rows.push({ kind: "group", amount: `${p.group_price_min}–${p.group_price_max} ${currency}`, people: `${p.group_people_min ?? 2}–${p.group_people_max ?? 5}` });
  return rows;
}

export function validateReferenceTariffs(p: ReferenceTariffs): string | null {
  const amounts = [p.economy_price, p.vip_price, p.group_price_min, p.group_price_max];
  if (amounts.some((v) => v != null && (!Number.isFinite(v) || v < 0))) return "Les tarifs doivent être des montants positifs ou nuls.";
  if ((p.group_price_min == null) !== (p.group_price_max == null)) return "Renseignez les deux bornes du tarif de groupe.";
  if (p.group_price_min != null && p.group_price_max != null && p.group_price_max < p.group_price_min) return "Le tarif maximum du groupe doit être supérieur ou égal au minimum.";
  const min = p.group_people_min ?? 2;
  const max = p.group_people_max ?? 5;
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max < min) return "Vérifiez le nombre minimum et maximum de personnes du groupe.";
  return null;
}