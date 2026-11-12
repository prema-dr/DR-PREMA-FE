import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { BookingForm } from "@/components/contact/BookingForm";
import { ContactHours } from "@/components/contact/ContactHours";
import { VisitSection } from "@/components/contact/VisitSection";
import { ServiceFaq } from "@/components/service/detail/ServiceFaq";
import { Reveal } from "@/components/shared/Reveal";

export const metadata: Metadata = {
  title: "Contact Us | Dr Prema",
  description:
    "Book an appointment with Dr Prema online: pick a free date and time, and get an email confirmation once the doctor accepts.",
};

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Choose a date and one of the free times in the booking form on this page and send it. The slot is held for you straight away, and you receive an email as soon as Dr. Prema confirms it.",
  },
  {
    q: "Is my appointment confirmed immediately?",
    a: "Your time is reserved when you book, but it is confirmed only once Dr. Prema accepts it. We email you either way. If a time can't be accepted, the slot is released and we'll invite you to pick another.",
  },
  {
    q: "Can I change or cancel my appointment?",
    a: "Yes. Please call the clinic and the team will move or cancel it for you.",
  },
];

export default function ContactUsPage() {
  return (
    <div className="bg-gradient-to-b from-[#fdeaf2] via-[#fff5f9] to-[#fde7f0] -mb-24 pb-48">
      <ContactHero />
      <ContactMethods />

      <section className="relative py-20 lg:py-24">
        <Reveal className="mx-auto grid max-w-[90rem] grid-cols-1 items-start gap-10 px-[22px] md:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12 lg:px-10">
          <BookingForm />
          <div className="lg:sticky lg:top-32">
            <ContactHours />
          </div>
        </Reveal>
      </section>

      <VisitSection />
      <ServiceFaq faqs={FAQS} />
    </div>
  );
}
