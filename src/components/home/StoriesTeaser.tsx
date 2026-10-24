import Link from "next/link";
import { ArrowRightIcon as ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { getTestimonials } from "@/lib/site-api";

export async function StoriesTeaser() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;
  return (
    <section className="bg-rose-50/60 pb-14 pt-20">
      <Reveal className="mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
            <span className="h-px w-8 bg-rose-600" />
            Testimonials
            <span className="h-px w-8 bg-rose-600" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-rose-950 md:text-5xl">
            What Our <span className="text-rose-600">Patients</span> Say
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-rose-950/65">
            Real experiences from women who trusted Dr. Prema with their care, at every stage of
            life.
          </p>
        </div>

        <div className="mt-12">
          <TestimonialCarousel items={testimonials} />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/patient-stories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 transition-colors hover:text-rose-800"
          >
            Read all patient stories
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
