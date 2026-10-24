// Browser-side client for the admin backend, reached through /api/admin/* (see the route handler).

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export type Paginated<T> = {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type ServiceRef = { id: number; name: string; slug: string };

export type AdminService = {
  id: number;
  name: string;
  slug: string;
  summary: string;
  heroHeading: string;
  heroSub: string;
  imageUrl: string | null;
  iconKey: string | null;
  content?: unknown;
  isEnabled: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type AdminBlog = {
  id: number;
  serviceId: number;
  service: ServiceRef;
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
  id: number;
  serviceId: number;
  service: ServiceRef;
  name: string;
  review: string;
  rating: number;
  imageUrl: string | null;
  isEnabled: boolean;
};

export type AdminGalleryImage = {
  id: number;
  serviceId: number;
  service: ServiceRef;
  imageUrl: string;
  altText: string;
  isEnabled: boolean;
};

export type AdminPublication = {
  id: number;
  serviceId: number;
  service: ServiceRef;
  title: string;
  shortDescription: string;
  url: string;
  isEnabled: boolean;
};

export type AdminVideo = {
  id: number;
  serviceId: number;
  service: ServiceRef;
  videoUrl: string;
  thumbnailUrl: string | null;
  isEnabled: boolean;
};

export type DashboardCounts = {
  services: number;
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

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`/api/admin/${path}`, {
    method,
    headers: body !== undefined && !isForm ? { "Content-Type": "application/json" } : undefined,
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });

  if (res.status === 401) {
    // Full navigation on purpose: the route handler clears the cookie and redirects.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/api/admin-logout");
    throw new ApiError("Your session has expired", 401);
  }
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const raw = data?.message;
    const message = Array.isArray(raw) ? raw.join(". ") : raw;
    throw new ApiError(message ?? "Something went wrong", res.status);
  }
  return data as T;
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
