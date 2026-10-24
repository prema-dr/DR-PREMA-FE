import type { Metadata } from "next";
import { StoriesHeader } from "@/components/patient-stories/StoriesHeader";
import { StoriesWall } from "@/components/patient-stories/StoriesWall";
import { PrivacyNote } from "@/components/patient-stories/PrivacyNote";
import { ServiceMetrics } from "@/components/service/detail/ServiceMetrics";
import { ServiceFinalCta } from "@/components/service/detail/ServiceCta";
import { getTestimonials } from "@/lib/site-api";

export const metadata: Metadata = {
  title: "Patient Stories | Dr Prema",
  description:
    "Real patient experiences, shared with permission, from Dr Prema's gynecology and women's health practice.",
};

export default async function PatientStoriesPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <StoriesHeader testimonials={testimonials} />
      <ServiceMetrics />
      <StoriesWall testimonials={testimonials} />
      <PrivacyNote />
      <ServiceFinalCta
        serviceName="Patient Stories"
        message="Whether you are looking for care or want to share how your visit went, we'd love to hear from you. Stories are included only with your permission."
      />
    </>
  );
}
