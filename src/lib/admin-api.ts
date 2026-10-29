// Admin data client. Data lives in Firestore + Cloudinary; see admin-store.ts for the implementation.
import { handleAdminRequest, StoreError } from "@/lib/admin-store";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export type Paginated<T> = {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type AdminBlog = {
  id: string;
  serviceSlug: string;
  title: string;
  slug: string;
  urlRewrite: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string;
  content?: string;
  readTimeMinutes: number;
  featuredImageUrl: string | null;
  imageAlt: string | null;
  isPublished: boolean;
  publishDate: string;
  updatedAt: string;
};

export type AdminTestimonial = {
  id: string;
  serviceSlug: string;
  name: string;
  review: string;
  rating: number;
  imageUrl: string | null;
  isEnabled: boolean;
};

export type AdminGalleryImage = {
  id: string;
  serviceSlug: string;
  imageUrl: string;
  altText: string;
  isEnabled: boolean;
};

export type AdminPublication = {
  id: string;
  serviceSlug: string;
  title: string;
  shortDescription: string;
  url: string;
  isEnabled: boolean;
};

export type AdminVideo = {
  id: string;
  serviceSlug: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  isEnabled: boolean;
};

export type DashboardCounts = {
  blogs: number;
  testimonials: number;
  galleryImages: number;
  publications: number;
  videos: number;
};

type Query = Record<string, string | number | boolean | undefined | null>;

export function toQuery(query?: Query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const text = params.toString();
  return text ? `?${text}` : "";
}

async function request<T>(method: "GET" | "POST" | "PATCH" | "DELETE", path: string, body?: unknown): Promise<T> {
  try {
    return (await handleAdminRequest(method, path, body)) as T;
  } catch (error) {
    if (error instanceof StoreError) {
      throw new ApiError(error.message, error.status);
    }
    throw error;
  }
}

export const api = {
  get: <T,>(path: string, query?: Query) => request<T>("GET", `${path}${toQuery(query)}`),
  post: <T,>(path: string, body?: unknown) => request<T>("POST", path, body ?? {}),
  patch: <T,>(path: string, body: unknown) => request<T>("PATCH", path, body),
  remove: (path: string) => request<void>("DELETE", path),
};

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
