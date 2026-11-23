import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BioHeader } from "@/components/about/BioHeader";
import { MeetDoctor } from "@/components/about/MeetDoctor";
import { Academics } from "@/components/about/Academics";
import { Timeline } from "@/components/about/Timeline";
import { Expertise } from "@/components/about/Expertise";
import { Recognition } from "@/components/about/Recognition";
import { LecturesAndAwards } from "@/components/about/LecturesAndAwards";
import { Approach } from "@/components/about/Approach";
import { AboutCta } from "@/components/about/AboutCta";
import { aboutSchema } from "@/lib/about-schema";

export const metadata: Metadata = pageMetadata("/about-us");

export default function AboutUsPage() {
  return (
    <div className="bg-gradient-to-b from-[#fdeaf2] via-[#fff5f9] to-[#fde7f0] -mb-24 pb-48">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema).replace(/</g, "\\u003c") }}
      />
      <BioHeader />
      <MeetDoctor />
      <Academics />
      <Timeline />
      <Expertise />
      <Recognition />
      <LecturesAndAwards />
      <Approach />
      <AboutCta />
    </div>
  );
}
