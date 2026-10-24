"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRightIcon as ArrowRight,
  CalendarCheckIcon as CalendarCheck,
  ChatsCircleIcon as ChatsCircle,
  FileTextIcon as FileText,
  HandHeartIcon as HandHeart,
  HeartIcon as Heart,
  HeartStraightIcon as HeartStraight,
  LeafIcon as Leaf,
  UsersThreeIcon as UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { PHONE_TEL } from "@/components/layout/nav-links";

type IconType = ComponentType<{ size?: number; weight?: "light" | "regular" | "fill"; className?: string }>;

const STEPS: { icon: IconType; title: string; text: string }[] = [
  { icon: ChatsCircle, title: "Listen", text: "We take time to understand you" },
  { icon: FileText, title: "Explain", text: "Clear answers, no confusion" },
  { icon: Heart, title: "Personalise", text: "Care plans tailored to your needs" },
  { icon: UsersThree, title: "Support", text: "We're with you at every step" },
];

// Organic photo mask: large soft curves, like a pebble.
const BLOB = "rounded-[44%_56%_48%_52%/40%_46%_54%_60%]";

function FloatingCard({
  icon: Icon,
  title,
  text,
  className,
  delay,
}: {
  icon: IconType;
  title: string;
  text: string;
  className: string;
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: reduce ? 0 : [0, -6, 0] }}
      viewport={{ once: true }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 },
      }}
      className={`absolute z-20 flex max-w-[15rem] items-start gap-3 rounded-2xl border border-white bg-white/85 p-4 shadow-[0_18px_40px_-18px_rgba(190,24,93,0.4)] backdrop-blur-md ${className}`}
    >
      <Icon size={30} weight="light" className="mt-0.5 shrink-0 text-rose-500" />
      <span>
        <span className="block text-[15px] font-semibold leading-tight text-rose-950">{title}</span>
        <span className="mt-1 block text-xs leading-snug text-rose-950/60">{text}</span>
      </span>
    </motion.div>
  );
}

export function ApproachSplit() {
  const reduce = useReducedMotion();

  return (
    <section className="relative mt-12 overflow-hidden bg-gradient-to-b from-white via-rose-50/50 to-white pb-8 pt-20">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 size-[30rem] rounded-full bg-rose-100/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 size-[28rem] rounded-full bg-pink-100/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-16 px-[22px] md:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:px-10">
        {/* Photo */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[34rem] pb-10 pt-6 lg:mx-0"
        >
          {/* offset outline blobs */}
          <div aria-hidden className={`absolute inset-x-0 top-2 bottom-12 -rotate-3 scale-[1.04] border-2 border-rose-200/80 bg-gradient-to-br from-rose-100/60 to-transparent ${BLOB}`} />
          <div aria-hidden className={`absolute inset-x-0 top-6 bottom-14 rotate-2 scale-[1.02] border border-pink-200/70 ${BLOB}`} />

          <div className={`relative aspect-[1/1.02] overflow-hidden shadow-[0_40px_70px_-30px_rgba(190,24,93,0.45)] ring-8 ring-white/70 ${BLOB}`}>
            <Image
              src="/images/approach.jpeg"
              alt="Dr. Prema listening to a patient in a calm, softly lit consultation room"
              fill
              sizes="(min-width: 1024px) 520px, 90vw"
              className="object-cover object-[50%_20%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rose-200/25 via-transparent to-white/10" />
          </div>

          {/* leaf accent */}
          <Leaf
            size={110}
            weight="light"
            aria-hidden
            className="pointer-events-none absolute -right-6 bottom-20 z-10 rotate-[28deg] text-rose-300/70"
          />

          <FloatingCard
            icon={HeartStraight}
            title="Real Conversations"
            text="We listen, understand and guide you."
            className="-left-2 top-14 sm:-left-8"
            delay={0.3}
          />
          <FloatingCard
            icon={CalendarCheck}
            title="Personalised Care"
            text="Every plan is tailored to you."
            className="-right-2 bottom-2 sm:-right-6"
            delay={0.5}
          />

          {/* handwritten tagline */}
          <p
            aria-hidden
            className="pointer-events-none absolute -bottom-1 left-0 z-10 -rotate-6 font-[family-name:var(--font-script)] text-[1.7rem] font-semibold leading-[1.15] text-rose-500 sm:left-2 sm:text-3xl"
          >
            Your health.
            <br />
            <span className="ml-5">Our priority.</span>
            <Heart size={20} weight="regular" className="mt-1 ml-8 text-rose-400" />
          </p>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
            <HeartStraight size={14} weight="fill" className="text-rose-500" />
            Our Approach
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            An approach built on <span className="text-rose-600">time and trust</span>
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
            At Dr. Prema&apos;s practice, every journey begins with a conversation. We take time to
            understand your concerns, explain every option clearly, and create a care plan that fits
            your unique needs. Because true care is not just about treatment — it&apos;s about trust,
            comfort and confidence at every step.
          </p>

          <ul className="mt-9 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <li
                key={title}
                className={`px-3 text-center ${index > 0 ? "sm:border-l sm:border-rose-200/70" : ""}`}
              >
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 to-rose-100 text-rose-500 ring-4 ring-white shadow-[0_10px_24px_-12px_rgba(244,63,94,0.5)] transition-transform duration-300 hover:scale-110">
                  <Icon size={28} weight="light" />
                </span>
                <span className="mt-3 block font-display text-base font-bold text-rose-950">{title}</span>
                <span className="mt-1 block text-[13px] leading-snug text-rose-950/60">{text}</span>
              </li>
            ))}
          </ul>

          <div className="relative mt-9 flex flex-col items-start gap-5 overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-100/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <Leaf size={90} weight="light" aria-hidden className="pointer-events-none absolute -right-2 -top-2 rotate-12 text-rose-200/80" />
            <div className="relative flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm">
                <HandHeart size={28} weight="light" />
              </span>
              <p className="font-display text-[17px] font-bold leading-snug text-rose-950">
                More than treatment,
                <span className="block text-rose-600">a long-term partnership for your well-being.</span>
              </p>
            </div>
            <a
              href={PHONE_TEL}
              className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(225,29,72,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-[0.98]"
            >
              Book a Consultation
              <ArrowRight size={16} weight="bold" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
