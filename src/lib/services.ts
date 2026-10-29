import data from "@/data/services.json";

// The 14 services are fixed, so they live here instead of the database.
// Admin-managed content (blogs, testimonials, gallery, …) is mapped to them by slug.
export type NavService = { slug: string; name: string; iconKey: string | null };

export type Service = NavService & {
  summary: string;
  heroHeading: string;
  heroSub: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = data.map(({ imageUrl, ...s }) => ({ ...s, image: imageUrl }));

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceName = (slug: string) => getService(slug)?.name ?? slug;
export const isServiceSlug = (slug: string) => services.some((s) => s.slug === slug);
