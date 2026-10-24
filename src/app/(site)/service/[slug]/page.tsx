import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNavServices, getServicePage } from "@/lib/site-api";
import { ServiceHero } from "@/components/service/detail/ServiceHero";
import { ServiceMetrics } from "@/components/service/detail/ServiceMetrics";
import { ServiceTestimonials } from "@/components/service/detail/ServiceTestimonials";
import { ServiceWhatIs, ServiceDetails } from "@/components/service/detail/ServiceContentSections";
import { ServiceWhy, ServiceJourney } from "@/components/service/detail/ServiceWhyJourney";
import { ServicePublications } from "@/components/service/detail/ServicePublications";
import { ServiceGallery } from "@/components/service/detail/ServiceGallery";
import { ServiceVideos } from "@/components/service/detail/ServiceVideos";
import { ServiceBlogs } from "@/components/service/detail/ServiceBlogs";
import { ServiceFaq } from "@/components/service/detail/ServiceFaq";
import { ServiceCta, ServiceFinalCta } from "@/components/service/detail/ServiceCta";

// Services added later in the admin panel are rendered on first visit.
export async function generateStaticParams() {
  return (await getNavServices()).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) return {};
  return {
    title: `${page.service.name} | Dr Prema`,
    description: page.service.heroSub,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) notFound();

  const { service, testimonials, publications, gallery, videos, posts } = page;
  const closing = service.closing.join(" ");

  return (
    <>
      <ServiceHero service={service} />
      <ServiceMetrics />
      <ServiceTestimonials serviceName={service.name} items={testimonials} />
      <ServiceWhatIs service={service} />
      <ServiceWhy serviceName={service.name} />
      <ServiceDetails service={service} />
      <ServiceCta serviceName={service.name} />
      <ServiceJourney serviceName={service.name} />
      <ServiceGallery serviceName={service.name} images={gallery} />
      <ServicePublications items={publications} />
      <ServiceVideos urls={videos} />
      <ServiceBlogs serviceName={service.name} posts={posts} />
      <ServiceFaq faqs={service.faqs} />
      <ServiceFinalCta serviceName={service.name} message={closing || undefined} />
    </>
  );
}
