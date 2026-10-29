import Image from "next/image";
import {
  ArrowDownIcon as ArrowDown,
  CalendarCheckIcon as CalendarCheck,
  HeartStraightIcon as HeartStraight,
  SealCheckIcon as SealCheck,
  StethoscopeIcon as Stethoscope,
} from "@phosphor-icons/react/dist/ssr";
import { PHONE_TEL } from "@/components/layout/nav-links";
import { Reveal } from "@/components/shared/Reveal";

export function ServiceHeader({ count }: { count: number }) {
  return (
    <section className="relative -mt-36 overflow-hidden bg-gradient-to-b from-rose-100/70 via-rose-50 to-white pt-[112px] pb-24 sm:pt-[130px] md:-mt-40 lg:pt-[140px] lg:pb-32">
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
            Our Services
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-rose-950 md:text-5xl lg:text-6xl">
            Specialised care for every stage of{" "}
            <span className="relative inline-block text-rose-600">
              women&apos;s health
              <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-rose-300">
                <path d="M2 8c60-8 140-8 296-2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
            From childbirth and high-risk pregnancy to PCOS, fertility and
            surgical care, every service is delivered with clinical precision
            and compassion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(225,29,72,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-[0.98]"
            >
              <CalendarCheck size={18} />
              Book Consultation
            </a>
            <a
              href="#all-services"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-7 py-3.5 text-sm font-semibold text-rose-700 transition-all hover:-translate-y-0.5 hover:border-rose-300 active:scale-[0.98]"
            >
              Browse {count} services
              <ArrowDown size={16} weight="bold" />
            </a>
          </div>
        </Reveal>

        {/* Collage */}
        <Reveal delay={0.1} className="relative mx-auto grid w-full max-w-[34rem] grid-cols-[1.1fr_0.9fr] gap-4 lg:max-w-none">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-3xl shadow-[0_40px_70px_-30px_rgba(190,24,93,0.45)] ring-8 ring-white/70">
            <Image src="/images/services/high-risk-pregnancy-care.png" alt="Prenatal care" fill priority quality={90} sizes="(min-width: 1024px) 560px, 80vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-4 pt-10">
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-[0_30px_50px_-28px_rgba(190,24,93,0.45)] ring-4 ring-white/70">
              <Image src="/images/services/postpartum-care.png" alt="Reassuring care" fill sizes="(min-width: 1024px) 240px, 40vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_50px_-28px_rgba(190,24,93,0.45)] ring-4 ring-white/70">
              <Image src="/images/services/fertility-treatment.png" alt="Consultation room" fill sizes="(min-width: 1024px) 240px, 40vw" className="object-cover" />
            </div>
          </div>

          <div className="absolute -left-2 bottom-10 z-10 flex animate-[float-y_6s_ease-in-out_infinite] items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-[0_18px_40px_-18px_rgba(190,24,93,0.4)] backdrop-blur-md motion-reduce:animate-none sm:-left-8">
            <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-400 text-white">
              <Stethoscope size={22} weight="light" />
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight text-rose-950">{count} specialised services</span>
              <span className="block text-[11px] text-rose-950/60">Pregnancy to gynaecology</span>
            </span>
          </div>
          <div className="absolute -right-1 top-2 z-10 flex animate-[float-y_7s_ease-in-out_infinite_reverse] items-center gap-2 rounded-xl border border-white bg-white/90 px-3.5 py-2.5 shadow-[0_16px_36px_-18px_rgba(190,24,93,0.4)] backdrop-blur-md motion-reduce:animate-none sm:-right-5">
            <SealCheck size={20} weight="fill" className="text-sky-500" />
            <span className="text-xs font-semibold text-rose-950">Dr. Prema N.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
