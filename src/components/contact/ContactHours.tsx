"use client";

import { useSyncExternalStore } from "react";
import { ClockIcon as Clock, PhoneCallIcon as PhoneCall, SealCheckIcon as SealCheck } from "@phosphor-icons/react/dist/ssr";
import { CLINIC_INFO } from "@/components/layout/clinic-info";

// Clinic windows in minutes from midnight, indexed by JS weekday (0 = Sunday).
const WINDOWS: ([number, number] | null)[] = [null, [540, 1080], [540, 1080], [540, 1080], [540, 1080], [540, 1080], [540, 840]];
const GROUP_OF_DAY = [2, 0, 0, 0, 0, 0, 1];

// Snapshot is a primitive ("day:open") so it stays referentially stable between ticks.
function snapshot() {
  const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const win = WINDOWS[ist.getDay()];
  const mins = ist.getHours() * 60 + ist.getMinutes();
  const open = !!win && mins >= win[0] && mins < win[1];
  return `${ist.getDay()}:${open ? 1 : 0}`;
}

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

export function ContactHours() {
  const status = useSyncExternalStore(subscribe, snapshot, () => null);
  const now = status ? { day: Number(status.split(":")[0]), open: status.endsWith(":1") } : null;

  const activeGroup = now ? GROUP_OF_DAY[now.day] : -1;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 p-7 text-white shadow-[0_40px_80px_-40px_rgba(159,18,57,0.8)] md:p-9">
      <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-24 size-[22rem] text-white/10">
        {[60, 110, 160].map((r) => (
          <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="relative flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-100">
          <Clock size={16} weight="bold" /> Clinic hours
        </p>
        {now && (
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${now.open ? "bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/40" : "bg-white/10 text-rose-100 ring-1 ring-white/25"}`}>
            <span className={`size-2 rounded-full ${now.open ? "animate-pulse bg-emerald-300" : "bg-rose-200"}`} />
            {now.open ? "Open now" : "Closed now"}
          </span>
        )}
      </div>

      <ul className="relative mt-6 space-y-2.5">
        {CLINIC_INFO.hours.map((slot, i) => {
          const on = i === activeGroup;
          return (
            <li
              key={slot.days}
              className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition-colors ${on ? "bg-white text-rose-950 shadow-[0_14px_28px_-14px_rgba(0,0,0,0.5)]" : "bg-white/10 text-white"}`}
            >
              <span className="text-sm font-semibold">{slot.days}</span>
              <span className={`text-sm ${on ? "font-bold text-rose-600" : "text-rose-50/90"}`}>{slot.time}</span>
            </li>
          );
        })}
      </ul>

      <div className="relative mt-7 border-t border-white/20 pt-6">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <SealCheck size={18} weight="fill" className="text-sky-300" />
          Replies within one business day
        </p>
        <p className="mt-2 text-sm leading-relaxed text-rose-50/80">
          To book or reschedule an appointment, please call the clinic directly.
        </p>
        <a
          href={`tel:${CLINIC_INFO.phone.replace(/\s/g, "")}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-rose-700 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
        >
          <PhoneCall size={18} weight="fill" />
          {CLINIC_INFO.phone}
        </a>
      </div>
    </div>
  );
}
