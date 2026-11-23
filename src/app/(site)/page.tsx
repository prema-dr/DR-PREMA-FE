import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { CredentialsStrip } from "@/components/home/CredentialsStrip";
import { TrustStats } from "@/components/home/TrustStats";
import { ServicesBento } from "@/components/home/ServicesBento";
import { ApproachSplit } from "@/components/home/ApproachSplit";
import { StoriesTeaser } from "@/components/home/StoriesTeaser";
import { InstagramReels } from "@/components/home/InstagramReels";
import { YouTubeVideos } from "@/components/home/YouTubeVideos";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { HomeFaqs } from "@/components/home/HomeFaqs";
import { homeSchema } from "@/lib/home-schema";

export const metadata: Metadata = pageMetadata("");

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-[#fdeaf2] via-[#fff5f9] to-[#fde7f0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <CredentialsStrip />
      <ServicesBento />
      <TrustStats />
      <ApproachSplit />
      <StoriesTeaser />
      <InstagramReels />
      <YouTubeVideos />
      <BlogTeaser />
      <HomeFaqs />
    </div>
  );
}
