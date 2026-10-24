import type { Metadata } from "next";
import { BioHeader } from "@/components/about/BioHeader";
import { MeetDoctor } from "@/components/about/MeetDoctor";
import { Academics } from "@/components/about/Academics";
import { Timeline } from "@/components/about/Timeline";
import { Expertise } from "@/components/about/Expertise";
import { Recognition } from "@/components/about/Recognition";
import { Approach } from "@/components/about/Approach";
import { AboutCta } from "@/components/about/AboutCta";

export const metadata: Metadata = {
  title: "About Us | Dr Prema",
  description:
    "Meet Dr. Prema N., Consultant Obstetrician & Gynaecologist with over two decades of experience in clinical practice, medical education and research.",
};

export default function AboutUsPage() {
  return (
    <>
      <BioHeader />
      <MeetDoctor />
      <Academics />
      <Timeline />
      <Expertise />
      <Recognition />
      <Approach />
      <AboutCta />
    </>
  );
}
