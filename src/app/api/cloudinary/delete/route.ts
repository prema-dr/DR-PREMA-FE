import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth.server";
import { API_KEY, CLOUD_NAME, FOLDER_ROOT, sign } from "@/lib/cloudinary.server";

// Removes an image the admin replaced or deleted. Limited to this site's own folder.
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { publicId } = (await request.json().catch(() => ({}))) as { publicId?: string };
  if (!publicId || !publicId.startsWith(`${FOLDER_ROOT}/`)) return NextResponse.json({ message: "Invalid image" }, { status: 400 });

  const params = { public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
  const body = new URLSearchParams({ ...params, timestamp: String(params.timestamp), api_key: API_KEY ?? "", signature: sign(params) });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, { method: "POST", body });
  return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
}
