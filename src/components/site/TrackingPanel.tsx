import { MapPin, Play, Square, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type Track,
  type TrackPoint,
  addPoint,
  deleteTrack,
  endTrack,
  haversine,
  listPoints,
  listTracks,
  openTrack,
  startTrack,
} from "@/lib/tracking";

function fmtDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function fmtCoords(lat: number | null, lng: number | null) {
  if (lat == null || lng == null) return "—";
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function fmtDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}

/** Live GPS tracking of the signed-in admin, with start/end points per trip. */
export function TrackingPanel() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [active, setActive] = useState<Track | null>(null);
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [distance, setDistance] = useState(0);
  const [last, setLast] = useState<{ lat: number; lng: number } | null>(null);
  const [details, setDetails] = useState<{ track: Track; points: TrackPoint[] } | null>(null);
  const watchRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      setTracks(await listTracks());
    } catch {
      toast.error("Chargement des trajets impossible. Droits administrateur requis.");
    }
  }, []);

  useEffect(() => {
    void refresh();
    void openTrack().then((t) => {
      if (t) {
        setActive(t);
        setDistance(t.distance_m ?? 0);
      }
    });
  }, [refresh]);

  // Records positions while a trip is open.
  useEffect(() => {
    if (!active || typeof navigator === "undefined" || !navigator.geolocation) return;
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLast((prev) => {
          if (prev) {
            const d = haversine(prev, point);
            if (d < 15) return prev; // ignore GPS jitter
            setDistance((x) => x + d);
          }
          void addPoint(active.id, pos).catch(() => undefined);
          return point;
        });
      },
      () => toast.error("Position indisponible. Autorisez la géolocalisation."),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 },
    );
    return () => {
      if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    };
  }, [active]);

  async function start() {
    setBusy(true);
    try {
      const track = await startTrack(label.trim());
      setActive(track);
      setDistance(0);
      setLast(track.start_lat != null ? { lat: track.start_lat, lng: track.start_lng ?? 0 } : null);
      setLabel("");
      toast.success("Trajet démarré. Votre point de départ est enregistré.");
      await refresh();
    } catch {
      toast.error("Impossible de démarrer le trajet (géolocalisation ou droits).");
    }
    setBusy(false);
  }

  async function stop() {
    if (!active) return;
    setBusy(true);
    try {
      await endTrack(active.id, distance);
      setActive(null);
      setLast(null);
      setDistance(0);
      toast.success("Trajet terminé. Point d'arrivée enregistré.");
      await refresh();
    } catch {
      toast.error("Impossible de terminer le trajet.");
    }
    setBusy(false);
  }

  async function show(track: Track) {
    try {
      setDetails({ track, points: await listPoints(track.id) });
    } catch {
      toast.error("Positions indisponibles.");
    }
  }

  async function remove(track: Track) {
    if (!confirm("Supprimer ce trajet et ses positions ?")) return;
    try {
      await deleteTrack(track.id);
      if (details?.track.id === track.id) setDetails(null);
      if (active?.id === track.id) setActive(null);
      await refresh();
      toast.success("Trajet supprimé.");
    } catch {
      toast.error("Suppression impossible.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="surface-card space-y-4 p-6">
        <h2 className="font-display text-base font-semibold text-primary">
          Suivi de mes déplacements
        </h2>
        {active ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Trajet en cours{active.label ? ` — ${active.label}` : ""} · démarré le{" "}
              {fmtDate(active.started_at)}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-primary">Départ :</span>{" "}
              {active.start_label || fmtCoords(active.start_lat, active.start_lng)}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-primary">Position actuelle :</span>{" "}
              {last ? fmtCoords(last.lat, last.lng) : "en attente du GPS…"} ·{" "}
              {fmtDistance(distance)} parcourus
            </p>
            <Button variant="outline" onClick={stop} disabled={busy}>
              <Square className="size-4" aria-hidden="true" />
              Terminer le trajet
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="track-label">Objet du trajet (facultatif)</Label>
              <Input
                id="track-label"
                value={label}
                placeholder="Visite site Rumonge, accompagnement client…"
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <Button variant="lagoon" onClick={start} disabled={busy}>
              <Play className="size-4" aria-hidden="true" />
              Démarrer le trajet
            </Button>
            <p className="text-xs text-muted-foreground">
              Votre navigateur demandera l'accès à la position. Le suivi s'arrête dès que vous
              cliquez sur « Terminer le trajet ».
            </p>
          </div>
        )}
      </div>

      <div className="surface-card overflow-hidden">
        {tracks.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Aucun trajet enregistré.</p>
        ) : (
          <ul className="divide-y divide-border">
            {tracks.map((t) => (
              <li key={t.id} className="space-y-2 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-display text-sm font-semibold text-primary">
                    {t.label || "Trajet"}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                      t.status === "en_cours"
                        ? "bg-accent/20 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {t.status === "en_cours" ? "En cours" : "Terminé"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {fmtDate(t.started_at)} → {fmtDate(t.ended_at)} · {fmtDistance(t.distance_m ?? 0)}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => show(t)}>
                      Voir le tracé
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => remove(t)}>
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  <MapPin className="mr-1 inline size-3" aria-hidden="true" />
                  Départ : {t.start_label || fmtCoords(t.start_lat, t.start_lng)}
                </p>
                <p className="text-xs text-muted-foreground">
                  <MapPin className="mr-1 inline size-3" aria-hidden="true" />
                  Arrivée : {t.end_label || fmtCoords(t.end_lat, t.end_lng)}
                </p>
                {details?.track.id === t.id && (
                  <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-border">
                    <table className="w-full text-xs">
                      <thead className="bg-muted text-left">
                        <tr>
                          <th className="px-3 py-2">Heure</th>
                          <th className="px-3 py-2">Latitude</th>
                          <th className="px-3 py-2">Longitude</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.points.map((p) => (
                          <tr key={p.id} className="border-t border-border">
                            <td className="px-3 py-1.5">{fmtDate(p.recorded_at)}</td>
                            <td className="px-3 py-1.5">{p.latitude.toFixed(5)}</td>
                            <td className="px-3 py-1.5">{p.longitude.toFixed(5)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
