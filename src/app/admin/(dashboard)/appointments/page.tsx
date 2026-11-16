"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarCheckIcon as CalendarCheck,
  CheckIcon as Check,
  EnvelopeSimpleIcon as EnvelopeSimple,
  PhoneIcon as Phone,
  XIcon as X,
} from "@phosphor-icons/react/dist/ssr";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { firebaseAuth, firestore } from "@/lib/firebase";
import { bookingRange, formatSlot, slotKey, type AppointmentStatus } from "@/lib/appointments";
import {
  Button, Card, ConfirmDialog, Drawer, EmptyState, ErrorState, Field, GridSkeleton, PageBody, PageHeader, Select, Tag, inputClass, useToast,
} from "@/components/admin/ui";

type Appointment = {
  id: string; name: string; email: string; phone: string; topic: string; message: string;
  date: string; time: string; slotKey: string; status: AppointmentStatus; createdAt: string;
};

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  declined: "bg-rose-100 text-rose-700",
  cancelled: "bg-gray-200 text-gray-600",
};

type Slot = { time: string; available: boolean };

const label12 = (time: string) => formatSlot("2000-01-03", time).time;

/** Pick a new date and a free time for an appointment; the patient is emailed once it's saved. */
function RescheduleDrawer({ item, onClose, onDone }: { item: Appointment; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const [range] = useState(() => bookingRange());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "closed" | "error">("idle");
  const [saving, setSaving] = useState(false);

  async function pickDate(value: string) {
    setDate(value);
    setTime("");
    setSlots(null);
    if (!value) return setState("idle");
    setState("loading");
    try {
      const res = await fetch(`/api/appointments/availability?date=${value}`, { cache: "no-store" });
      const data = (await res.json()) as { closed?: boolean; slots?: Slot[] };
      if (!res.ok) throw new Error();
      setState(data.closed ? "closed" : "idle");
      setSlots(data.slots ?? []);
    } catch {
      setState("error");
    }
  }

  async function save() {
    if (!date || !time) return;
    setSaving(true);
    try {
      const newKey = slotKey(date, time);
      const batch = writeBatch(firestore());
      // The new slot is created (never overwritten), so a taken time makes the whole change fail.
      batch.set(doc(firestore(), "bookedSlots", newKey), { date, time, appointmentId: item.id });
      batch.delete(doc(firestore(), "bookedSlots", item.slotKey));
      batch.update(doc(firestore(), "appointments", item.id), { date, time, slotKey: newKey, updatedAt: serverTimestamp() });
      await batch.commit();

      let emailed = false;
      try {
        const token = await firebaseAuth().currentUser?.getIdToken();
        const res = await fetch("/api/appointments/status", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: "rescheduled", name: item.name, email: item.email, date, time, oldDate: item.date, oldTime: item.time }),
        });
        emailed = res.ok && ((await res.json()) as { emailed?: boolean }).emailed === true;
      } catch {
        emailed = false;
      }
      toast.success(`Appointment rescheduled${emailed ? ", patient emailed" : ". Email not sent, please contact the patient"}`);
      onDone();
    } catch {
      toast.error("Couldn't reschedule. That time may have just been taken, so please pick another.");
      if (date) void pickDate(date);
    }
    setSaving(false);
  }

  const now = formatSlot(item.date, item.time);
  return (
    <Drawer
      open
      onClose={onClose}
      title="Reschedule appointment"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={save} loading={saving} disabled={!date || !time}>Reschedule &amp; email patient</Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <strong>{item.name}</strong> is currently booked for {now.date} at {now.time}.
        </p>
        <Field label="New date" required>
          <input type="date" min={range.min} max={range.max} value={date} onChange={(e) => void pickDate(e.target.value)} className={inputClass} />
        </Field>
        {state === "loading" && <p className="text-sm text-rose-900/60">Checking availability…</p>}
        {state === "closed" && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">The clinic is closed on that day. Please choose another date.</p>}
        {state === "error" && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">Couldn&apos;t load the available times. Try the date again.</p>}
        {slots && slots.length > 0 && (
          <div role="radiogroup" aria-label="New time" className="space-y-4">
            {[
              { label: "Morning", test: (h: number) => h < 12 },
              { label: "Afternoon", test: (h: number) => h >= 12 && h < 16 },
              { label: "Evening", test: (h: number) => h >= 16 },
            ].map((g) => {
              const list = slots.filter((x) => g.test(Number(x.time.slice(0, 2))));
              if (!list.length) return null;
              return (
                <div key={g.label}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-600">{g.label}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {list.map((x) => (
                      <button
                        key={x.time}
                        type="button"
                        role="radio"
                        aria-checked={x.time === time}
                        disabled={!x.available}
                        onClick={() => setTime(x.time)}
                        className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition-all ${
                          x.time === time
                            ? "border-rose-600 bg-rose-600 text-white"
                            : x.available
                              ? "border-rose-200 bg-white text-rose-800 hover:border-rose-400 hover:bg-rose-50"
                              : "cursor-not-allowed border-rose-100 bg-rose-50/60 text-rose-950/30 line-through"
                        }`}
                      >
                        {label12(x.time)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Drawer>
  );
}

export default function AdminAppointmentsPage() {
  const toast = useToast();
  const [items, setItems] = useState<Appointment[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"" | "active" | AppointmentStatus>("active");
  const [busyId, setBusyId] = useState("");
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [confirm, setConfirm] = useState<{ item: Appointment; status: "declined" | "cancelled" } | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const snap = await getDocs(query(collection(firestore(), "appointments"), orderBy("createdAt", "desc"), limit(300)));
      setItems(
        snap.docs.map((d) => {
          const data = d.data();
          return { id: d.id, ...data, createdAt: data.createdAt?.toDate?.().toISOString() ?? "" } as Appointment;
        }),
      );
    } catch {
      setError("Couldn't load appointments. Check your connection and that you're signed in as an admin.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function setStatus(item: Appointment, status: "accepted" | "declined" | "cancelled") {
    setBusyId(item.id);
    try {
      await updateDoc(doc(firestore(), "appointments", item.id), { status, updatedAt: serverTimestamp() });
      // A declined or cancelled booking gives its time back to the public calendar.
      if (status !== "accepted") await deleteDoc(doc(firestore(), "bookedSlots", item.slotKey));

      let emailed = false;
      try {
        const token = await firebaseAuth().currentUser?.getIdToken();
        const res = await fetch("/api/appointments/status", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status, name: item.name, email: item.email, date: item.date, time: item.time }),
        });
        emailed = res.ok && ((await res.json()) as { emailed?: boolean }).emailed === true;
      } catch {
        emailed = false;
      }
      toast.success(
        `${status === "accepted" ? "Appointment accepted" : status === "declined" ? "Appointment declined" : "Appointment cancelled"}${emailed ? ", patient emailed" : ". Email not sent, please contact the patient"}`,
      );
      setConfirm(null);
      await load();
    } catch {
      toast.error("That change couldn't be saved. Please try again.");
    }
    setBusyId("");
  }

  const shown = useMemo(() => (items ?? []).filter((a) => !filter || (filter === "active" ? a.status === "pending" || a.status === "accepted" : a.status === filter)), [items, filter]);
  const pending = (items ?? []).filter((a) => a.status === "pending").length;
  // Upcoming first within the filtered list.
  shown.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  // By default: pending on top, accepted below. Any other filter shows a single list.
  const groups =
    filter === "active"
      ? [
          { key: "pending", title: "Pending", list: shown.filter((a) => a.status === "pending") },
          { key: "accepted", title: "Accepted", list: shown.filter((a) => a.status === "accepted") },
        ]
      : [{ key: filter || "all", title: "", list: shown }];

  return (
    <>
      <PageHeader title="Appointments" subtitle={pending ? `${pending} waiting for your confirmation` : "Bookings made through the website."} />
      <PageBody>
        <div className="mb-6 flex flex-wrap gap-3">
          <Select value={filter} onChange={(v) => setFilter(v as typeof filter)} className="!w-auto min-w-[160px]">
            <option value="active">Pending &amp; accepted</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
            <option value="">All</option>
          </Select>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : !items ? (
          <GridSkeleton count={4} className="h-32" />
        ) : shown.length === 0 && filter !== "active" ? (
          <EmptyState icon={<CalendarCheck size={28} weight="duotone" />} title="No appointments here" hint="New bookings from the website will appear in this list." />
        ) : (
          <div className="space-y-8">
            {groups.map(({ key, title, list }) => (
              <section key={key}>
                {groups.length > 1 && (
                  <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-rose-950">
                    {title}
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[key as AppointmentStatus] ?? "bg-rose-100 text-rose-700"}`}>{list.length}</span>
                  </h2>
                )}
                {list.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-rose-200 bg-white/60 p-6 text-center text-sm text-rose-900/55">
                    {key === "pending" ? "Nothing is waiting for your confirmation." : "No accepted appointments yet."}
                  </p>
                ) : (
                  <Card className="divide-y divide-rose-100/80 overflow-hidden">
                    {list.map((a) => {
                      const when = formatSlot(a.date, a.time);
                      return (
                        <div key={a.id} className={`p-5 ${a.status === "pending" ? "bg-amber-50/40" : ""}`}>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-display text-base font-semibold text-rose-950">{a.name}</p>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                                {a.topic && <Tag>{a.topic}</Tag>}
                              </div>
                              <p className="mt-1.5 flex items-center gap-2 text-[15px] font-semibold text-rose-900">
                                <CalendarCheck size={16} weight="bold" /> {when.date} · {when.time}
                              </p>
                              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-rose-900/65">
                                <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 hover:text-rose-700">
                                  <EnvelopeSimple size={14} /> {a.email}
                                </a>
                                <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1.5 hover:text-rose-700">
                                  <Phone size={14} /> {a.phone}
                                </a>
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {a.status === "pending" && (
                                <>
                                  <Button size="sm" loading={busyId === a.id} onClick={() => setStatus(a, "accepted")}>
                                    <Check size={14} weight="bold" /> Accept
                                  </Button>
                                  <Button variant="danger" size="sm" disabled={busyId === a.id} onClick={() => setConfirm({ item: a, status: "declined" })}>
                                    <X size={14} weight="bold" /> Decline
                                  </Button>
                                </>
                              )}
                              {(a.status === "pending" || a.status === "accepted") && (
                                <Button variant="secondary" size="sm" disabled={busyId === a.id} onClick={() => setRescheduling(a)}>
                                  Reschedule
                                </Button>
                              )}
                              {a.status === "accepted" && (
                                <Button variant="danger" size="sm" disabled={busyId === a.id} onClick={() => setConfirm({ item: a, status: "cancelled" })}>
                                  Cancel appointment
                                </Button>
                              )}
                            </div>
                          </div>
                          {a.message && <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-rose-950/80">{a.message}</p>}
                        </div>
                      );
                    })}
                  </Card>
                )}
              </section>
            ))}
          </div>
        )}
      </PageBody>

      {rescheduling && (
        <RescheduleDrawer
          key={rescheduling.id}
          item={rescheduling}
          onClose={() => setRescheduling(null)}
          onDone={() => {
            setRescheduling(null);
            void load();
          }}
        />
      )}
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.status === "declined" ? "Decline this appointment?" : "Cancel this appointment?"}
        message={`${confirm?.item.name ?? "The patient"} will be emailed and the time will open up for other patients.`}
        confirmLabel={confirm?.status === "declined" ? "Decline" : "Cancel appointment"}
        loading={Boolean(busyId)}
        onConfirm={() => confirm && setStatus(confirm.item, confirm.status)}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
