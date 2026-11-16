import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth.server";
import { formatSlot, DATE_PATTERN, TIME_PATTERN } from "@/lib/appointments";
import { escapeHtml, infoCard, layout, sendMail, slotCard } from "@/lib/mail.server";

// Called by the admin panel after it accepts, declines or cancels a booking: emails the patient.
// The status change itself is written to Firestore by the admin's own signed-in session.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const b = (await request.json().catch(() => null)) as Record<string, string> | null;
  if (!b || !EMAIL.test(b.email ?? "") || !DATE_PATTERN.test(b.date ?? "") || !TIME_PATTERN.test(b.time ?? "") || !["accepted", "declined", "cancelled", "rescheduled"].includes(b.status)) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  const name = escapeHtml((b.name ?? "").slice(0, 160) || "there");
  const when = formatSlot(b.date, b.time);
  const slot = slotCard(when.date, when.time);
  const address = infoCard();

  if (b.status === "rescheduled" && (!DATE_PATTERN.test(b.oldDate ?? "") || !TIME_PATTERN.test(b.oldTime ?? ""))) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const mail =
    b.status === "rescheduled"
      ? (() => {
          const was = formatSlot(b.oldDate, b.oldTime);
          return {
            subject: `Your appointment has been rescheduled: ${when.date}, ${when.time}`,
            html: layout(
              "Your appointment has been rescheduled",
              `<p>Hello ${name},</p><p>Dr. Prema has moved your appointment from <s>${was.date}, ${was.time}</s> to the new time below.</p>${slotCard(when.date, when.time, "New time")}<p>Please arrive a few minutes early. If this new time doesn't suit you, please call us and we'll find another.</p>${address}`,
            ),
          };
        })()
      : b.status === "accepted"
      ? { subject: `Your appointment is confirmed: ${when.date}, ${when.time}`, html: layout("Your appointment is confirmed", `<p>Hello ${name},</p><p>Dr. Prema has accepted your appointment.</p>${slot}<p>Please arrive a few minutes early. If you need to change the time, just give us a call.</p>${address}`) }
      : {
          subject: `About your appointment request for ${when.date}`,
          html: layout(
            b.status === "declined" ? "We couldn't confirm that time" : "Your appointment was cancelled",
            `<p>Hello ${name},</p><p>${b.status === "declined" ? "Unfortunately Dr. Prema isn't able to see you at" : "Your appointment for"}</p>${slot}<p>${b.status === "declined" ? "Please book another time on our website or call the clinic and we'll find a slot that suits you." : "is no longer scheduled. You're welcome to book another time on our website."}</p>${address}`,
          ),
        };

  console.log(`[appointments] status "${b.status}" for ${b.date} ${b.time}: emailing the patient`);
  const sent = await sendMail({ to: b.email, ...mail });
  console.log(`[appointments] patient email ${sent ? "sent" : "NOT sent (see [mail] lines above)"}`);
  return NextResponse.json({ ok: true, emailed: sent });
}
