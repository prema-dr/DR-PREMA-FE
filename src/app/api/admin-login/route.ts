import { NextResponse } from "next/server";
import { ADMIN_COOKIE, API_URL, cookieOptions } from "@/lib/admin-server";

// Exchanges email + password for the backend JWT and keeps it in an httpOnly cookie.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Cannot reach the server. Try again shortly." }, { status: 502 });
  }

  const data = await upstream.json().catch(() => null);
  if (!upstream.ok || !data?.accessToken) {
    const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
    return NextResponse.json(
      { message: message ?? "Invalid email or password" },
      { status: upstream.status === 429 ? 429 : upstream.ok ? 500 : upstream.status },
    );
  }

  const response = NextResponse.json({ admin: data.admin });
  response.cookies.set(ADMIN_COOKIE, data.accessToken, { ...cookieOptions, maxAge: 60 * 60 * 8 });
  return response;
}
