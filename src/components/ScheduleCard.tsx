import { SCHEDULE, type Direction } from "@/lib/bookings";
import { ArrowRight } from "lucide-react";

export function ScheduleCard({ direction }: { direction: Direction }) {
  const s = SCHEDULE[direction];
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{s.from}</span>
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span>{s.to}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pickup</div>
          <div className="mt-1 font-medium">{s.pickup}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Drop</div>
          <div className="mt-1 font-medium">{s.drop}</div>
        </div>
      </div>
    </div>
  );
}
