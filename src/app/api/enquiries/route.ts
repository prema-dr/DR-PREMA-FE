import { NextResponse, type NextRequest } from "next/server";
import { services } from "@/lib/services";
import { firebaseConfig } from "@/lib/firebase-config";

// Receives the contact-page form and stores it in the `enquiries` collection (read in the admin panel).
// The write goes through Firestore's REST API as an anonymous visitor, so firestore.rules is what allows
// the create (and only the create) of a well-formed enquiry.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = [...services.map((s) => s.name), "Something else"];

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  // Honeypot: real visitors never fill this hidden field, bots usually do. Pretend it worked.
  if (str(body.website, 100)) return NextResponse.json({ ok: true });

  const name = str(body.name, 160);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  const message = str(body.message, 3000);
  const topic = str(body.topic, 60);

  if (!name) return NextResponse.json({ message: "Please share your name." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ message: "That email address doesn't look right." }, { status: 400 });
  if (!message) return NextResponse.json({ message: "Let us know what you'd like to ask." }, { status: 400 });

  const fields: Record<string, { stringValue?: string; booleanValue?: boolean; timestampValue?: string }> = {
    name: { stringValue: name },
    email: { stringValue: email },
    phone: { stringValue: phone },
    topic: { stringValue: TOPICS.includes(topic) ? topic : "" },
    message: { stringValue: message },
    isRead: { booleanValue: false },
    createdAt: { timestampValue: new Date().toISOString() },
  };

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/enquiries`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields }), cache: "no-store" },
    );
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    return NextResponse.json({ message: "We couldn't send your message. Please try again or call us." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
