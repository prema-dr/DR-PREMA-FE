import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHours } from "@/components/contact/ContactHours";
import { VisitSection } from "@/components/contact/VisitSection";
import { ServiceFaq } from "@/components/service/detail/ServiceFaq";
import { Reveal } from "@/components/shared/Reveal";

export const metadata: Metadata = {
  title: "Contact Us | Dr Prema",
  description:
    "Get in touch with Dr Prema's practice with general questions. This page is informational only and does not offer appointment booking.",
};

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Appointments are scheduled by phone. Please call the clinic during opening hours, and the team will help you find a suitable time. The contact form on this page is for general questions only.",
  },
  {
    q: "How soon will I hear back after sending a message?",
    a: "Our team typically replies within one business day. If your question is time-sensitive, calling the clinic is the quickest way to reach us.",
  },
  {
    q: "Can I ask about a specific service before booking?",
    a: "Yes. Choose the topic that fits your question in the form, or message us on WhatsApp, and we will point you to the right information or the right person.",
  },
];

export default function ContactUsPage() {
  return (
    <>
      <ContactHero />
      <ContactMethods />

      <section className="relative py-20 lg:py-24">
        <Reveal className="mx-auto grid max-w-[90rem] grid-cols-1 items-start gap-10 px-[22px] md:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12 lg:px-10">
          <ContactForm />
          <div className="lg:sticky lg:top-32">
            <ContactHours />
          </div>
        </Reveal>
      </section>

      <VisitSection />
      <ServiceFaq faqs={FAQS} />
    </>
  );
}
