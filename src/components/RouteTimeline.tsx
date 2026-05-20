import { STOPS } from "@/lib/bookings";

export function RouteTimeline({ reverse = false }: { reverse?: boolean }) {
  const stops = reverse ? [...STOPS].reverse() : STOPS;
  return (
    <div className="flex items-center justify-between w-full overflow-x-auto gap-1 py-2">
      {stops.map((stop, i) => (
        <div key={stop} className="flex items-center gap-1 shrink-0">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-foreground" />
            <span className="text-[11px] tracking-wide text-foreground/80 whitespace-nowrap">
              {stop}
            </span>
          </div>
          {i < stops.length - 1 && (
            <div className="w-6 sm:w-10 h-px bg-foreground/30 mb-4" />
          )}
        </div>
      ))}
    </div>
  );
}
