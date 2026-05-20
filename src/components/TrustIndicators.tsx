import { Zap, VolumeX, Snowflake, BatteryCharging, Droplet } from "lucide-react";

const items = [
  { icon: Zap, label: "BYD Electric" },
  { icon: VolumeX, label: "Silent Ride" },
  { icon: Snowflake, label: "AC Comfort" },
  { icon: BatteryCharging, label: "Charging Port" },
  { icon: Droplet, label: "Water Bottle" },
];

export function TrustIndicators() {
  return (
    <div className="grid grid-cols-5 gap-2">
      {items.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-2.5"
        >
          <Icon className="w-4 h-4 text-foreground/70" strokeWidth={1.5} />
          <span className="text-[9px] leading-tight text-center text-muted-foreground tracking-wide">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
