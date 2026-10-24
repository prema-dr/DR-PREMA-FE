import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cheap gate only: the real token check happens in the backend on every request.
export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get("admin_token")?.value);
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!hasSession && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (hasSession && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
