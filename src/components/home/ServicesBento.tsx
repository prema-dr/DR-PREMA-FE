"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRightIcon as ArrowRight,
  BabyIcon as Baby,
  FlowerIcon as Flower,
  HeartbeatIcon as Heartbeat,
  ShieldCheckIcon as ShieldCheck,
  SparkleIcon as Sparkle,
  SunIcon as Sun,
} from "@phosphor-icons/react/dist/ssr";

type IconType = ComponentType<{ size?: number; weight?: "light" | "regular" | "fill"; className?: string }>;

type ServiceNode = {
  title: string;
  text: string;
  href: string;
  icon: IconType;
  /** Position on the orbit, in % of the square stage. */
  x: number;
  y: number;
};

// Five nodes spaced 72° apart on a circle of radius 38% around the centre.
const NODES: ServiceNode[] = [
  { title: "Fertility Care", text: "IVF, IUI, ICSI and fertility assessment", href: "/service/fertility-treatment", icon: Flower, x: 50, y: 12 },
  { title: "Pregnancy Care", text: "A safe and supported journey to motherhood", href: "/service/normal-delivery", icon: Baby, x: 86, y: 38 },
  { title: "Minimally Invasive Procedures", text: "Advanced procedures with quicker recovery", href: "/service/no-scar-hysterectomy", icon: ShieldCheck, x: 72, y: 81 },
  { title: "Menopause Care", text: "Personalised hormonal wellness", href: "/service", icon: Sun, x: 28, y: 81 },
  { title: "Women's Health", text: "PCOS, menstrual health, hormonal balance", href: "/service/bleeding-menses-problems", icon: Heartbeat, x: 14, y: 38 },
];

function NodeCard({ node, compact = false }: { node: ServiceNode; compact?: boolean }) {
  const Icon = node.icon;
  return (
    <Link
      href={node.href}
      className={`group flex items-center gap-3 rounded-2xl border border-white bg-white/85 p-3 shadow-[0_14px_34px_-16px_rgba(190,24,93,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_20px_40px_-16px_rgba(190,24,93,0.45)] ${
        compact ? "w-full" : "w-[190px] xl:w-[210px]"
      }`}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-100 transition-colors duration-300 group-hover:bg-rose-600 group-hover:text-white">
        <Icon size={22} weight="regular" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight text-rose-950">{node.title}</span>
        <span className="mt-0.5 block text-[11.5px] leading-snug text-rose-950/60">{node.text}</span>
      </span>
    </Link>
  );
}

export function ServicesBento() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50/70 pb-6 pt-20">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 size-[32rem] rounded-full bg-rose-100/50 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-24 size-[30rem] rounded-full bg-pink-100/60 blur-2xl" />

      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-14 px-[22px] md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-6 lg:px-10">
        {/* Copy */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/80 px-4 py-1.5 text-xs font-semibold text-rose-700">
            <Sparkle size={14} weight="fill" />
            Our Services
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            Complete Women&apos;s Care{" "}
            <span className="text-rose-600">Under One Roof</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-rose-950/65">
            From adolescence to menopause, we provide comprehensive care tailored to every phase of
            your life.
          </p>
          <Link
            href="/service"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgba(232,64,122,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-[0.98]"
          >
            Explore All Services
            <ArrowRight size={18} weight="bold" />
          </Link>
        </motion.div>

        {/* Orbit infographic (desktop) */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-[660px] lg:-mb-12 lg:block">
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
            <defs>
              <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fb7185" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#orbit-glow)" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#f9a8c4" strokeWidth="0.25" />
            <circle cx="50" cy="50" r="27" fill="none" stroke="#fbcfe0" strokeWidth="0.25" strokeDasharray="1 1.4" />
            {NODES.map((n) => (
              <line key={n.title} x1="50" y1="50" x2={n.x} y2={n.y} stroke="#f472b6" strokeOpacity="0.35" strokeWidth="0.22" strokeDasharray="1 1.2" />
            ))}
          </svg>

          {/* slowly rotating dashed ring */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border border-dashed border-rose-300/60 motion-reduce:animate-none"
            style={{ animationDuration: "80s" }}
          />

          {/* Doctor portrait */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-1/2 size-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white to-rose-100 p-[5px] shadow-[0_30px_60px_-20px_rgba(190,24,93,0.45)] ring-8 ring-white/60"
          >
            <div className="relative size-full overflow-hidden rounded-full bg-gradient-to-b from-rose-50 to-rose-200">
              <Image
                src="/images/home-scnd-section.png"
                alt="Dr. Prema"
                fill
                sizes="240px"
                className="object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Service nodes */}
          {NODES.map((node, index) => (
            <motion.div
              key={node.title}
              initial={reduce ? false : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.25 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
              style={{ left: `${node.x}%`, top: `${node.y}%`, translate: "-50% -50%" }}
            >
              <NodeCard node={node} />
            </motion.div>
          ))}
        </div>

        {/* Stacked fallback (mobile / tablet) */}
        <div className="lg:hidden">
          <div className="mx-auto mb-8 size-48 rounded-full bg-gradient-to-br from-white to-rose-100 p-1 shadow-[0_24px_50px_-20px_rgba(190,24,93,0.45)] ring-8 ring-white/60">
            <div className="relative size-full overflow-hidden rounded-full bg-gradient-to-b from-rose-50 to-rose-200">
              <Image src="/images/home-scnd-section.png" alt="Dr. Prema" fill sizes="192px" className="object-cover object-top" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {NODES.map((node) => (
              <NodeCard key={node.title} node={node} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
