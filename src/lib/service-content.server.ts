import content from "@/data/service-content.json";
import type { ServiceContent } from "@/lib/service-content";

// Landing-page body per service, kept apart from services.ts so the admin bundle doesn't ship it.
const bySlug = content as unknown as Record<string, Partial<ServiceContent>>;

export const getServiceContent = (slug: string): ServiceContent => {
  const c = bySlug[slug] ?? {};
  return { sections: c.sections ?? [], faqs: c.faqs ?? [], closing: c.closing ?? [] };
};
