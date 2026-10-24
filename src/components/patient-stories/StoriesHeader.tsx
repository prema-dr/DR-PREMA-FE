import {
  HeartStraightIcon as HeartStraight,
  QuotesIcon as Quotes,
  SealCheckIcon as SealCheck,
  StarIcon as Star,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import type { Testimonial } from "@/lib/site-api";

const TONES = ["bg-emerald-500", "bg-indigo-500", "bg-cyan-500", "bg-rose-500", "bg-amber-500"];

function initial(name: string) {
  return name.replace(/[^a-zA-Z]/g, "").charAt(0).toUpperCase();
}

export function StoriesHeader({ testimonials }: { testimonials: Testimonial[] }) {
  const featured = testimonials[0];
  const stack = testimonials.slice(0, 5);

  return (
    <section className="relative -mt-36 overflow-hidden bg-gradient-to-b from-rose-100/70 via-rose-50 to-white pt-[112px] pb-24 sm:pt-[130px] md:-mt-40 lg:pt-[140px] lg:pb-32">
      <Quotes size={420} weight="fill" aria-hidden className="pointer-events-none absolute -left-24 -top-10 text-rose-200/30" />
      <svg aria-hidden viewBox="0 0 800 800" className="pointer-events-none absolute -right-48 top-1/2 hidden size-[52rem] -translate-y-1/2 text-rose-300/40 lg:block">
        {[140, 220, 300, 380].map((r) => (
          <circle key={r} cx="400" cy="400" r={r} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray={r % 220 === 0 ? "2 9" : undefined} />
        ))}
      </svg>
      <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 size-[26rem] rounded-full bg-sky-100/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-14 px-[22px] md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 backdrop-blur-sm">
            <HeartStraight size={14} weight="fill" className="text-rose-500" />
            Patient stories
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-rose-950 md:text-5xl lg:text-6xl">
            Patient stories,{" "}
            <span className="relative inline-block text-rose-600">
              in their own words
              <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-rose-300">
                <path d="M2 8c60-8 140-8 296-2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
            Real experiences from women who have trusted Dr Prema with their
            care, at every stage of life.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <div className="flex items-center">
              {stack.map((t, i) => (
                <span
                  key={t.name}
                  className={`-ml-3 flex size-11 items-center justify-center rounded-full text-sm font-bold text-white ring-4 ring-rose-50 first:ml-0 ${TONES[i % TONES.length]}`}
                >
                  {initial(t.name)}
                </span>
              ))}
              <span className="-ml-3 flex size-11 items-center justify-center rounded-full bg-white text-xs font-bold text-rose-600 ring-4 ring-rose-50">
                4k+
              </span>
            </div>
            <div>
              <span className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} weight="fill" />
                ))}
              </span>
              <p className="mt-0.5 text-sm font-medium text-rose-950/70">1,353 Google reviews · 98% recommended</p>
            </div>
          </div>
        </Reveal>

        {/* Featured quote */}
        {featured && (
          <Reveal delay={0.1} className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div aria-hidden className="absolute inset-x-6 -bottom-4 top-6 -rotate-3 rounded-[2.5rem] border-2 border-rose-200/80 bg-gradient-to-br from-rose-100/60 to-transparent" />
            <figure className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 p-8 shadow-[0_50px_80px_-40px_rgba(159,18,57,0.8)] md:p-10">
              <Quotes size={160} weight="fill" aria-hidden className="pointer-events-none absolute -right-4 -top-4 text-white/10" />
              <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white ring-1 ring-white/25">
                <SealCheck size={14} weight="fill" className="text-amber-300" />
                Featured story
              </span>
              <span className="relative mt-5 flex text-amber-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} weight="fill" />
                ))}
              </span>
              <blockquote className="relative mt-4 font-display text-2xl font-semibold leading-snug text-white md:text-[1.75rem]">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <figcaption className="relative mt-7 flex items-center gap-3 border-t border-white/20 pt-5">
                <span className="flex size-12 items-center justify-center rounded-full bg-white font-display text-lg font-bold text-rose-700">
                  {initial(featured.name)}
                </span>
                <span>
                  <span className="block font-semibold text-white">{featured.name}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  );
}
