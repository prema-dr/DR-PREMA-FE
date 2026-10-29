import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth.server";

// Called by the admin panel after every save so the public pages refresh straight away.
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
