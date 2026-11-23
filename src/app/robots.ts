import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

const BOTS = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot"];
const PRIVATE = ["/admin/", "/login/", "/dashboard/", "/api/"];

// The Disallow list is repeated per group: crawlers obey only their most specific group.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
