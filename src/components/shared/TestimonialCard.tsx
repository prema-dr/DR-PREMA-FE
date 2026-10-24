import Image from "next/image";
import { QuotesIcon as Quotes } from "@phosphor-icons/react/dist/ssr";
import { StarRating } from "@/components/shared/StarRating";
import type { Testimonial } from "@/lib/site-api";

const AVATAR_TONES = [
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-violet-500",
];

function initials(name: string) {
  return name
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function TestimonialCard({
  testimonial,
  index = 0,
  className = "",
}: {
  testimonial: Testimonial;
  index?: number;
  className?: string;
}) {
  const tone = AVATAR_TONES[index % AVATAR_TONES.length];
  return (
    <figure
      className={`flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_8px_30px_-12px_rgba(159,18,57,0.18)] ${className}`}
    >
      <StarRating rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-rose-950/75">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-rose-100 pt-4">
        <span
          className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold text-white ${tone}`}
        >
          {testimonial.imageUrl ? (
            <Image src={testimonial.imageUrl} alt="" fill sizes="40px" className="object-cover" />
          ) : (
            initials(testimonial.name)
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-rose-950">
            {testimonial.name}
          </span>
        </span>
        <Quotes size={22} weight="fill" className="shrink-0 text-rose-200" aria-hidden />
      </figcaption>
    </figure>
  );
}
