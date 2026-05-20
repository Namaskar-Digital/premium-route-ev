import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { RouteTimeline } from "@/components/RouteTimeline";
import { SeatMap } from "@/components/SeatMap";
import {
  createBooking,
  isDateBlocked,
  PRICE,
  SCHEDULE,
  STOPS,
  takenSeats,
  today,
  type Direction,
  type Stop,
} from "@/lib/bookings";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Seat — Ichalkaranji ↔ Pune EV" },
      { name: "description", content: "Select your seat and confirm your premium EV journey." },
    ],
  }),
  component: Book,
});

function Book() {
  const navigate = useNavigate();
  const [direction, setDirection] = useState<Direction>("ICH_PUNE");
  const [date, setDate] = useState(today());
  const [seat, setSeat] = useState<number | null>(null);
  const [taken, setTaken] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pickup, setPickup] = useState<Stop>(SCHEDULE.ICH_PUNE.from);
  const [drop, setDrop] = useState<Stop>(SCHEDULE.ICH_PUNE.to);
  const [error, setError] = useState("");

  useEffect(() => {
    setTaken(takenSeats(date, direction));
    setSeat(null);
  }, [date, direction]);

  useEffect(() => {
    setPickup(SCHEDULE[direction].from);
    setDrop(SCHEDULE[direction].to);
  }, [direction]);

  const blocked = useMemo(() => isDateBlocked(date), [date]);
  const s = SCHEDULE[direction];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!seat) return setError("Please select a seat.");
    if (!name.trim()) return setError("Enter your full name.");
    if (!/^\d{10}$/.test(mobile.trim())) return setError("Enter a valid 10-digit mobile number.");
    if (pickup === drop) return setError("Pickup and drop cannot be the same.");
    if (blocked) return setError("This date is unavailable.");

    const b = createBooking({
      name: name.trim(),
      mobile: mobile.trim(),
      pickup,
      drop,
      direction,
      date,
      seat,
    });
    navigate({ to: "/confirmation/$id", params: { id: b.id } });
  };

  return (
    <main className="min-h-screen px-5 pb-16 pt-6 max-w-md mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>

      <h1 className="mt-4 text-3xl">Book your seat</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        ₹{PRICE} per seat · 6 premium seats only
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {(["ICH_PUNE", "PUNE_ICH"] as Direction[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDirection(d)}
            className={`rounded-xl border p-3 text-left text-xs transition ${
              direction === d
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card hover:border-foreground/40"
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              {d === "ICH_PUNE" ? "Onward" : "Return"}
            </div>
            <div className="mt-1 font-medium">
              {SCHEDULE[d].from} → {SCHEDULE[d].to}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-4">
        <RouteTimeline reverse={direction === "PUNE_ICH"} />
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

      <div className="mt-4">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Travel date
        </label>
        <input
          type="date"
          value={date}
          min={today()}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
        {blocked && (
          <p className="mt-1 text-xs text-destructive">This date is blocked. Please choose another.</p>
        )}
      </div>

      <div className="mt-6">
        <div className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground text-center">
          Choose a seat
        </div>
        <SeatMap taken={taken} selected={seat} onSelect={setSeat} />
      </div>

      <form onSubmit={submit} className="mt-8 space-y-3">
        <Field label="Full name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="input"
            placeholder="As per ID"
          />
        </Field>
        <Field label="Mobile number">
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            inputMode="numeric"
            className="input"
            placeholder="10-digit number"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Pickup stop">
            <select value={pickup} onChange={(e) => setPickup(e.target.value as Stop)} className="input">
              {STOPS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Drop stop">
            <select value={drop} onChange={(e) => setDrop(e.target.value as Stop)} className="input">
              {STOPS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={blocked}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-medium text-background hover:opacity-90 transition disabled:opacity-40"
        >
          Confirm Booking · ₹{PRICE} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          background: var(--color-card);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus { box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-foreground) 18%, transparent); }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
