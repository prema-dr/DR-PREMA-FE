"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRightIcon as ArrowRight,
  CalendarCheckIcon as CalendarCheck,
  CaretDownIcon as CaretDown,
  CheckCircleIcon as CheckCircle,
  ClockIcon as Clock,
  EnvelopeSimpleIcon as EnvelopeSimple,
  LockKeyIcon as LockKey,
  PhoneIcon as Phone,
  UserIcon as User,
} from "@phosphor-icons/react/dist/ssr";
import { services } from "@/lib/services";
import { bookingRange, formatSlot, isClosedDay } from "@/lib/appointments";

type Errors = Partial<Record<"name" | "email" | "phone" | "date" | "time", string>>;
type Slot = { time: string; available: boolean };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTHER_TOPIC = "Something else";

const FIELD =
  "w-full rounded-2xl border border-rose-100 bg-rose-50/40 py-3.5 pl-12 pr-4 text-[15px] text-rose-950 outline-none transition-all placeholder:text-rose-950/40 focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)] aria-[invalid=true]:border-rose-500";

const label12 = (time: string) => formatSlot("2000-01-03", time).time;

const TIME_GROUPS: { label: string; test: (hour: number) => boolean }[] = [
  { label: "Morning", test: (h) => h < 12 },
  { label: "Afternoon", test: (h) => h >= 12 && h < 16 },
  { label: "Evening", test: (h) => h >= 16 },
];

