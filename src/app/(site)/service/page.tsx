import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ServiceHeader } from "@/components/service/ServiceHeader";
import { ServiceClusters } from "@/components/service/ServiceClusters";
import { ProcessFlow } from "@/components/service/ProcessFlow";
import { ServiceMetrics } from "@/components/service/detail/ServiceMetrics";
import { ServiceFinalCta } from "@/components/service/detail/ServiceCta";
import { getServices } from "@/lib/site-api";
import { servicesSchema } from "@/lib/services-schema";

export const metadata: Metadata = pageMetadata("/service");

export default async function ServicePage() {
  const services = await getServices();
  return (
    <div className="bg-gradient-to-b from-[#fdeaf2] via-[#fff5f9] to-[#fde7f0] -mb-24 pb-48">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema).replace(/</g, "\\u003c") }}
      />
      <ServiceHeader count={services.length} />
      <ServiceMetrics />
      <ServiceClusters services={services} />
      <ProcessFlow />
      <ServiceFinalCta
        serviceName="Women's Health"
        message="Not sure which service you need? Book a consultation and Dr. Prema will help you understand your options, with no pressure to decide anything today."
      />
    </div>
  );
}
