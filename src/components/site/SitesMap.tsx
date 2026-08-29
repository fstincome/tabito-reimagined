import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { sitesQuery } from "@/lib/content";

const BURUNDI_CENTER: [number, number] = [-3.4275804, 29.9218864];

export function SitesMap() {
  const { data: sites = [] } = useQuery(sitesQuery);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!containerRef.current) return;
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(
          BURUNDI_CENTER,
          8,
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);
        mapRef.current = map;
      }

      const map = mapRef.current as import("leaflet").Map;
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
      });

      const icon = L.divIcon({
        className: "",
        html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:oklch(0.72 0.113 205);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      sites
        .filter((s) => s.latitude != null && s.longitude != null)
        .forEach((s) => {
          L.marker([s.latitude as number, s.longitude as number], { icon })
            .addTo(map)
            .bindPopup(
              `<strong>${s.nom_site}</strong>${s.province ? `<br/><small>${s.province}</small>` : ""}`,
            );
        });
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [sites]);

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
      aria-label="Carte des sites touristiques du Burundi"
      className="h-[460px] w-full overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]"
    />
  );
}
