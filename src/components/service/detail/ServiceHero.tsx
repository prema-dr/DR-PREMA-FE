import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import {
  CalendarCheckIcon as CalendarCheck,
  HeartStraightIcon as HeartStraight,
  SealCheckIcon as SealCheck,
  StarIcon as Star,
  WhatsappLogoIcon as WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { PHONE_TEL, whatsappLink } from "@/components/layout/nav-links";
import { ServiceIcon } from "@/lib/service-icons";
import type { ServiceDetail } from "@/lib/site-api";

const BLOB = "rounded-[44%_56%_48%_52%/40%_46%_54%_60%]";

export function ServiceHero({ service }: { service: ServiceDetail }) {
  return (
    <section className="relative -mt-36 overflow-hidden bg-gradient-to-b from-rose-100/70 via-rose-50 to-white pt-[112px] pb-20 sm:pt-[130px] md:-mt-40 lg:pt-[140px] lg:pb-28">
      <svg aria-hidden viewBox="0 0 800 800" className="pointer-events-none absolute -right-48 top-1/2 hidden size-[52rem] -translate-y-1/2 text-rose-300/40 lg:block">
        {[140, 220, 300, 380].map((r) => (
          <circle key={r} cx="400" cy="400" r={r} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray={r % 220 === 0 ? "2 9" : undefined} />
        ))}
      </svg>
      <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 size-[26rem] rounded-full bg-sky-100/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-12 px-[22px] md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10">
        <div>
          <nav aria-label="Breadcrumb" className="text-xs text-rose-950/60">
            <Link href="/" className="hover:text-rose-700">Home</Link>
            {" / "}
            <Link href="/service" className="hover:text-rose-700">Services</Link>
            {" / "}
            <span className="font-medium text-rose-950">{service.name}</span>
          </nav>

          <span
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 backdrop-blur-sm"
          >
            <ServiceIcon iconKey={service.iconKey} size={14} weight="fill" className="text-rose-500" />
            {service.name}
          </span>

          <h1
            className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-rose-950 md:text-5xl lg:text-[3.4rem]"
          >
            {service.heroHeading}
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
            {service.heroSub}
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
              href={whatsappLink(`Hello Dr. Prema, I would like to know more about ${service.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-7 py-3.5 text-sm font-semibold text-rose-700 transition-all hover:-translate-y-0.5 hover:border-rose-300 active:scale-[0.98]"
            >
              <WhatsappLogo size={18} weight="fill" className="text-emerald-500" />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Image */}
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[34rem] pb-8 pt-4 lg:max-w-none">
          <div aria-hidden className={`absolute inset-x-2 top-0 bottom-10 -rotate-3 scale-[1.04] border-2 border-rose-200/80 bg-gradient-to-br from-rose-100/60 to-transparent ${BLOB}`} />
          <div className={`relative aspect-[1/0.92] overflow-hidden shadow-[0_40px_70px_-30px_rgba(190,24,93,0.45)] ring-8 ring-white/70 ${BLOB}`}>
            <Image
              src={service.image}
              alt={service.name}
              fill
              priority
              sizes="(min-width: 1024px) 560px, 90vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rose-200/25 via-transparent to-white/10" />
          </div>

          <div
            className="animate-[float-y_6s_ease-in-out_infinite] motion-reduce:animate-none absolute -left-2 top-[18%] z-10 flex items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-[0_18px_40px_-18px_rgba(190,24,93,0.4)] backdrop-blur-md sm:-left-8"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-400 text-white">
              <ServiceIcon iconKey={service.iconKey} size={22} weight="light" />
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight text-rose-950">{service.name}</span>
              <span className="block text-[11px] text-rose-950/60">Guided by evidence</span>
            </span>
          </div>

          <div
            className="animate-[float-y_7s_ease-in-out_infinite_reverse] motion-reduce:animate-none absolute -right-2 bottom-2 z-10 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-[0_18px_40px_-18px_rgba(190,24,93,0.4)] backdrop-blur-md sm:-right-6"
          >
            <span className="flex items-center gap-2">
              <SealCheck size={22} weight="fill" className="text-sky-500" />
              <span className="text-sm font-bold text-rose-950">Dr. Prema N.</span>
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-rose-950/60">
              <span className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} weight="fill" />
                ))}
              </span>
              1,353 Google reviews
            </span>
          </div>

          <HeartStraight size={64} weight="fill" aria-hidden className="pointer-events-none absolute -top-2 right-8 text-rose-200" />
        </Reveal>
      </div>
    </section>
  );
}
