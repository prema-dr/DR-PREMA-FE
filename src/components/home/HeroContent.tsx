"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { GraduationCapIcon as GraduationCap, StarIcon as Star } from "@phosphor-icons/react/dist/ssr";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const STATS = [
  { value: "4,000+", label: "Patients cared for", tone: "text-rose-700" },
  { value: "20+", label: "Years of practice", tone: "text-sky-700" },
  { value: "3", label: "Hospital affiliations", tone: "text-rose-700" },
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
        className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#A43340]"
      >
        Consultant Obstetrician &amp; Gynaecologist
      </motion.p>

      <motion.h1
        variants={item}
        className="mt-2 font-[family-name:var(--font-name)] text-5xl font-medium leading-[1.08] tracking-tight text-[#1C1B19] sm:text-6xl lg:text-[68px]"
      >
        Dr. Prema <span className="font-normal italic text-[#A43340]">N.</span>
      </motion.h1>

      <motion.p variants={item} className="mt-3 text-sm font-semibold tracking-wide text-rose-950/80">
        MBBS · MS (OBG) · DGO · DNB (OBG) · FICOG
      </motion.p>

      <motion.h2
        variants={item}
        className="mt-5 max-w-xl text-2xl font-semibold leading-snug text-rose-950 md:text-3xl"
      >
        Trusted <span className="text-rose-600">Gynaecologist</span> &amp; Obstetrician in Coimbatore
      </motion.h2>

      <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-rose-950/70">
        <span className="font-semibold text-rose-950">Dr. Prema N.</span> has over two decades of experience in
        women&apos;s healthcare, with specialised expertise in high-risk obstetrics, VBAC, natural and bio-mimic
        birthing, NOVA hysterectomy and advanced laparoscopic procedures.
      </motion.p>

      <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/about-us"
          className="inline-flex items-center gap-2 rounded-full border-2 border-rose-200 bg-white/70 px-7 py-3.5 text-base font-semibold text-rose-700 transition-all hover:-translate-y-0.5 hover:bg-rose-50 active:scale-[0.98]"
        >
          <GraduationCap size={18} weight="regular" />
          Meet Dr. Prema
        </Link>
      </motion.div>

      <motion.dl
        variants={item}
        className="mt-10 inline-grid grid-cols-3 divide-x divide-rose-100 rounded-2xl bg-white px-2 py-4 shadow-[0_12px_40px_-20px_rgba(232,64,122,0.35)]"
      >
        {STATS.map((s) => (
          <div key={s.label} className="px-5 text-center sm:px-7">
            <dt className={`font-display text-2xl font-bold sm:text-3xl ${s.tone}`}>{s.value}</dt>
            <dd className="mt-1 text-[11px] font-medium uppercase tracking-wider text-rose-950/60">{s.label}</dd>
          </div>
        ))}
      </motion.dl>
    </motion.div>
  );
}
