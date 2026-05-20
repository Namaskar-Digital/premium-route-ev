import { cn } from "@/lib/utils";
import { TOTAL_SEATS } from "@/lib/bookings";

interface Props {
  taken: number[];
  selected: number | null;
  onSelect: (seat: number) => void;
}

const layout: (number | "D" | null)[][] = [
  ["D", 1],
  [2, 3],
  [4, 5],
  [null, 6],
];

export function SeatMap({ taken, selected, onSelect }: Props) {
  return (
    <div className="mx-auto w-full max-w-[260px] rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Front
      </div>
      <div className="flex flex-col gap-2.5">
        {layout.map((row, ri) => (
          <div key={ri} className="grid grid-cols-2 gap-2.5">
            {row.map((cell, ci) => {
              if (cell === null) return <div key={ci} />;
              if (cell === "D") {
                return (
                  <div
                    key={ci}
                    className="aspect-square rounded-xl border border-dashed border-border flex items-center justify-center text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    Driver
                  </div>
                );
              }
              const isTaken = taken.includes(cell);
              const isSelected = selected === cell;
              return (
                <button
                  key={ci}
                  type="button"
                  disabled={isTaken}
                  onClick={() => onSelect(cell)}
                  className={cn(
                    "aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all",
                    isTaken && "bg-muted text-muted-foreground/60 cursor-not-allowed",
                    !isTaken && !isSelected && "bg-foreground text-background hover:opacity-90",
                    isSelected && "bg-foreground text-background ring-2 ring-offset-2 ring-offset-card ring-foreground",
                  )}
                  aria-label={`Seat ${cell}`}
                >
                  {cell}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between text-[10px] text-muted-foreground">
        <Legend swatch="bg-foreground" label="Available" />
        <Legend swatch="bg-muted border" label="Booked" />
        <Legend swatch="bg-foreground ring-2 ring-foreground ring-offset-1" label="Selected" />
      </div>
      <div className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {TOTAL_SEATS} Premium Seats
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("inline-block w-3 h-3 rounded-md", swatch)} />
      <span>{label}</span>
    </div>
  );
}
