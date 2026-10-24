import type { Metadata } from "next";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { ServiceFinalCta } from "@/components/service/detail/ServiceCta";
import { getBlogPosts } from "@/lib/site-api";

export const metadata: Metadata = {
  title: "Blog | Dr Prema",
  description:
    "Plain-language reading on gynecology, pregnancy, and women's health from Dr Prema's practice.",
};

export default async function BlogPage() {
  const [featured, ...rest] = await getBlogPosts();

  return (
    <>
      <BlogHeader posts={featured ? [featured, ...rest] : []} />
      {featured && <FeaturedPost post={featured} />}
      <BlogGrid posts={rest} />
      <ServiceFinalCta
        serviceName="Women's Health"
        message="Still have a question these articles didn't answer? Book a consultation and Dr. Prema will take the time to explain."
      />
    </>
  );
}
