import Image from "next/image";
import {
  ArrowUpRightIcon as ArrowUpRight,
  CarIcon as Car,
  ClipboardTextIcon as ClipboardText,
  IdentificationCardIcon as IdentificationCard,
  MapPinIcon as MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { CLINIC_INFO } from "@/components/layout/clinic-info";

const TIPS = [
  { icon: ClipboardText, title: "Bring your records", text: "Previous reports, scans and prescriptions help Dr. Prema see the full picture." },
  { icon: IdentificationCard, title: "Note your questions", text: "Write down anything you'd like to ask, so nothing is missed in the conversation." },
  { icon: Car, title: "Plan your arrival", text: "We're near KMCH Hospital, Indira Nagar. Arrive a few minutes early to settle in." },
];

export function VisitSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/60 to-rose-50/50 py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 size-[28rem] rounded-full bg-rose-100/50 blur-3xl" />
      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 shadow-sm">
            Visit the clinic
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            Find us <span className="text-rose-600">near KMCH</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Map */}
          <a
            href={CLINIC_INFO.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block min-h-[22rem] overflow-hidden rounded-[2rem] border-8 border-white bg-rose-100 shadow-[0_40px_80px_-40px_rgba(159,18,57,0.5)]"
          >
            <Image src="/images/clinic-map.png" alt={`Map showing the clinic at ${CLINIC_INFO.addressLine1}`} fill sizes="(min-width: 1024px) 760px, 95vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/40 via-transparent to-transparent" />
            <span className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-rose-500/40 motion-reduce:animate-none" />
              <span className="relative flex size-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-[0_14px_28px_-8px_rgba(225,29,72,0.8)] ring-4 ring-white">
                <MapPin size={24} weight="fill" />
              </span>
            </span>
            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:flex-row sm:items-center sm:justify-between">
              <span>
                <span className="block font-display text-lg font-bold text-rose-950">Dr. Prema&apos;s Clinic</span>
                <span className="block text-sm text-rose-950/65">
                  {CLINIC_INFO.addressLine1}, {CLINIC_INFO.addressLine2}
                </span>
              </span>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition-transform group-hover:-translate-y-0.5">
                Get directions
                <ArrowUpRight size={16} weight="bold" />
              </span>
            </div>
          </a>

          {/* Tips */}
          <div>
            <p className="font-display text-2xl font-bold text-rose-950">Before you visit</p>
            <ol className="mt-6 space-y-5">
              {TIPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="group flex gap-4">
                  <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-[0_12px_26px_-14px_rgba(159,18,57,0.5)] ring-1 ring-rose-100 transition-all duration-300 group-hover:bg-rose-600 group-hover:text-white">
                    <Icon size={26} weight="light" />
                    <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-rose-600 text-[11px] font-bold text-white ring-2 ring-white">{i + 1}</span>
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold text-rose-950">{title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-rose-950/60">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
