import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, API_URL, cookieOptions } from "@/lib/admin-server";

// Pass-through to the backend: attaches the JWT from the httpOnly cookie so the browser never sees it.
async function forward(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Not signed in" }, { status: 401 });

  const { path } = await ctx.params;
  const url = `${API_URL}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  const hasBody = request.method !== "GET" && request.method !== "DELETE";
  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Cannot reach the server. Try again shortly." }, { status: 502 });
  }

  const response =
    upstream.status === 204
      ? new NextResponse(null, { status: 204 })
      : new NextResponse(await upstream.arrayBuffer(), {
          status: upstream.status,
          headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
        });

  // Content changed: refresh the cached public pages so the website shows it straight away.
  if (hasBody || request.method === "DELETE") {
    if (upstream.ok) revalidatePath("/", "layout");
  }

  if (upstream.status === 401) response.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE };
