import { NextResponse, type NextRequest } from "next/server";
import { firebaseConfig } from "./firebase-config";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

/**
 * Checks that the request carries the Firebase ID token of one of the admin accounts (verified through the
 * Identity Toolkit REST API). Returns an error response to send back, or null when the caller is allowed.
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer /i, "");
  if (!token) return NextResponse.json({ message: "Not signed in" }, { status: 401 });

  let email: string | undefined;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }), cache: "no-store" },
    );
    if (!res.ok) return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    email = (await res.json()).users?.[0]?.email?.toLowerCase();
  } catch {
    return NextResponse.json({ message: "Cannot verify the session" }, { status: 502 });
  }

  if (!email || !ADMIN_EMAILS.includes(email)) return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  return null;
}
