import { createFileRoute, Link } from "@tanstack/react-router";
import { getBooking, SCHEDULE, WHATSAPP_NUMBER, PRICE } from "@/lib/bookings";
import { CheckCircle2, MessageCircle, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/confirmation/$id")({
  component: Confirmation,
});

function Confirmation() {
  const { id } = Route.useParams();
  const booking = getBooking(id);

  if (!booking) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 max-w-md mx-auto">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Booking not found.</p>
          <Link to="/" className="mt-3 inline-block text-sm underline">Go home</Link>
        </div>
      </main>
    );
  }

  const s = SCHEDULE[booking.direction];
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `BYD-EV|${booking.id}|${booking.name}|Seat ${booking.seat}|${booking.date}`,
  )}`;
  const waText = encodeURIComponent(
    `Hi, I need help with my booking ${booking.id} (Seat ${booking.seat}, ${booking.date}).`,
  );

  return (
    <main className="min-h-screen px-5 pb-16 pt-8 max-w-md mx-auto animate-fade-in">
      <div className="flex flex-col items-center text-center animate-fade-up">
        <div className="rounded-full bg-foreground/5 p-3">
          <CheckCircle2 className="w-7 h-7" strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 text-3xl">Booking Confirmed</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A premium seat is reserved for you.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Booking ID
            </div>
            <div className="mt-1 font-mono text-sm">{booking.id}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Seat</div>
            <div className="mt-1 font-display text-2xl">{booking.seat}</div>
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <img
            src={qrUrl}
            alt="Booking QR"
            className="rounded-xl border border-border bg-background p-2"
            width={180}
            height={180}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <Info label="Passenger" value={booking.name} />
          <Info label="Mobile" value={booking.mobile} />
          <Info label="Date" value={booking.date} />
          <Info label="Fare" value={`₹${PRICE}`} />
          <Info label="Pickup stop" value={booking.pickup} />
          <Info label="Drop stop" value={booking.drop} />
        </div>

        <div className="mt-5 rounded-xl bg-muted/60 p-3">
          <div className="flex items-center gap-2 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5" /> {s.from} → {s.to}
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pickup {s.pickup}
            </span>
            <span>·</span>
            <span>Drop {s.drop}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-foreground/20 bg-foreground/[0.03] p-3 text-center text-xs">
        Please reach the pickup point <span className="font-medium">10 minutes early</span>.
      </div>

      <a
        href={`https://wa.me/918956999699?text=${waText}`}
        target="_blank"
        rel="noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-medium hover:bg-muted transition"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp Support
      </a>

      <Link
        to="/"
        className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground"
      >
        Back to home
      </Link>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
