"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRightIcon as ArrowRight, CalendarBlankIcon as CalendarBlank, StarIcon as Star } from "@phosphor-icons/react/dist/ssr";
import { WHATSAPP_URL } from "@/components/layout/nav-links";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const STATS = [
  { value: "25,000+", label: "Lives reached, cared for & healed" },
  { value: "20+", label: "Years of practice" },
  { value: "3", label: "Hospital affiliations" },
];

export function HeroContent() {
  const reduce = useReducedMotion();

  return (
    <motion.div initial={reduce ? false : "hidden"} animate="show" variants={container}>
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-rose-950/80 shadow-sm"
      >
        <span className="size-2 rounded-full bg-sky-500" />
        Kovai Medical Center &amp; Hospital, Coimbatore
        <span className="h-3.5 w-px bg-rose-950/15" />
        <span className="flex text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} weight="fill" />
          ))}
        </span>
      </motion.div>

      <motion.p
        variants={item}
        className="mt-8 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.12em] text-rose-900"
      >
        Consultant Obstetrician &amp; Gynaecologist
      </motion.p>

      <motion.h1
        variants={item}
        className="mt-2 font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.05] tracking-tight text-rose-900 sm:text-6xl lg:text-[68px]"
      >
        Dr. Prema N.
      </motion.h1>

      <motion.p variants={item} className="mt-3 font-[family-name:var(--font-display)] text-base font-semibold tracking-wide text-rose-600">
        MBBS · MS (OBG) · DGO · DNB (OBG) · FICOG
      </motion.p>

      <motion.h2
        variants={item}
        className="mt-8 max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug tracking-tight text-rose-900 md:text-[32px]"
      >
        Trusted <span className="text-rose-600">Gynaecologist</span> &amp;{" "}
        <span className="text-rose-600">Obstetrician</span> in Coimbatore
      </motion.h2>

      <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 md:text-[17px]">
        Dr. Prema N. has over two decades of experience in
        women&apos;s healthcare, with specialised expertise in high-risk obstetrics, VBAC, natural and bio-mimic
        birthing, NOVA hysterectomy and advanced laparoscopic procedures.
      </motion.p>

      <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/about-us"
          className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-7 py-3.5 text-base font-semibold text-rose-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-rose-50 active:scale-[0.98]"
        >
          Meet Dr. Prema
          <ArrowRight size={16} weight="bold" />
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgba(232,64,122,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-[0.98]"
        >
          <CalendarBlank size={18} weight="regular" />
          Book a Consultation
        </a>
      </motion.div>

      <motion.dl variants={item} className="mt-10 flex max-w-xl flex-nowrap gap-x-6 border-t border-rose-100 pt-8">
        {STATS.map((s) => (
          <div key={s.label} className="sm:pr-6">
            <dt className="font-[family-name:var(--font-display)] text-2xl font-bold text-rose-900 sm:text-4xl">{s.value}</dt>
            <dd className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-600 sm:text-xs">{s.label}</dd>
          </div>
        ))}
      </motion.dl>
    </motion.div>
  );
}
