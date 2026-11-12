import { NextResponse, type NextRequest } from "next/server";
import { firebaseConfig } from "@/lib/firebase-config";
import { DATE_PATTERN, isClosedDay, openSlots } from "@/lib/appointments";

// Free start times for one day: the clinic's slot grid minus the times already held in `bookedSlots`
// (pending and accepted bookings both hold a slot). Never cached so a fresh booking shows up straight away.
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  if (!DATE_PATTERN.test(date)) return NextResponse.json({ message: "Choose a valid date." }, { status: 400 });
  if (isClosedDay(date)) return NextResponse.json({ closed: true, slots: [] });

  let taken = new Set<string>();
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "bookedSlots" }],
            where: { fieldFilter: { field: { fieldPath: "date" }, op: "EQUAL", value: { stringValue: date } } },
          },
        }),
        cache: "no-store",
      },
    );
    if (!res.ok) throw new Error(String(res.status));
    const rows = (await res.json()) as { document?: { fields?: { time?: { stringValue?: string } } } }[];
    taken = new Set(rows.flatMap((r) => (r.document?.fields?.time?.stringValue ? [r.document.fields.time.stringValue] : [])));
  } catch {
    return NextResponse.json({ message: "We couldn't load the available times. Please try again." }, { status: 502 });
  }

  const slots = openSlots(date).map((time) => ({ time, available: !taken.has(time) }));
  return NextResponse.json({ closed: false, slots });
}
