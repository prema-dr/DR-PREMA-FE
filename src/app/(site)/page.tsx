import { Hero } from "@/components/home/Hero";
import { CredentialsStrip } from "@/components/home/CredentialsStrip";
import { TrustStats } from "@/components/home/TrustStats";
import { ServicesBento } from "@/components/home/ServicesBento";
import { ApproachSplit } from "@/components/home/ApproachSplit";
import { StoriesTeaser } from "@/components/home/StoriesTeaser";
import { InstagramReels } from "@/components/home/InstagramReels";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { HomeFaqs } from "@/components/home/HomeFaqs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredentialsStrip />
      <ServicesBento />
      <TrustStats />
      <ApproachSplit />
      <StoriesTeaser />
      <InstagramReels />
      <BlogTeaser />
      <HomeFaqs />
    </>
  );
}
