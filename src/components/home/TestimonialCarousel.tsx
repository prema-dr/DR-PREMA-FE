"use client";

import { Carousel } from "@/components/shared/Carousel";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import type { Testimonial } from "@/lib/site-api";

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  return (
    <Carousel
      label="testimonials"
      itemClassName="w-full md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
      items={items.map((item, index) => (
        <TestimonialCard key={item.id} testimonial={item} index={index} />
      ))}
    />
  );
}
