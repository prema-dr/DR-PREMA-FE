import { CLINIC_INFO } from "@/components/layout/clinic-info";

// Sends mail through Resend's REST API. Without RESEND_API_KEY it logs and skips, so booking still works in dev.
const FROM = process.env.MAIL_FROM || "Dr Prema <onboarding@resend.dev>";
export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || CLINIC_INFO.email;

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function sendMail(opts: { to: string; subject: string; html: string; replyTo?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  console.log(`[mail] preparing "${opts.subject}" | to=${opts.to} | from=${FROM} | RESEND_API_KEY ${key ? "is set" : "is MISSING"}`);
  if (!key) {
    console.warn("[mail] SKIPPED: RESEND_API_KEY is not set. Add it to .env.local (or the host's environment) and restart the server.");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [opts.to], subject: opts.subject, html: opts.html, reply_to: opts.replyTo }),
      cache: "no-store",
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.error(`[mail] FAILED: Resend answered ${res.status}: ${text}`);
      return false;
    }
    console.log(`[mail] SENT to ${opts.to}. Resend response: ${text}`);
    return true;
  } catch (error) {
    console.error("[mail] FAILED: could not reach Resend:", error);
    return false;
  }
}

const ROSE = { 50: "#fdf2f6", 100: "#fce7ef", 200: "#facede", 600: "#e8407a", 700: "#d12d66", 900: "#8f203f", 950: "#5c0f23" };

/** Highlighted date and time card used in the patient emails. */
export function slotCard(date: string, time: string, note?: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0"><tr><td class="slot" style="background:${ROSE[50]};border:1px solid ${ROSE[200]};border-left:5px solid ${ROSE[600]};border-radius:14px;padding:18px 22px">
${note ? `<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${ROSE[600]};margin-bottom:6px">${note}</div>` : ""}
<div style="font-size:19px;font-weight:700;color:${ROSE[950]};line-height:1.3">${escapeHtml(date)}</div>
<div style="font-size:16px;font-weight:600;color:${ROSE[700]};margin-top:2px">at ${escapeHtml(time)}</div></td></tr></table>`;
}

/** Soft card for the clinic address and phone. */
export function infoCard() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 6px"><tr><td style="background:#ffffff;border:1px solid ${ROSE[100]};border-radius:14px;padding:16px 20px;font-size:14px;line-height:1.6;color:${ROSE[900]}">
<strong style="color:${ROSE[950]}">Dr. Prema N.</strong><br/>${escapeHtml(CLINIC_INFO.addressLine1)}, ${escapeHtml(CLINIC_INFO.addressLine2)}<br/>Phone: <a href="tel:${escapeHtml(CLINIC_INFO.phone.replace(/\s/g, ""))}" style="color:${ROSE[700]};text-decoration:none;font-weight:600">${escapeHtml(CLINIC_INFO.phone)}</a></td></tr></table>`;
}

/** Pill button. */
export function ctaButton(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px"><tr><td align="center" bgcolor="${ROSE[600]}" style="border-radius:999px"><a href="${href}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px">${escapeHtml(label)}</a></td></tr></table>`;
}

/** Label / value rows in a clean card. */
export function detailsTable(rows: [string, string][]) {
  const tr = rows
    .map(([label, value], i) => `<tr><td class="lbl" style="padding:11px 16px;width:32%;font-size:12px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:${ROSE[600]};vertical-align:top;${i ? `border-top:1px solid ${ROSE[100]};` : ""}">${escapeHtml(label)}</td><td style="padding:11px 16px;font-size:15px;font-weight:600;color:${ROSE[950]};word-break:break-word;${i ? `border-top:1px solid ${ROSE[100]};` : ""}">${escapeHtml(value)}</td></tr>`)
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:${ROSE[50]};border:1px solid ${ROSE[200]};border-radius:14px;border-collapse:separate">${tr}</table>`;
}

export function layout(title: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="color-scheme" content="light"/><title>${escapeHtml(title)}</title>
<style>
body{margin:0;padding:0;background:${ROSE[50]}}
.body p{margin:0 0 14px}
.body a{color:${ROSE[700]}}
@media only screen and (max-width:600px){
.wrap{padding:12px 10px!important}
.px{padding-left:20px!important;padding-right:20px!important}
.title{font-size:23px!important}
.lbl{display:block!important;width:auto!important;padding-bottom:0!important;border-top:0!important}
.slot{padding:16px 18px!important}
}
</style></head>
<body style="margin:0;padding:0;background:${ROSE[50]};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${ROSE[50]}"><tr><td class="wrap" align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 50px -24px rgba(143,32,63,.35)">
<tr><td class="px" bgcolor="${ROSE[900]}" style="background:${ROSE[900]};background-image:linear-gradient(135deg,${ROSE[900]} 0%,${ROSE[600]} 100%);padding:28px 36px">
<div style="font-size:24px;font-weight:700;letter-spacing:-.3px;color:#ffffff">Dr <span style="color:${ROSE[200]}">Prema</span></div>
<div style="margin-top:4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${ROSE[100]}">Obstetrics &amp; Gynaecology</div></td></tr>
<tr><td class="px" style="padding:34px 36px 8px"><h1 class="title" style="margin:0;font-size:27px;line-height:1.2;font-weight:700;letter-spacing:-.4px;color:${ROSE[950]}">${escapeHtml(title)}</h1>
<div style="width:48px;height:4px;border-radius:4px;background:${ROSE[600]};margin:14px 0 0"></div></td></tr>
<tr><td class="px body" style="padding:22px 36px 34px;font-size:16px;line-height:1.65;color:${ROSE[900]}">${body}</td></tr>
<tr><td class="px" bgcolor="${ROSE[50]}" style="background:${ROSE[50]};padding:20px 36px;border-top:1px solid ${ROSE[100]};font-size:12px;line-height:1.6;color:${ROSE[700]};text-align:center">
Dr. Prema N. · ${escapeHtml(CLINIC_INFO.addressLine1)}, ${escapeHtml(CLINIC_INFO.addressLine2)}<br/>${escapeHtml(CLINIC_INFO.phone)}</td></tr>
</table></td></tr></table></body></html>`;
}
