// Shared (browser + server) booking rules: clinic hours, slot grid, and date helpers.
// Keep the hours in sync with CLINIC_INFO.hours in components/layout/clinic-info.ts.

export const SLOT_MINUTES = 60;
export const BOOKING_WINDOW_DAYS = 30;
export const CLINIC_TIME_ZONE = "Asia/Kolkata";

/** Opening hours in minutes from midnight, by weekday (0 = Sunday). Closed days are omitted. */
const HOURS: Record<number, { open: number; close: number }> = {
  1: { open: 9 * 60, close: 18 * 60 },
  2: { open: 9 * 60, close: 18 * 60 },
  3: { open: 9 * 60, close: 18 * 60 },
  4: { open: 9 * 60, close: 18 * 60 },
  5: { open: 9 * 60, close: 18 * 60 },
  6: { open: 9 * 60, close: 14 * 60 },
};

export type AppointmentStatus = "pending" | "accepted" | "declined" | "cancelled";

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_PATTERN = /^\d{2}:\d{2}$/;

export const slotKey = (date: string, time: string) => `${date}_${time.replace(":", "")}`;

const pad = (n: number) => String(n).padStart(2, "0");
export const minutesToTime = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

function isRealDate(date: string) {
  if (!DATE_PATTERN.test(date)) return false;
  const d = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
}

/** Current date (YYYY-MM-DD) and minutes since midnight in the clinic's time zone. */
export function clinicNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: CLINIC_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(now).map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Earliest and latest bookable dates. */
export function bookingRange(now = new Date()) {
  const today = clinicNow(now).date;
  return { min: today, max: addDays(today, BOOKING_WINDOW_DAYS) };
}

/** All start times (HH:MM) the clinic offers on `date`, regardless of bookings. Empty on closed or invalid days. */
export function daySlots(date: string): string[] {
  if (!isRealDate(date)) return [];
  const hours = HOURS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  if (!hours) return [];
  const out: string[] = [];
  for (let m = hours.open; m + SLOT_MINUTES <= hours.close; m += SLOT_MINUTES) out.push(minutesToTime(m));
  return out;
}

export const isClosedDay = (date: string) => daySlots(date).length === 0;

/** Slots on `date` that are still in the future (and inside the booking window). */
export function openSlots(date: string, now = new Date()): string[] {
  const { min, max } = bookingRange(now);
  if (date < min || date > max) return [];
  const clock = clinicNow(now);
  return daySlots(date).filter((t) => date > clock.date || Number(t.slice(0, 2)) * 60 + Number(t.slice(3)) > clock.minutes);
}

export function formatSlot(date: string, time: string) {
  const d = new Date(`${date}T${time}:00+05:30`);
  return {
    date: d.toLocaleDateString("en-IN", { timeZone: CLINIC_TIME_ZONE, weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { timeZone: CLINIC_TIME_ZONE, hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase(),
  };
}
