import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { getBlogPosts } from "@/lib/site-api";
import { SITE_URL } from "@/lib/site-url";

// Re-generated at most once a minute, so new/removed blog posts show up without a redeploy.
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about-us", "/service", "/patient-stories", "/blog", "/contact-us"];
  const posts = await getBlogPosts().catch(() => []);
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...services.map((s) => ({ url: `${SITE_URL}/service/${s.slug}`, priority: 0.7 })),
    ...posts.map((b) => ({ url: `${SITE_URL}/blog/${b.slug}`, priority: 0.6 })),
  ];
}
