/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export type TrackPoint = {
  id: string;
  track_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  recorded_at: string;
};

export type Track = {
  id: string;
  user_id: string;
  label: string | null;
  notes: string | null;
  status: string;
  started_at: string;
  ended_at: string | null;
  start_lat: number | null;
  start_lng: number | null;
  start_label: string | null;
  end_lat: number | null;
  end_lng: number | null;
  end_label: string | null;
  distance_m: number;
};

/** Distance in metres between two coordinates. */
export function haversine(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Human-readable place name for coordinates (OpenStreetMap, best effort). */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { display_name?: string };
    return json.display_name ?? null;
  } catch {
    return null;
  }
}

export function currentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("geolocation unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 20000,
    });
  });
}

export async function startTrack(label: string): Promise<Track> {
  const pos = await currentPosition();
  const { data: session } = await supabase.auth.getUser();
  const userId = session.user?.id;
  if (!userId) throw new Error("not signed in");
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const startLabel = await reverseGeocode(lat, lng);

  const { data, error } = await db
    .from("admin_tracks")
    .insert({
      user_id: userId,
      label: label || null,
      status: "en_cours",
      start_lat: lat,
      start_lng: lng,
      start_label: startLabel,
    })
    .select("*")
    .single();
  if (error) throw error;
  await addPoint(data.id, pos);
  return data as Track;
}

export async function addPoint(trackId: string, pos: GeolocationPosition) {
  const { error } = await db.from("admin_track_points").insert({
    track_id: trackId,
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy ?? null,
    speed: pos.coords.speed ?? null,
    recorded_at: new Date(pos.timestamp || Date.now()).toISOString(),
  });
  if (error) throw error;
}

export async function endTrack(trackId: string, distanceM: number) {
  const pos = await currentPosition().catch(() => null);
  const patch: Record<string, unknown> = {
    status: "termine",
    ended_at: new Date().toISOString(),
    distance_m: Math.round(distanceM),
  };
  if (pos) {
    patch["end_lat"] = pos.coords.latitude;
    patch["end_lng"] = pos.coords.longitude;
    patch["end_label"] = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
    await addPoint(trackId, pos).catch(() => undefined);
  }
  const { error } = await db.from("admin_tracks").update(patch).eq("id", trackId);
  if (error) throw error;
}

export async function listTracks(): Promise<Track[]> {
  const { data, error } = await db
    .from("admin_tracks")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as Track[];
}

export async function listPoints(trackId: string): Promise<TrackPoint[]> {
  const { data, error } = await db
    .from("admin_track_points")
    .select("*")
    .eq("track_id", trackId)
    .order("recorded_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TrackPoint[];
}

export async function deleteTrack(trackId: string) {
  const { error } = await db.from("admin_tracks").delete().eq("id", trackId);
  if (error) throw error;
}

export async function openTrack(): Promise<Track | null> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return null;
  const { data, error } = await db
    .from("admin_tracks")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "en_cours")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return (data as Track) ?? null;
}
