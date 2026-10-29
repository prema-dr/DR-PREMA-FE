import { queryDocs } from "@/lib/firestore-rest";
import { sanitizeBlogHtml } from "@/lib/content-utils";
import type { ServiceContent } from "@/lib/service-content";
import { getServiceContent } from "@/lib/service-content.server";
import { getService, serviceName, services, type NavService, type Service } from "@/lib/services";

export type { NavService, Service };

// Public site data comes from Firestore (see firestore-rest.ts). Responses are cached and refreshed on a
// timer; saving anything in the admin panel also revalidates them immediately (see /api/revalidate).
export const FALLBACK_IMAGE = "/images/clinic-reception.jpg";
export const FALLBACK_SERVICE_IMAGE = "/images/consultation-room.jpg";

/* ───────────── Public types ───────────── */

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
  id: string;
  name: string;
  quote: string;
  rating: number;
  imageUrl: string | null;
  category: string;
};

export type ServicePublication = { id: string; title: string; description: string; url: string };
export type ServiceGalleryImage = { id: string; src: string; alt: string };

export type ServicePage = {
  service: ServiceDetail;
  posts: BlogPost[];
  testimonials: Testimonial[];
  gallery: ServiceGalleryImage[];
  publications: ServicePublication[];
  videos: string[];
};

/* ───────────── Firestore documents ───────────── */

type Doc<T> = T & { id: string };
type BlogDoc = {
  title: string; slug: string; serviceSlug: string; excerpt: string; content: string; readTimeMinutes: number;
  featuredImageUrl: string | null; imageAlt: string | null; publishDate: string;
  metaTitle: string | null; metaDescription: string | null;
};
type TestimonialDoc = { name: string; review: string; rating: number; imageUrl: string | null; serviceSlug: string; createdAt: string };
type GalleryDoc = { imageUrl: string; altText: string; sortOrder: number; createdAt: string };
type PublicationDoc = { title: string; shortDescription: string; url: string; createdAt: string };
type VideoDoc = { videoUrl: string; createdAt: string };

const byNewest = <T extends { createdAt: string }>(a: T, b: T) => b.createdAt.localeCompare(a.createdAt);
const isLive = (b: BlogDoc) => new Date(b.publishDate).getTime() <= Date.now(); // scheduled posts go live once their date passes

/* ───────────── Mappers ───────────── */

const toPost = (b: BlogDoc): BlogPost => ({
  slug: b.slug,
  title: b.title,
  category: serviceName(b.serviceSlug),
  categorySlug: b.serviceSlug,
  image: b.featuredImageUrl ?? FALLBACK_IMAGE,
  imageAlt: b.imageAlt || b.title,
  readTime: `${b.readTimeMinutes} min read`,
  excerpt: b.excerpt,
  publishDate: b.publishDate,
});

const toTestimonial = (t: Doc<TestimonialDoc>): Testimonial => ({
  id: t.id, name: t.name, quote: t.review, rating: t.rating, imageUrl: t.imageUrl, category: serviceName(t.serviceSlug),
});

const publishedBlogs = async (extra: Record<string, string> = {}) =>
  ((await queryDocs<BlogDoc>("blogs", { isPublished: true, ...extra })) ?? [])
    .filter(isLive)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));

/* ───────────── Queries ───────────── */

export const getServices = async (): Promise<Service[]> => services;

export const getNavServices = async (): Promise<NavService[]> =>
  services.map(({ slug, name, iconKey }) => ({ slug, name, iconKey }));

/** One service landing page: the fixed service copy plus everything mapped to it. Returns null for an unknown slug. */
export async function getServicePage(slug: string): Promise<ServicePage | null> {
  const service = getService(slug);
  if (!service) return null;

  // The page still renders its static copy if Firestore is unreachable.
  const [blogs, testimonials, gallery, publications, videos] = await Promise.all([
    publishedBlogs({ serviceSlug: slug }),
    queryDocs<TestimonialDoc>("testimonials", { serviceSlug: slug, isEnabled: true }),
    queryDocs<GalleryDoc>("gallery", { serviceSlug: slug, isEnabled: true }),
    queryDocs<PublicationDoc>("publications", { serviceSlug: slug, isEnabled: true }),
    queryDocs<VideoDoc>("videos", { serviceSlug: slug, isEnabled: true }),
  ]);

  return {
    service: { ...service, ...getServiceContent(slug) },
    posts: blogs.slice(0, 6).map(toPost),
    testimonials: (testimonials ?? []).sort(byNewest).map(toTestimonial),
    gallery: (gallery ?? [])
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || byNewest(a, b))
      .map((g) => ({ id: g.id, src: g.imageUrl, alt: g.altText })),
    publications: (publications ?? []).sort(byNewest).map((p) => ({ id: p.id, title: p.title, description: p.shortDescription, url: p.url })),
    videos: (videos ?? []).sort(byNewest).map((v) => v.videoUrl),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await publishedBlogs()).map(toPost);
}

export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  // A post can also be reached through its optional custom path (`urlRewrite`).
  const bySlug = await queryDocs<BlogDoc>("blogs", { slug, isPublished: true });
  const found = bySlug?.length ? bySlug : await queryDocs<BlogDoc>("blogs", { urlRewrite: slug, isPublished: true });
  if (!found) throw new Error("The content service is unavailable");
  const raw = found.find(isLive);
  if (!raw) return null;
  return {
    ...toPost(raw),
    contentHtml: sanitizeBlogHtml(raw.content ?? ""),
    metaTitle: raw.metaTitle ?? null,
    metaDescription: raw.metaDescription ?? null,
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return ((await queryDocs<TestimonialDoc>("testimonials", { isEnabled: true })) ?? []).sort(byNewest).map(toTestimonial);
}

export async function getVideoUrls(): Promise<string[]> {
  return ((await queryDocs<VideoDoc>("videos", { isEnabled: true })) ?? []).sort(byNewest).map((v) => v.videoUrl);
}
