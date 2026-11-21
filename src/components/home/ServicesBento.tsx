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
      className={`group flex items-center gap-3 rounded-2xl border border-white bg-white/85 p-3 shadow-[0_14px_34px_-16px_rgba(190,24,93,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_20px_40px_-16px_rgba(190,24,93,0.45)] ${compact ? "w-full" : "w-[190px] xl:w-[210px]"
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
    <section className="relative overflow-hidden pb-6 pt-20">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 size-[32rem] rounded-full bg-rose-100/50 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-24 size-[30rem] rounded-full bg-pink-100/60 blur-2xl" />

      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-14 px-[22px] md:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:px-10">
        {/* Copy */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:order-3"
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

        {/* Photo + service cards */}
        <div className="grid items-center gap-6 sm:grid-cols-[0.9fr_1.1fr] lg:contents">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto aspect-[4/5] w-full lg:aspect-auto lg:self-stretch max-w-md overflow-hidden lg:order-1 rounded-[28px] border-4 border-white bg-gradient-to-b from-rose-50 to-rose-200 shadow-[0_30px_60px_-25px_rgba(159,18,57,0.45)] sm:max-w-none lg:max-w-none"
          >
            <Image
              src="/images/DSC08908.JPG.jpeg"
              alt="Dr. Prema N."
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 40vw, 90vw"
              className="object-cover object-[50%_26%]"
            />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 px-4 py-3 backdrop-blur">
              <p className="font-display text-sm font-bold text-rose-900">Dr. Prema N.</p>
              <p className="text-xs text-gray-600">Consultant Obstetrician &amp; Gynaecologist</p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3 lg:order-2">
            {NODES.map((node, index) => (
              <motion.div
                key={node.title}
                initial={reduce ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <NodeCard node={node} compact />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
