import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth.server";
import { API_KEY, CLOUD_NAME, FOLDER_ROOT, sign } from "@/lib/cloudinary.server";

const FOLDERS = ["blogs", "testimonials", "gallery", "videos"];

// Gives the admin's browser a short-lived signed upload, so images go straight to Cloudinary
// without the API secret ever leaving the server.
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { folder } = (await request.json().catch(() => ({}))) as { folder?: string };
  if (!folder || !FOLDERS.includes(folder)) return NextResponse.json({ message: "Unknown folder" }, { status: 400 });

  const params = { folder: `${FOLDER_ROOT}/${folder}`, timestamp: Math.floor(Date.now() / 1000) };
  return NextResponse.json({ ...params, signature: sign(params), apiKey: API_KEY, cloudName: CLOUD_NAME });
}
