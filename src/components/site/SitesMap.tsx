import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { sitesQuery } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

const BURUNDI_CENTER: [number, number] = [-3.4275804, 29.9218864];

export function SitesMap() {
  const { lang, L, tx } = useI18n();
  const { data: sites = [] } = useQuery(sitesQuery);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!containerRef.current) return;
      const Leaf = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        const map = Leaf.map(containerRef.current, { scrollWheelZoom: false }).setView(
          BURUNDI_CENTER,
          8,
        );
        Leaf.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);
        mapRef.current = map;
      }

      const map = mapRef.current as import("leaflet").Map;
      map.eachLayer((layer) => {
        if (layer instanceof Leaf.Marker) map.removeLayer(layer);
      });

      const icon = Leaf.divIcon({
        className: "",
        html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:oklch(0.72 0.113 205);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const esc = (v: string) =>
        v.replace(/[&<>"']/g, (c) =>
          c === "&"
            ? "&amp;"
            : c === "<"
              ? "&lt;"
              : c === ">"
                ? "&gt;"
                : c === '"'
                  ? "&quot;"
                  : "&#39;",
        );

      sites
        .filter((s) => s.latitude != null && s.longitude != null)
        .forEach((s) => {
          const lat = s.latitude as number;
          const lng = s.longitude as number;
          const nomSite = tx(s, "nom_site");
          const categorie = tx(s, "categorie");
          const lieu = [s.commune, s.province].filter(Boolean).join(", ");
          const desc = tx(s, "description").trim();
          const shortDesc = desc.length > 180 ? `${desc.slice(0, 180)}…` : desc;

          const html = `
            <div style="width:230px;font-family:inherit">
              ${
                s.image_url
                  ? `<img src="${esc(s.image_url)}" alt="${esc(nomSite)}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px" loading="lazy" />`
                  : ""
              }
              <strong style="font-size:14px;display:block;line-height:1.3">${esc(nomSite)}</strong>
              ${
                categorie
                  ? `<span style="display:inline-block;margin-top:5px;padding:2px 8px;border-radius:999px;background:oklch(0.72 0.113 205 / .18);color:oklch(0.35 0.09 230);font-size:11px;font-weight:600">${esc(categorie)}</span>`
                  : ""
              }
              ${lieu ? `<div style="margin-top:6px;font-size:12px;opacity:.75">📍 ${esc(lieu)}</div>` : ""}
              ${shortDesc ? `<p style="margin:6px 0 0;font-size:12px;line-height:1.45">${esc(shortDesc)}</p>` : ""}
              <div style="margin-top:6px;font-size:11px;opacity:.6">${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
              <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
                <a href="/reservation" style="font-size:12px;font-weight:600;color:oklch(0.45 0.13 235);text-decoration:underline">${esc(L("Réserver", "Book"))}</a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="font-size:12px;font-weight:600;color:oklch(0.45 0.13 235);text-decoration:underline">${esc(L("Itinéraire", "Directions"))}</a>
              </div>
            </div>`;

          Leaf.marker([lat, lng], { icon })
            .addTo(map)
            .bindPopup(html, { minWidth: 230 })
            .bindTooltip(nomSite, { direction: "top", offset: [0, -10] });
        });
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [sites, lang, L, tx]);

  useEffect(() => {
    return () => {
      const map = mapRef.current as import("leaflet").Map | null;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label={L("Carte des sites touristiques du Burundi", "Map of tourist sites in Burundi")}
      className="h-[460px] w-full overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]"
    />
  );
}
