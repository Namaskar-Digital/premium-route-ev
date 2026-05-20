export type Direction = "ICH_PUNE" | "PUNE_ICH";

export const STOPS = ["Ichalkaranji", "Sangli", "Karad", "Satara", "Pune"] as const;
export type Stop = (typeof STOPS)[number];

export const SCHEDULE: Record<Direction, { pickup: string; drop: string; from: Stop; to: Stop }> = {
  ICH_PUNE: { pickup: "1:00 PM", drop: "5:00 – 6:00 PM", from: "Ichalkaranji", to: "Pune" },
  PUNE_ICH: { pickup: "6:00 – 6:30 PM", drop: "10:00 – 10:30 PM", from: "Pune", to: "Ichalkaranji" },
};

export const PRICE = 700;
export const TOTAL_SEATS = 6;
export const WHATSAPP_NUMBER = "919999999999"; // placeholder

export interface Booking {
  id: string;
  name: string;
  mobile: string;
  pickup: Stop;
  drop: Stop;
  direction: Direction;
  date: string; // YYYY-MM-DD
  seat: number; // 1..6
  createdAt: number;
}

interface State {
  bookings: Booking[];
  blockedDates: string[]; // YYYY-MM-DD
  manualBlocks: { date: string; direction: Direction; seat: number }[];
  tripDate: string; // currently active trip date
}

const KEY = "ev-bookings-v1";

function load(): State {
  if (typeof window === "undefined") {
    return { bookings: [], blockedDates: [], manualBlocks: [], tripDate: today() };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { bookings: [], blockedDates: [], manualBlocks: [], tripDate: today() };
    const parsed = JSON.parse(raw) as State;
    return { manualBlocks: [], blockedDates: [], bookings: [], tripDate: today(), ...parsed };
  } catch {
    return { bookings: [], blockedDates: [], manualBlocks: [], tripDate: today() };
  }
}

function save(s: State) {
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("bookings:change"));
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getState() {
  return load();
}

export function isSeatTaken(date: string, direction: Direction, seat: number) {
  const s = load();
  return (
    s.bookings.some((b) => b.date === date && b.direction === direction && b.seat === seat) ||
    s.manualBlocks.some((m) => m.date === date && m.direction === direction && m.seat === seat)
  );
}

export function takenSeats(date: string, direction: Direction): number[] {
  const s = load();
  const fromBookings = s.bookings
    .filter((b) => b.date === date && b.direction === direction)
    .map((b) => b.seat);
  const fromManual = s.manualBlocks
    .filter((m) => m.date === date && m.direction === direction)
    .map((m) => m.seat);
  return Array.from(new Set([...fromBookings, ...fromManual]));
}

export function availableCount(date: string, direction: Direction) {
  return TOTAL_SEATS - takenSeats(date, direction).length;
}

export function createBooking(
  data: Omit<Booking, "id" | "createdAt">,
): Booking {
  const s = load();
  const id = "BYD" + Math.random().toString(36).slice(2, 7).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();
  const booking: Booking = { ...data, id, createdAt: Date.now() };
  s.bookings.push(booking);
  save(s);
  return booking;
}

export function getBooking(id: string) {
  return load().bookings.find((b) => b.id === id);
}

export function deleteBooking(id: string) {
  const s = load();
  s.bookings = s.bookings.filter((b) => b.id !== id);
  save(s);
}

export function toggleManualBlock(date: string, direction: Direction, seat: number) {
  const s = load();
  const exists = s.manualBlocks.find(
    (m) => m.date === date && m.direction === direction && m.seat === seat,
  );
  if (exists) {
    s.manualBlocks = s.manualBlocks.filter((m) => m !== exists);
  } else {
    s.manualBlocks.push({ date, direction, seat });
  }
  save(s);
}

export function setTripDate(date: string) {
  const s = load();
  s.tripDate = date;
  save(s);
}

export function toggleBlockedDate(date: string) {
  const s = load();
  if (s.blockedDates.includes(date)) {
    s.blockedDates = s.blockedDates.filter((d) => d !== date);
  } else {
    s.blockedDates.push(date);
  }
  save(s);
}

export function isDateBlocked(date: string) {
  return load().blockedDates.includes(date);
}
