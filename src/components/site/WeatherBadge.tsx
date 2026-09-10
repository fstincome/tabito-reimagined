import { useQuery } from "@tanstack/react-query";
import { Droplets, Wind } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { describeWeather, placeWeatherQuery, weatherQuery } from "@/lib/weather";

type Props =
  | { lat: number; lng: number; place?: undefined; className?: string }
  | { place: string; lat?: undefined; lng?: undefined; className?: string };

/** Live local weather from an automatic service, shown next to geographic data. */
export function WeatherBadge(props: Props) {
  const { L } = useI18n();
  const byCoords = typeof props.lat === "number" && typeof props.lng === "number";
  const { data, isLoading } = useQuery(
    byCoords
      ? weatherQuery(props.lat as number, props.lng as number)
      : placeWeatherQuery(props.place as string),
  );

  if (isLoading) {
    return (
      <span className={`text-xs text-muted-foreground ${props.className ?? ""}`}>
        {L("Météo en cours…", "Loading weather…")}
      </span>
    );
  }
  if (!data) return null;

  const d = describeWeather(data.code);

  return (
    <span
      className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-primary ${props.className ?? ""}`}
      title={L("Météo actuelle de la localité", "Current local weather")}
    >
      <span className="font-semibold">
        {d.icon} {data.temperature}°C
      </span>
      <span className="text-muted-foreground">{L(d.fr, d.en)}</span>
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Wind className="h-3 w-3" aria-hidden="true" /> {data.windSpeed} km/h
      </span>
      {data.humidity != null && (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Droplets className="h-3 w-3" aria-hidden="true" /> {data.humidity}%
        </span>
      )}
    </span>
  );
}
