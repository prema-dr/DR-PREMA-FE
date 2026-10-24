import { Reveal } from "@/components/shared/Reveal";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import type { Testimonial } from "@/lib/site-api";

export function ServiceTestimonials({
  serviceName,
  items,
}: {
  serviceName: string;
  items: Testimonial[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-20 bg-rose-50/60 pb-14 pt-16">
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
            Real experiences from women who trusted Dr. Prema with their {serviceName.toLowerCase()} care.
          </p>
        </div>
        <div className="mt-12">
          <TestimonialCarousel items={items} />
        </div>
      </Reveal>
    </section>
  );
}