export function BookingForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsState, setSlotsState] = useState<"idle" | "loading" | "closed" | "error">("idle");
  const [sendError, setSendError] = useState("");
  const [booked, setBooked] = useState<{ name: string; date: string; time: string } | null>(null);
  // Computed on the client after mount so it matches the visitor's "today", not the build time.
  const [range, setRange] = useState<{ min: string; max: string } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRange(bookingRange());
  }, []);

  const loadSlots = useCallback(async (forDate: string) => {
    if (!forDate) return;
    setSlotsState("loading");
    setSlots(null);
    try {
      const res = await fetch(`/api/appointments/availability?date=${forDate}`, { cache: "no-store" });
      const data = (await res.json()) as { closed?: boolean; slots?: Slot[] };
      if (!res.ok) throw new Error();
      if (data.closed) return setSlotsState("closed");
      setSlots(data.slots ?? []);
      setSlotsState("idle");
    } catch {
      setSlotsState("error");
    }
  }, []);

  function pickDate(value: string) {
    setDate(value);
    setTime("");
    setErrors((e) => ({ ...e, date: undefined, time: undefined }));
    if (!value) return setSlots(null);
    if (isClosedDay(value)) {
      setSlots(null);
      return setSlotsState("closed");
    }
    void loadSlots(value);
  }

  const freeCount = useMemo(() => slots?.filter((s) => s.available).length ?? 0, [slots]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const website = String(form.get("website") ?? "");

    const next: Errors = {};
    if (!name) next.name = "Please share your name.";
    if (!email) next.email = "Please share an email address.";
    else if (!EMAIL_PATTERN.test(email)) next.email = "That email address doesn't look right.";
    if (phone.replace(/\D/g, "").length < 7) next.phone = "Please share a phone number we can reach you on.";
    if (!date) next.date = "Choose a date.";
    else if (!time) next.time = "Choose a time.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    setSendError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, topic, date, time, website }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { message?: string; code?: string } | null;
        if (res.status === 409) {
          // Someone else got there first: refresh the grid and let the visitor pick again.
          setTime("");
          void loadSlots(date);
        }
        throw new Error(err?.message);
      }
      setBooked({ name: name.split(" ")[0], date, time });
      setStatus("success");
    } catch (error) {
      setSendError(error instanceof Error && error.message ? error.message : "We couldn't book your appointment. Please try again or call us.");
      setStatus("idle");
    }
  }

  if (status === "success" && booked) {
    const when = formatSlot(booked.date, booked.time);
    return (
      <div className="relative flex min-h-[32rem] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-rose-100 bg-white p-10 text-center shadow-[0_40px_80px_-44px_rgba(159,18,57,0.5)]">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-emerald-100/60 blur-3xl" />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_18px_34px_-12px_rgba(16,185,129,0.7)] ring-8 ring-emerald-50">
          <CheckCircle size={44} weight="fill" />
        </span>
        <p className="relative mt-6 font-display text-3xl font-bold text-rose-950">Request received, {booked.name}</p>
        <p className="relative mt-4 rounded-2xl bg-rose-50 px-5 py-3 text-[15px] font-semibold text-rose-900">
          {when.date}
          <span className="block text-rose-600">{when.time}</span>
        </p>
        <p className="relative mt-4 max-w-sm text-[15px] leading-relaxed text-rose-950/65">
          This time is now held for you. Dr. Prema will review it and we&apos;ll email you as soon as the appointment is confirmed.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setBooked(null);
            setDate("");
            setTime("");
            setSlots(null);
            setSlotsState("idle");
          }}
          className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-rose-200 px-6 py-3 text-sm font-semibold text-rose-700 transition-all hover:-translate-y-0.5 hover:bg-rose-50 active:scale-[0.98]"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white shadow-[0_40px_80px_-44px_rgba(159,18,57,0.5)]"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-rose-700 to-rose-800 px-7 py-7 md:px-10">
        <CalendarCheck size={130} weight="light" aria-hidden className="pointer-events-none absolute -right-4 -top-4 rotate-12 text-white/10" />
        <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-rose-100">Book an appointment</p>
        <h2 className="relative mt-1.5 font-display text-2xl font-bold text-white md:text-3xl">Choose a date and time</h2>
      </div>

      <div className="flex flex-col gap-6 p-7 md:p-10">
        {/* Honeypot: hidden from people, tempting for bots. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-rose-950">Name</label>
            <div className="relative mt-2">
              <User size={20} weight="light" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
              <input id="name" name="name" type="text" autoComplete="name" className={FIELD} placeholder="Your full name" aria-invalid={Boolean(errors.name)} />
            </div>
            {errors.name && <p className="mt-1.5 text-xs font-medium text-rose-700">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-semibold text-rose-950">Phone</label>
            <div className="relative mt-2">
              <Phone size={20} weight="light" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
              <input id="phone" name="phone" type="tel" autoComplete="tel" className={FIELD} placeholder="+91" aria-invalid={Boolean(errors.phone)} />
            </div>
            {errors.phone && <p className="mt-1.5 text-xs font-medium text-rose-700">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-semibold text-rose-950">Email</label>
          <div className="relative mt-2">
            <EnvelopeSimple size={20} weight="light" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
            <input id="email" name="email" type="email" autoComplete="email" className={FIELD} placeholder="you@example.com (your confirmation is sent here)" aria-invalid={Boolean(errors.email)} />
          </div>
          {errors.email && <p className="mt-1.5 text-xs font-medium text-rose-700">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="topic" className="text-sm font-semibold text-rose-950">
            Reason for visit <span className="font-normal text-rose-950/45">(optional)</span>
          </label>
          <div className="relative mt-2">
            <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={`${FIELD} appearance-none !pl-5 pr-12`}>
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.slug} value={s.name}>{s.name}</option>
              ))}
              <option value={OTHER_TOPIC}>{OTHER_TOPIC}</option>
            </select>
            <CaretDown size={18} weight="bold" aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-rose-400" />
          </div>
        </div>

        <div>
          <label htmlFor="date" className="text-sm font-semibold text-rose-950">Preferred date</label>
          <input
            id="date"
            type="date"
            value={date}
            min={range?.min}
            max={range?.max}
            disabled={!range}
            onChange={(e) => pickDate(e.target.value)}
            className={`${FIELD} mt-2 !pl-5`}
            aria-invalid={Boolean(errors.date)}
          />
          <p className="mt-1.5 text-xs text-rose-950/50">Mon–Fri 9:00 AM–6:00 PM · Sat 9:00 AM–2:00 PM · Sunday closed</p>
          {errors.date && <p className="mt-1.5 text-xs font-medium text-rose-700">{errors.date}</p>}
        </div>

        {date && (
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-rose-950">
              <Clock size={18} weight="light" className="text-rose-500" />
              Available times
              {slots && <span className="font-normal text-rose-950/50">· {freeCount} free</span>}
            </p>

            {slotsState === "loading" && <p className="mt-3 text-sm text-rose-950/55">Checking availability…</p>}
            {slotsState === "closed" && (
              <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">We are closed on that day. Please choose another date.</p>
            )}
            {slotsState === "error" && (
              <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
                We couldn&apos;t load the times.{" "}
                <button type="button" onClick={() => loadSlots(date)} className="font-semibold underline">Try again</button>
              </p>
            )}
            {slots && slots.length === 0 && (
              <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">No times are left on that day. Please choose another date.</p>
            )}
            {slots && slots.length > 0 && (
              <div role="radiogroup" aria-label="Available times" className="mt-3 space-y-4">
                {TIME_GROUPS.map((group) => {
                  const groupSlots = slots.filter((s) => group.test(Number(s.time.slice(0, 2))));
                  if (groupSlots.length === 0) return null;
                  return (
                    <div key={group.label}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-600">{group.label}</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {groupSlots.map((s) => {
                          const on = s.time === time;
                          return (
                            <button
                              key={s.time}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              disabled={!s.available}
                              onClick={() => {
                                setTime(s.time);
                                setErrors((e) => ({ ...e, time: undefined }));
                              }}
                              className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition-all ${
                                on
                                  ? "border-rose-600 bg-rose-600 text-white shadow-[0_10px_20px_-10px_rgba(225,29,72,0.7)]"
                                  : s.available
                                    ? "border-rose-200 bg-white text-rose-800 hover:border-rose-400 hover:bg-rose-50"
                                    : "cursor-not-allowed border-rose-100 bg-rose-50/60 text-rose-950/30 line-through"
                              }`}
                            >
                              {label12(s.time)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {errors.time && <p className="mt-2 text-xs font-medium text-rose-700">{errors.time}</p>}
          </div>
        )}

        <div>
          <label htmlFor="message" className="text-sm font-semibold text-rose-950">
            Anything we should know? <span className="font-normal text-rose-950/45">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border border-rose-100 bg-rose-50/40 px-5 py-3.5 text-[15px] text-rose-950 outline-none transition-all placeholder:text-rose-950/40 focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)]"
            placeholder="Symptoms, weeks of pregnancy, questions for the doctor…"
          />
        </div>

        {sendError && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{sendError}</p>}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-rose-600 px-8 py-4 text-sm font-bold text-white shadow-[0_16px_30px_-12px_rgba(225,29,72,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-70"
          >
            {status === "submitting" ? "Booking…" : "Book Appointment"}
            <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </button>
          <p className="flex items-start gap-2 text-xs leading-relaxed text-rose-950/55 sm:max-w-[17rem]">
            <LockKey size={16} weight="light" className="mt-0.5 shrink-0 text-rose-400" />
            Your slot is held right away. You&apos;ll get an email once Dr. Prema confirms it.
          </p>
        </div>
      </div>
    </form>
  );
}
