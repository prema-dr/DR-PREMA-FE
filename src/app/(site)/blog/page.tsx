import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { ServiceFinalCta } from "@/components/service/detail/ServiceCta";
import { getBlogPosts } from "@/lib/site-api";
import { blogSchema } from "@/lib/blog-schema";

export const metadata: Metadata = pageMetadata("/blog");

export default async function BlogPage() {
  const [featured, ...rest] = await getBlogPosts();

  return (
    <div className="bg-gradient-to-b from-[#fdeaf2] via-[#fff5f9] to-[#fde7f0] -mb-24 pb-48">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema).replace(/</g, "\\u003c") }}
      />
      <BlogHeader posts={featured ? [featured, ...rest] : []} />
      {featured && <FeaturedPost post={featured} />}
      <BlogGrid posts={rest} />
      <ServiceFinalCta
        serviceName="Women's Health"
        message="Still have a question these articles didn't answer? Book a consultation and Dr. Prema will take the time to explain."
      />
    </div>
  );
}
