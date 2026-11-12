import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { services } from "@/lib/services";
import { firebaseConfig } from "@/lib/firebase-config";
import { formatSlot, openSlots, slotKey, DATE_PATTERN, TIME_PATTERN } from "@/lib/appointments";
import { NOTIFY_EMAIL, escapeHtml, layout, sendMail } from "@/lib/mail.server";

// Books an appointment. The slot is claimed by creating `bookedSlots/{date_HHMM}` and the private
// `appointments/{id}` record in ONE atomic Firestore commit. firestore.rules only allows creating a
// bookedSlots doc, never overwriting one, so two people can never hold the same date and time.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = [...services.map((s) => s.name), "Something else"];
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const DB = `projects/${firebaseConfig.projectId}/databases/(default)/documents`;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  // Honeypot: real visitors never fill this hidden field. Pretend it worked.
  if (str(body.website, 100)) return NextResponse.json({ ok: true });

  const name = str(body.name, 160);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  const message = str(body.message, 2000);
  const topic = str(body.topic, 60);
  const date = str(body.date, 10);
  const time = str(body.time, 5);

  if (!name) return NextResponse.json({ message: "Please share your name." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ message: "That email address doesn't look right." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 7) return NextResponse.json({ message: "Please share a phone number we can reach you on." }, { status: 400 });
  if (!DATE_PATTERN.test(date) || !TIME_PATTERN.test(time) || !openSlots(date).includes(time)) {
    return NextResponse.json({ message: "That time isn't available. Please pick another slot.", code: "unavailable" }, { status: 409 });
  }

  const key = slotKey(date, time);
  const id = randomUUID();
  const now = new Date().toISOString();
  const doc = (path: string, fields: Record<string, unknown>) => ({
    update: { name: `${DB}/${path}`, fields },
    currentDocument: { exists: false },
  });

  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/${DB}:commit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        writes: [
          doc(`bookedSlots/${key}`, { date: { stringValue: date }, time: { stringValue: time }, appointmentId: { stringValue: id } }),
          doc(`appointments/${id}`, {
            name: { stringValue: name },
            email: { stringValue: email },
            phone: { stringValue: phone },
            topic: { stringValue: TOPICS.includes(topic) ? topic : "" },
            message: { stringValue: message },
            date: { stringValue: date },
            time: { stringValue: time },
            slotKey: { stringValue: key },
            status: { stringValue: "pending" },
            createdAt: { timestampValue: now },
          }),
        ],
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { error?: { status?: string } } | null;
      // Someone else holds the slot (precondition failed / rules refused the overwrite).
      if (res.status === 409 || res.status === 400 || res.status === 403 || err?.error?.status === "ABORTED") {
        console.error("[appointments] commit refused:", res.status, err?.error?.status);
        return NextResponse.json({ message: "Sorry, that time was just booked. Please choose another slot.", code: "taken" }, { status: 409 });
      }
      throw new Error(String(res.status));
    }
  } catch {
    return NextResponse.json({ message: "We couldn't book your appointment. Please try again or call us." }, { status: 502 });
  }

  // Tell Dr. Prema (best effort: the booking is already saved and shows in the admin panel).
  const when = formatSlot(date, time);
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#9f1239;vertical-align:top">${label}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td></tr>`;
  const origin = request.nextUrl.origin;
  await sendMail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: `New appointment request: ${name}, ${when.date} at ${when.time}`,
    html: layout(
      "New appointment request",
      `<p>A patient has booked a slot and is waiting for your confirmation.</p>
<table style="border-collapse:collapse;font-size:15px">${row("Date", when.date)}${row("Time", when.time)}${row("Name", name)}${row("Phone", phone)}${row("Email", email)}${topic ? row("Topic", topic) : ""}${message ? row("Notes", message) : ""}</table>
<p style="margin-top:20px"><a href="${origin}/admin/appointments" style="background:#e11d48;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Review and accept</a></p>`,
    ),
  });

  return NextResponse.json({ ok: true });
}
