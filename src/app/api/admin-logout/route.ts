import { NextResponse } from "next/server";
import { ADMIN_COOKIE, cookieOptions } from "@/lib/admin-server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}

// Used when the session has expired: clears the cookie and returns to the login page.
export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
