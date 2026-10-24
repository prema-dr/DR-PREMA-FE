import type { ComponentType } from "react";
import {
  BookOpenIcon as BookOpen,
  CertificateIcon as Certificate,
  GraduationCapIcon as GraduationCap,
  MedalIcon as Medal,
  SealCheckIcon as SealCheck,
  StethoscopeIcon as Stethoscope,
  TrophyIcon as Trophy,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

type IconType = ComponentType<{ size?: number; weight?: "light" | "regular" | "fill"; className?: string }>;

const DEGREES: { code: string; name: string; icon: IconType }[] = [
  { code: "MBBS", name: "Bachelor of Medicine & Bachelor of Surgery", icon: Stethoscope },
  { code: "DGO", name: "Diploma in Obstetrics & Gynaecology", icon: BookOpen },
  { code: "MS (OG)", name: "Master of Surgery in Obstetrics & Gynaecology", icon: GraduationCap },
  { code: "DNB (OG)", name: "Diplomate of National Board in Obstetrics & Gynaecology", icon: Certificate },
  { code: "FICOG", name: "Fellow of the Indian College of Obstetricians & Gynaecologists", icon: Trophy },
];

const DISTINCTIONS = [
  "University Gold Medalist – MS (Obstetrics & Gynaecology)",
  "University Gold Medalist – DGO",
  "Best Outgoing Doctor – MS & DGO",
];

export function Academics() {
  return (
    <section className="bg-gradient-to-b from-white via-rose-50/60 to-white py-20 lg:py-24">
      <Reveal className="mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full bg-rose-100/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
              Academic foundation
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
              A strong academic foundation in{" "}
              <span className="text-rose-600">women&apos;s health</span>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
              Years of medical education and academic excellence have shaped
              Dr. Prema&apos;s approach to comprehensive women&apos;s healthcare.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 to-rose-800 p-6 text-white shadow-[0_30px_60px_-30px_rgba(159,18,57,0.6)] md:p-7">
            <Medal size={120} weight="light" aria-hidden className="pointer-events-none absolute -right-4 -top-4 rotate-12 text-white/10" />
            <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-rose-100">Academic distinctions</p>
            <ul className="relative mt-4 space-y-3">
              {DISTINCTIONS.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-[15px] font-medium leading-snug">
                  <SealCheck size={20} weight="fill" className="mt-0.5 shrink-0 text-amber-300" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <span aria-hidden className="absolute left-[10%] right-[10%] top-9 hidden border-t-2 border-dashed border-rose-200 lg:block" />
          {DEGREES.map(({ code, name, icon: Icon }, i) => (
            <li key={code} className="relative flex flex-col items-center text-center">
              <span className="relative flex size-[4.5rem] items-center justify-center rounded-full bg-white text-rose-500 shadow-[0_14px_30px_-12px_rgba(244,63,94,0.5)] ring-4 ring-rose-50 transition-transform duration-300 hover:scale-110">
                <Icon size={32} weight="light" />
                <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-rose-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <p className="mt-4 font-display text-xl font-bold text-rose-950">{code}</p>
              <p className="mt-1.5 max-w-[14rem] text-[13px] leading-snug text-rose-950/60">{name}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
