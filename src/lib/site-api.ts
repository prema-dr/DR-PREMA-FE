import { API_URL } from "@/lib/admin-server";
import type { ServiceContent } from "@/lib/service-content";

// Public site data comes from the backend. Responses are cached and refreshed on a timer;
// saving anything in the admin panel also revalidates them immediately (see the admin proxy route).
const REVALIDATE_SECONDS = 60;

export const FALLBACK_IMAGE = "/images/clinic-reception.jpg";
export const FALLBACK_SERVICE_IMAGE = "/images/consultation-room.jpg";

/* ───────────── Public types ───────────── */

export type NavService = { slug: string; name: string; iconKey: string | null };

export type Service = NavService & {
  id: number;
  summary: string;
  heroHeading: string;
  heroSub: string;
  image: string;
};

export type ServiceDetail = Service & ServiceContent;

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  imageAlt: string;
  readTime: string;
  excerpt: string;
  publishDate: string;
};

export type BlogArticle = BlogPost & { contentHtml: string; metaTitle: string | null; metaDescription: string | null };

export type Testimonial = {
  id: number;
  name: string;
  quote: string;
  rating: number;
  imageUrl: string | null;
  category: string;
};

export type ServicePublication = { id: number; title: string; description: string; url: string };
export type ServiceGalleryImage = { id: number; src: string; alt: string };

export type ServicePage = {
  service: ServiceDetail;
  posts: BlogPost[];
  testimonials: Testimonial[];
  gallery: ServiceGalleryImage[];
  publications: ServicePublication[];
  videos: string[];
};

/* ───────────── Fetching ───────────── */

type Paged<T> = { items: T[]; meta: { totalPages: number } };

async function request(path: string): Promise<Response | null> {
  try {
    return await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  } catch {
    return null; // backend unreachable
  }
}

/** Parses a JSON body, returning null when the response is not JSON (e.g. an HTML error page from a wrong API_URL). */
async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  const res = await request(path);
  if (!res?.ok) return fallback;
  return (await parseJson<T>(res)) ?? fallback;
}

/** Collects every page of a paginated endpoint (50 is the backend's page-size cap). */
async function getAll<T>(path: string): Promise<T[]> {
  const sep = path.includes("?") ? "&" : "?";
  const items: T[] = [];
  for (let page = 1; page <= 20; page++) {
    const data = await getJson<Paged<T> | null>(`${path}${sep}limit=50&page=${page}`, null);
    if (!Array.isArray(data?.items)) break; // unexpected payload (wrong API_URL, error JSON)
    items.push(...data.items);
    if (page >= (data.meta?.totalPages ?? 1)) break;
  }
  return items;
}

/* ───────────── Mappers ───────────── */

type RawService = {
  id: number; name: string; slug: string; summary: string; heroHeading: string; heroSub: string;
  imageUrl: string | null; iconKey: string | null; content?: Partial<ServiceContent> | null;
};
type RawBlog = {
  title: string; slug: string; excerpt: string; featuredImageUrl: string | null; imageAlt: string | null;
  readTimeMinutes: number; publishDate: string; service?: { name: string; slug: string };
  content?: string; metaTitle?: string | null; metaDescription?: string | null;
};
type RawTestimonial = { id: number; name: string; review: string; rating: number; imageUrl: string | null; service?: { name: string } };

const toService = (s: RawService): Service => ({
  id: s.id, slug: s.slug, name: s.name, iconKey: s.iconKey, summary: s.summary,
  heroHeading: s.heroHeading, heroSub: s.heroSub, image: s.imageUrl ?? FALLBACK_SERVICE_IMAGE,
});

const toPost = (b: RawBlog, service?: { name: string; slug: string }): BlogPost => ({
  slug: b.slug,
  title: b.title,
  category: (b.service ?? service)?.name ?? "",
  categorySlug: (b.service ?? service)?.slug ?? "",
  image: b.featuredImageUrl ?? FALLBACK_IMAGE,
  imageAlt: b.imageAlt || b.title,
  readTime: `${b.readTimeMinutes} min read`,
  excerpt: b.excerpt,
  publishDate: b.publishDate,
});

const toTestimonial = (t: RawTestimonial, category = ""): Testimonial => ({
  id: t.id, name: t.name, quote: t.review, rating: t.rating, imageUrl: t.imageUrl, category: t.service?.name ?? category,
});

/* ───────────── Queries ───────────── */

export async function getServices(): Promise<Service[]> {
  return (await getJson<RawService[]>("/services", [])).map(toService);
}

export async function getNavServices(): Promise<NavService[]> {
  return (await getServices()).map(({ slug, name, iconKey }) => ({ slug, name, iconKey }));
}

/** One service landing page with everything mapped to it. Returns null when it doesn't exist or is disabled. */
export async function getServicePage(slug: string): Promise<ServicePage | null> {
  const res = await request(`/services/${encodeURIComponent(slug)}`);
  if (!res) throw new Error("The content service is unavailable");
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load service (${res.status})`);

  const raw = await parseJson<RawService & {
    blogs: RawBlog[]; testimonials: RawTestimonial[];
    gallery: { id: number; imageUrl: string; altText: string }[];
    publications: { id: number; title: string; shortDescription: string; url: string }[];
    videos: { videoUrl: string }[];
  }>(res);
  if (!raw) throw new Error("The content service returned an invalid response");
  const base = toService(raw);
  const content = raw.content ?? {};

  return {
    service: { ...base, sections: content.sections ?? [], faqs: content.faqs ?? [], closing: content.closing ?? [] },
    posts: raw.blogs.map((b) => toPost(b, { name: raw.name, slug: raw.slug })),
    testimonials: raw.testimonials.map((t) => toTestimonial(t, raw.name)),
    gallery: raw.gallery.map((g) => ({ id: g.id, src: g.imageUrl, alt: g.altText })),
    publications: raw.publications.map((p) => ({ id: p.id, title: p.title, description: p.shortDescription, url: p.url })),
    videos: raw.videos.map((v) => v.videoUrl),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await getAll<RawBlog>("/blogs")).map((b) => toPost(b));
}

export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  const res = await request(`/blogs/${encodeURIComponent(slug)}`);
  if (!res) throw new Error("The content service is unavailable");
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load article (${res.status})`);
  const raw = await parseJson<RawBlog>(res);
  if (!raw) throw new Error("The content service returned an invalid response");
  return { ...toPost(raw), contentHtml: raw.content ?? "", metaTitle: raw.metaTitle ?? null, metaDescription: raw.metaDescription ?? null };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return (await getAll<RawTestimonial>("/testimonials")).map((t) => toTestimonial(t));
}

export async function getVideoUrls(): Promise<string[]> {
  // Unlike blogs and testimonials, the public videos endpoint returns a plain list.
  return (await getJson<{ videoUrl: string }[]>("/videos", [])).map((v) => v.videoUrl);
}
