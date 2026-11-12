"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  CalendarCheckIcon as CalendarCheck,
  HeartStraightIcon as HeartStraight,
  HospitalIcon as Hospital,
  MedalIcon as Medal,
  SealCheckIcon as SealCheck,
  StarIcon as Star,
  StethoscopeIcon as Stethoscope,
  FlowerLotusIcon as FlowerLotus,
} from "@phosphor-icons/react/dist/ssr";
import { PHONE_TEL } from "@/components/layout/nav-links";
import { CountUp } from "@/components/shared/CountUp";

const QUALIFICATIONS = ["MBBS", "MS (OBG)", "DGO", "DNB (OBG)", "FICOG"];

const fade = (delay: number, reduce: boolean | null) => ({
  initial: reduce ? false : { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function BioHeader() {
  const reduce = useReducedMotion();

  return (
    <section className="relative -mt-36 flex overflow-hidden pt-[112px] pb-12 sm:pt-[130px] md:-mt-40 lg:items-center lg:pt-[170px] lg:pb-20">
      <svg aria-hidden viewBox="0 0 800 800" className="pointer-events-none absolute -right-40 top-1/2 hidden size-[52rem] -translate-y-1/2 text-rose-300/40 lg:block">
        {[140, 220, 300, 380].map((r) => (
          <circle key={r} cx="400" cy="400" r={r} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray={r % 220 === 0 ? "2 9" : undefined} />
        ))}
      </svg>
      <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 size-[26rem] rounded-full bg-pink-200/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-1/3 -top-20 size-[22rem] rounded-full bg-pink-200/50 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-[90rem] grid-cols-1 items-center gap-10 px-[22px] md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-10">
        <div>
          <motion.span
            {...fade(0, reduce)}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 backdrop-blur-sm"
          >
            <HeartStraight size={14} weight="fill" className="text-rose-500" />
            About Dr. Prema
          </motion.span>
          <motion.h1
            {...fade(0.08, reduce)}
            className="mt-5 font-display text-4xl font-bold leading-[1.06] tracking-tight text-rose-950 md:text-5xl lg:text-[3.5rem] xl:text-6xl"
          >
            A journey dedicated to{" "}
            <span className="relative inline-block text-rose-600">
              women&apos;s health
              <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-rose-300">
                <path d="M2 8c60-8 140-8 296-2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>
          <motion.p {...fade(0.16, reduce)} className="mt-6 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
            With over two decades of experience in Obstetrics and Gynaecology,
            Dr. Prema N. provides evidence-based, compassionate and
            personalised care for women at every stage of life.
          </motion.p>

          <motion.div {...fade(0.22, reduce)} className="mt-5 flex flex-wrap gap-2">
            {QUALIFICATIONS.map((q) => (
              <span key={q} className="inline-flex items-center gap-1 rounded-full border border-rose-100 bg-white px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm">
                <SealCheck size={12} weight="fill" className="text-rose-400" />
                {q}
              </span>
            ))}
          </motion.div>

          <motion.ul {...fade(0.28, reduce)} className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            {[
              { icon: Stethoscope, node: <CountUp value={20} suffix="+" />, label: "Years of experience" },
              { icon: Medal, node: <CountUp value={2} />, label: "University gold medals" },
              { icon: FlowerLotus, node: "OBG", label: "Advanced expertise" },
            ].map(({ icon: Icon, node, label }) => (
              <li key={label} className="rounded-2xl border border-white bg-white/85 p-3.5 shadow-[0_12px_28px_-18px_rgba(159,18,57,0.4)] backdrop-blur-sm">
                <Icon size={20} weight="light" className="text-rose-500" />
                <span className="mt-1.5 block font-display text-2xl font-bold leading-none text-rose-950">{node}</span>
                <span className="mt-1 block text-[11.5px] leading-snug text-rose-950/60">{label}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div {...fade(0.34, reduce)} className="mt-7 flex flex-wrap gap-3">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(225,29,72,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-[0.98]"
            >
              <CalendarCheck size={18} />
              Book an Appointment
            </a>
          </motion.div>
        </div>

        {/* Framed portrait, height-capped so the hero fits one screen */}
        <motion.div {...fade(0.12, reduce)} className="relative mx-auto w-full max-w-[20rem] lg:mr-0 lg:max-w-none lg:justify-self-center">
          <div className="relative mx-auto aspect-[4/5] w-full lg:h-[min(68svh,38rem)] lg:w-auto">
            <div className="absolute inset-0 overflow-hidden rounded-[28px] border-4 border-white bg-rose-100 shadow-[0_30px_60px_-25px_rgba(159,18,57,0.45)]">
              <Image
                src="/images/DSC08886.JPG.jpeg"
                alt="Dr. Prema N., Consultant Obstetrician and Gynaecologist"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 420px, 80vw"
                className="object-cover object-[50%_28%]"
              />
            </div>
            <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 backdrop-blur">
              <div>
                <p className="font-display text-sm font-bold text-rose-900">Dr. Prema N.</p>
                <p className="text-xs text-gray-600">Kovai Medical Center &amp; Hospital</p>
              </div>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600">Coimbatore</span>
            </div>
            <div className="absolute -left-4 top-6 z-20 rounded-xl border border-rose-100 bg-white px-4 py-3 shadow-[0_16px_40px_-18px_rgba(159,18,57,0.35)] sm:-left-8">
              <div className="flex items-center gap-1.5">
                <span className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} weight="fill" />
                  ))}
                </span>
                <span className="text-sm font-bold text-rose-950">1,353</span>
              </div>
              <p className="mt-1 text-[11px] text-rose-950/65">Google Reviews</p>
            </div>
            <div className="absolute -right-3 top-[30%] z-10 hidden items-center gap-2 rounded-xl border border-rose-100 bg-white px-3.5 py-2.5 shadow-[0_16px_40px_-18px_rgba(159,18,57,0.35)] sm:flex lg:-right-8">
              <Hospital size={20} weight="light" className="text-rose-500" />
              <span className="text-xs font-semibold leading-tight text-rose-950">
                Kovai Medical Center
                <span className="block font-normal text-rose-950/60">Coimbatore</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
