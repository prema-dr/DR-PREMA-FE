import { CLINIC_INFO } from "@/components/layout/clinic-info";

// Sends mail through Resend's REST API. Without RESEND_API_KEY it logs and skips, so booking still works in dev.
const FROM = process.env.MAIL_FROM || "Dr Prema <onboarding@resend.dev>";
export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || CLINIC_INFO.email;

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function sendMail(opts: { to: string; subject: string; html: string; replyTo?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[mail] RESEND_API_KEY is not set; skipped "${opts.subject}" to ${opts.to}`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [opts.to], subject: opts.subject, html: opts.html, reply_to: opts.replyTo }),
      cache: "no-store",
    });
    if (!res.ok) console.error("[mail] Resend rejected the message:", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (error) {
    console.error("[mail] could not reach Resend:", error);
    return false;
  }
}

export function layout(title: string, body: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#4c0519">
<h2 style="color:#be123c;margin:0 0 16px">${escapeHtml(title)}</h2>${body}
<p style="margin-top:28px;font-size:12px;color:#9f1239">Dr. Prema N. · ${escapeHtml(CLINIC_INFO.addressLine1)}, ${escapeHtml(CLINIC_INFO.addressLine2)} · ${escapeHtml(CLINIC_INFO.phone)}</p></div>`;
}
