import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  deleteBooking,
  getState,
  isDateBlocked,
  SCHEDULE,
  setTripDate,
  takenSeats,
  toggleBlockedDate,
  toggleManualBlock,
  today,
  TOTAL_SEATS,
  type Booking,
  type Direction,
} from "@/lib/bookings";
import { ArrowLeft, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · BYD EV" }] }),
  component: Admin,
});

function Admin() {
  const [, setTick] = useState(0);
  const [date, setDate] = useState(() => getState().tripDate || today());
  const [direction, setDirection] = useState<Direction>("ICH_PUNE");

  useEffect(() => {
    const u = () => setTick((n) => n + 1);
    window.addEventListener("bookings:change", u);
    return () => window.removeEventListener("bookings:change", u);
  }, []);

  const state = getState();
  const bookings = state.bookings.filter((b) => b.date === date && b.direction === direction);
  const taken = takenSeats(date, direction);
  const blocked = isDateBlocked(date);

  return (
    <main className="min-h-screen px-5 pb-16 pt-6 max-w-md mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>
      <h1 className="mt-4 text-3xl">Admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage trips, seats and passengers.</p>

      <section className="mt-6 space-y-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Trip date
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm"
            />
            <button
              onClick={() => setTripDate(date)}
              className="rounded-xl bg-foreground px-3 text-xs font-medium text-background"
            >
              Set Active
            </button>
          </div>
          <button
            onClick={() => toggleBlockedDate(date)}
            className={`mt-2 w-full rounded-xl border px-3 py-2 text-xs ${
              blocked ? "border-destructive text-destructive" : "border-border"
            }`}
          >
            {blocked ? "Unblock this date" : "Block this date"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(["ICH_PUNE", "PUNE_ICH"] as Direction[]).map((d) => (
            <button
              key={d}
              onClick={() => setDirection(d)}
              className={`rounded-xl border p-2 text-xs ${
                direction === d ? "border-foreground bg-foreground text-background" : "border-border bg-card"
              }`}
            >
              {SCHEDULE[d].from} → {SCHEDULE[d].to}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          Seats — tap to mark booked / free
        </div>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map((n) => {
            const isTaken = taken.includes(n);
            const isPassengerBooked = bookings.some((b) => b.seat === n);
            return (
              <button
                key={n}
                onClick={() => !isPassengerBooked && toggleManualBlock(date, direction, n)}
                disabled={isPassengerBooked}
                className={`aspect-square rounded-lg text-sm font-medium transition ${
                  isTaken
                    ? "bg-muted text-muted-foreground border border-border"
                    : "bg-foreground text-background"
                } ${isPassengerBooked ? "opacity-70 cursor-not-allowed" : ""}`}
                title={isPassengerBooked ? "Booked by passenger" : ""}
              >
                {n}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Grey = unavailable. Black = free. Passenger-booked seats can't be freed without removing the booking.
        </p>
      </section>

      <section className="mt-8">
        <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          Passenger list ({bookings.length})
        </div>
        {bookings.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No bookings yet for this trip.
          </p>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b) => (
              <BookingRow key={b.id} b={b} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function BookingRow({ b }: { b: Booking }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
      <div>
        <div className="text-sm font-medium">
          Seat {b.seat} · {b.name}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {b.mobile} · {b.pickup} → {b.drop}
        </div>
        <div className="text-[10px] text-muted-foreground font-mono">{b.id}</div>
      </div>
      <button
        onClick={() => {
          if (confirm("Remove this booking?")) deleteBooking(b.id);
        }}
        className="text-muted-foreground hover:text-destructive p-2"
        aria-label="Remove"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}
