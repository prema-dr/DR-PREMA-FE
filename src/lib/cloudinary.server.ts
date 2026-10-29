import { createHash } from "node:crypto";

export const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
export const FOLDER_ROOT = "dr-prema";

/** Cloudinary signature: SHA-1 of the sorted `key=value` params followed by the API secret. */
export function sign(params: Record<string, string | number>) {
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  return createHash("sha1").update(toSign + process.env.CLOUDINARY_API_SECRET).digest("hex");
}
