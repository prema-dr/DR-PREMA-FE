import type { Metadata } from "next";
import { ServiceHeader } from "@/components/service/ServiceHeader";
import { ServiceClusters } from "@/components/service/ServiceClusters";
import { ProcessFlow } from "@/components/service/ProcessFlow";
import { ServiceMetrics } from "@/components/service/detail/ServiceMetrics";
import { ServiceFinalCta } from "@/components/service/detail/ServiceCta";
import { getServices } from "@/lib/site-api";

export const metadata: Metadata = {
  title: "Services | Dr Prema",
  description:
    "Gynecology, pregnancy, and specialized women's health services offered at Dr Prema's practice.",
};

export default async function ServicePage() {
  const services = await getServices();
  return (
    <>
      <ServiceHeader count={services.length} />
      <ServiceMetrics />
      <ServiceClusters services={services} />
      <ProcessFlow />
      <ServiceFinalCta
        serviceName="Women's Health"
        message="Not sure which service you need? Book a consultation and Dr. Prema will help you understand your options, with no pressure to decide anything today."
      />
    </>
  );
}
