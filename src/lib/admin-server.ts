export const ADMIN_COOKIE = "admin_token";
export const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
