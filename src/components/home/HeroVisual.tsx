"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { StarIcon as Star } from "@phosphor-icons/react/dist/ssr";

export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-md py-6 lg:max-w-lg">
      {/* Soft backdrop circles */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-rose-100/70 via-rose-50/60 to-transparent blur-sm" />
      <div className="pointer-events-none absolute -bottom-6 -right-10 aspect-square w-3/4 rounded-full bg-gradient-to-tl from-sky-100/70 to-transparent" />

      {/* Doctor portrait */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-[28px] border-4 border-white bg-rose-100 shadow-[0_30px_60px_-25px_rgba(159,18,57,0.45)]"
      >
        <Image
          src="/images/meet-dr-prema.jpeg"
          alt="Dr. Prema, consultant obstetrician and gynaecologist"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1024px) 512px, 80vw"
          className="origin-[50%_32%] scale-[1.6] object-cover object-[50%_38%]"
        />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 backdrop-blur">
          <div>
            <p className="font-[family-name:var(--font-display)] text-sm font-bold text-rose-900">Dr. Prema N.</p>
            <p className="text-xs text-gray-600">Kovai Medical Center &amp; Hospital</p>
          </div>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600">Coimbatore</span>
        </div>
      </motion.div>

      {/* Floating card: Google reviews */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: reduce ? 0 : [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
        }}
        className="absolute left-0 top-[4%] z-20 rounded-xl border border-rose-100 bg-white px-4 py-3 shadow-[0_16px_40px_-18px_rgba(159,18,57,0.35)] sm:-left-6"
      >
        <div className="flex items-center gap-1.5">
          <span className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} weight="fill" />
            ))}
          </span>
          <span className="text-sm font-bold text-rose-950">1,353</span>
        </div>
        <p className="mt-1 text-[11px] text-rose-950/65">Google Reviews</p>
      </motion.div>

      {/* Floating card: recommendation */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: reduce ? 0 : [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.55 },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="absolute top-[26%] right-0 z-20 rounded-xl border border-rose-100 bg-white px-4 py-3 shadow-[0_16px_40px_-18px_rgba(159,18,57,0.35)] sm:-right-6"
      >
        <p className="text-sm text-rose-950/80">
          <span className="font-bold text-emerald-600">98%</span>{" "}
          <span className="text-xs">Recommended</span>
        </p>
        <p className="mt-1 text-[11px] text-rose-950/65">Practo (333 patients)</p>
      </motion.div>
    </div>
  );
}
