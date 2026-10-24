import Image from "next/image";
import {
  ArrowRightIcon as ArrowRight,
  CalendarCheckIcon as CalendarCheck,
  CheckCircleIcon as CheckCircle,
  HeartStraightIcon as HeartStraight,
  PhoneIcon as Phone,
  SealCheckIcon as SealCheck,
} from "@phosphor-icons/react/dist/ssr";
import { PHONE_TEL } from "@/components/layout/nav-links";
import { CLINIC_INFO } from "@/components/layout/clinic-info";
import { Reveal } from "@/components/shared/Reveal";

const POINTS = ["Planning a pregnancy", "Specialised gynaecological care", "Guidance through a complex pregnancy"];

export function AboutCta() {
  return (
    <Reveal className="mx-auto mt-20 max-w-[90rem] px-[22px] md:px-8 lg:px-10">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 shadow-[0_50px_90px_-40px_rgba(159,18,57,0.8)]">
        {/* decoration */}
        <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-24 size-[34rem] text-white/10">
          {[60, 110, 160, 210].map((r) => (
            <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
          ))}
        </svg>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(to_right,black,transparent_60%)]"
        />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-sky-300/25 blur-3xl" />
        <HeartStraight size={150} weight="light" aria-hidden className="pointer-events-none absolute bottom-6 left-[44%] hidden rotate-[-14deg] text-white/10 lg:block" />

        <div className="relative grid grid-cols-1 items-center gap-10 px-8 pt-14 md:px-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-6 lg:pt-0">
          <div className="lg:py-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white ring-1 ring-white/25 backdrop-blur-sm">
              <HeartStraight size={14} weight="fill" className="text-rose-200" />
              Take the next step
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-[3.4rem]">
              Your health deserves{" "}
              <span className="relative inline-block">
                personalised care.
                <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-2.5 w-full text-rose-200/80">
                  <path d="M2 8c60-8 140-8 296-2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-rose-50/85">
              Whether you are planning a pregnancy, seeking specialised
              gynaecological care or looking for guidance through a complex
              pregnancy, Dr. Prema and her team are here to support you.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm font-medium text-white">
                  <CheckCircle size={18} weight="fill" className="text-rose-200" />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={PHONE_TEL}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-rose-700 shadow-[0_18px_34px_-14px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <CalendarCheck size={18} />
                Book an Appointment
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={PHONE_TEL}
                className="inline-flex items-center gap-3 rounded-full border border-white/40 py-2 pl-2 pr-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10 active:scale-[0.98]"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
                  <Phone size={18} weight="fill" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[11px] font-medium text-rose-100">Call now</span>
                  {CLINIC_INFO.phone}
                </span>
              </a>
            </div>
          </div>

          {/* Doctor */}
          <div className="relative mx-auto h-[26rem] w-full max-w-sm self-end lg:h-[34rem] lg:max-w-none">
            <div aria-hidden className="absolute bottom-0 left-1/2 aspect-square w-[88%] -translate-x-1/2 translate-y-[18%] rounded-full bg-gradient-to-t from-white/25 to-white/5 ring-1 ring-white/30" />
            <Image
              src="/images/hero-img.png"
              alt="Dr. Prema N., Consultant Obstetrician and Gynaecologist"
              fill
              sizes="(min-width: 1024px) 420px, 80vw"
              className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(60,0,20,0.45)]"
            />
            <div className="absolute bottom-6 left-0 z-10 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.5)] sm:-left-4">
              <SealCheck size={26} weight="fill" className="shrink-0 text-sky-500" />
              <span>
                <span className="block text-sm font-bold leading-tight text-rose-950">Dr. Prema N.</span>
                <span className="block text-[11px] text-rose-950/65">Consultant Obstetrician &amp; Gynaecologist</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
