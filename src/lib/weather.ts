import { queryOptions } from "@tanstack/react-query";

export type Weather = {
  temperature: number;
  windSpeed: number;
  humidity: number | null;
  code: number;
  isDay: boolean;
};

const FORECAST = "https://api.open-meteo.com/v1/forecast";
const GEOCODE = "https://geocoding-api.open-meteo.com/v1/search";

/** Current conditions from the free Open-Meteo service (no API key required). */
export async function fetchWeather(lat: number, lng: number): Promise<Weather> {
  const url = `${FORECAST}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("weather unavailable");
  const json = (await res.json()) as {
    current?: {
      temperature_2m?: number;
      relative_humidity_2m?: number;
      wind_speed_10m?: number;
      weather_code?: number;
      is_day?: number;
    };
  };
  const c = json.current ?? {};
  return {
    temperature: Math.round(c.temperature_2m ?? 0),
    windSpeed: Math.round(c.wind_speed_10m ?? 0),
    humidity: typeof c.relative_humidity_2m === "number" ? Math.round(c.relative_humidity_2m) : null,
    code: c.weather_code ?? 0,
    isDay: c.is_day !== 0,
  };
}

/** Resolves a place name (city, commune) to coordinates. */
export async function geocodePlace(name: string): Promise<{ lat: number; lng: number } | null> {
  const res = await fetch(`${GEOCODE}?name=${encodeURIComponent(name)}&count=1&language=fr`);
  if (!res.ok) return null;
  const json = (await res.json()) as { results?: { latitude: number; longitude: number }[] };
  const first = json.results?.[0];
  return first ? { lat: first.latitude, lng: first.longitude } : null;
}

export function weatherQuery(lat: number, lng: number) {
  return queryOptions({
    queryKey: ["weather", lat.toFixed(3), lng.toFixed(3)],
    queryFn: async (): Promise<Weather | null> => fetchWeather(lat, lng),
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}

export function placeWeatherQuery(place: string) {
  return queryOptions({
    queryKey: ["weather", "place", place],
    queryFn: async () => {
      const coords = await geocodePlace(place);
      if (!coords) return null;
      return fetchWeather(coords.lat, coords.lng);
    },
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}

/** WMO weather code → { fr, en, icon }. */
export function describeWeather(code: number): { fr: string; en: string; icon: string } {
  const map: Record<number, { fr: string; en: string; icon: string }> = {
    0: { fr: "Ciel dégagé", en: "Clear sky", icon: "☀️" },
    1: { fr: "Plutôt dégagé", en: "Mainly clear", icon: "🌤️" },
    2: { fr: "Partiellement nuageux", en: "Partly cloudy", icon: "⛅" },
    3: { fr: "Couvert", en: "Overcast", icon: "☁️" },
    45: { fr: "Brouillard", en: "Fog", icon: "🌫️" },
    48: { fr: "Brouillard givrant", en: "Freezing fog", icon: "🌫️" },
    51: { fr: "Bruine légère", en: "Light drizzle", icon: "🌦️" },
    53: { fr: "Bruine", en: "Drizzle", icon: "🌦️" },
    55: { fr: "Bruine dense", en: "Dense drizzle", icon: "🌦️" },
    61: { fr: "Pluie faible", en: "Light rain", icon: "🌧️" },
    63: { fr: "Pluie", en: "Rain", icon: "🌧️" },
    65: { fr: "Forte pluie", en: "Heavy rain", icon: "🌧️" },
    80: { fr: "Averses", en: "Rain showers", icon: "🌦️" },
    81: { fr: "Averses", en: "Rain showers", icon: "🌦️" },
    82: { fr: "Fortes averses", en: "Violent showers", icon: "⛈️" },
    95: { fr: "Orage", en: "Thunderstorm", icon: "⛈️" },
    96: { fr: "Orage avec grêle", en: "Thunderstorm with hail", icon: "⛈️" },
    99: { fr: "Orage avec grêle", en: "Thunderstorm with hail", icon: "⛈️" },
  };
  return map[code] ?? { fr: "Conditions variables", en: "Variable conditions", icon: "🌡️" };
}
