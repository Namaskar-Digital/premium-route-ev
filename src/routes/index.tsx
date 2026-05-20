import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RouteTimeline } from "@/components/RouteTimeline";
import { ScheduleCard } from "@/components/ScheduleCard";
import { TrustIndicators } from "@/components/TrustIndicators";
import { availableCount, getState, PRICE, today } from "@/lib/bookings";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ichalkaranji ↔ Pune Premium EV Travel" },
      {
        name: "description",
        content:
          "Luxury BYD electric vehicle daily service between Ichalkaranji and Pune. Only 6 premium seats. ₹700 per seat.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [avail, setAvail] = useState(6);
  useEffect(() => {
    const update = () => {
      const s = getState();
      setAvail(availableCount(s.tripDate || today(), "ICH_PUNE"));
    };
    update();
    window.addEventListener("bookings:change", update);
    return () => window.removeEventListener("bookings:change", update);
  }, []);

  return (
    <main className="min-h-screen px-5 pb-20 pt-8 max-w-md mx-auto animate-fade-in">
      <header className="flex items-center justify-between">
        <div className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
          BYD · EV
        </div>
        <Link
          to="/admin"
          className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground"
        >
          Admin
        </Link>
      </header>

      <section className="mt-10 animate-fade-up">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[10px] uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          Only {avail} Premium {avail === 1 ? "Seat" : "Seats"} Available
        </div>
        <h1 className="mt-5 text-4xl leading-[1.05]">
          Luxury EV Travel
          <br />
          <span className="italic text-foreground/70">
            Between Ichalkaranji & Pune
          </span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Quiet. Effortless. Premium. A daily BYD electric ride built around just six guests.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Onward Route
        </div>
        <RouteTimeline />
        <div className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">
          Return Route
        </div>
        <RouteTimeline reverse />
      </section>

      <section className="mt-6 grid gap-3">
        <ScheduleCard direction="ICH_PUNE" />
        <ScheduleCard direction="PUNE_ICH" />
      </section>

      <section className="mt-6">
        <TrustIndicators />
      </section>

      <section className="mt-8 flex items-end justify-between rounded-2xl bg-foreground p-5 text-background">
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-70">Fixed Fare</div>
          <div className="mt-1 font-display text-3xl">₹{PRICE}</div>
          <div className="text-[11px] opacity-70">per seat</div>
        </div>
        <Link
          to="/book"
          className="inline-flex items-center gap-1.5 rounded-full bg-background text-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
        >
          Book Seat <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Reach pickup point 10 mins early
      </p>
    </main>
  );
}
