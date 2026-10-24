"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { Pagination } from "@/components/shared/Pagination";
import type { Testimonial } from "@/lib/site-api";

const ALL = "All stories";
const PAGE_SIZE = 9;

export function StoriesWall({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(ALL);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of testimonials) if (t.category) counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
    return [[ALL, testimonials.length] as const, ...counts.entries()];
  }, [testimonials]);

  const items = testimonials.map((t, index) => ({ t, index })).filter(
    ({ t }) => active === ALL || t.category === active,
  );

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function goToPage(next: number) {
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative overflow-hidden bg-rose-50/60 py-16 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-0 size-[28rem] rounded-full bg-pink-100/50 blur-3xl" />
      <div ref={topRef} className="relative mx-auto max-w-[90rem] scroll-mt-24 px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
            <span className="h-px w-8 bg-rose-600" />
            Every story
            <span className="h-px w-8 bg-rose-600" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-rose-950 md:text-5xl">
            Voices of <span className="text-rose-600">trust</span>
          </h2>
        </div>

        <div role="tablist" aria-label="Filter stories by care type" className="mt-10 flex flex-wrap justify-center gap-2.5">
          {categories.map(([name, count]) => {
            const on = name === active;
            return (
              <button
                key={name}
                role="tab"
                aria-selected={on}
                type="button"
                onClick={() => {
                  setActive(name);
                  setPage(1);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-[0.97] ${
                  on
                    ? "border-rose-600 bg-rose-600 text-white shadow-[0_12px_24px_-12px_rgba(225,29,72,0.7)]"
                    : "border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50"
                }`}
              >
                {name}
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${on ? "bg-white/20" : "bg-rose-50 text-rose-500"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div key={`${active}-${current}`} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ t, index }, i) => (
            <motion.div
              key={t.id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <TestimonialCard testimonial={t} index={index} />
            </motion.div>
          ))}
        </div>
        <Pagination page={current} totalPages={totalPages} onChange={goToPage} />
      </div>
    </section>
  );
}
