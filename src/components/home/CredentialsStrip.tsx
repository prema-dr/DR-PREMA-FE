import type { ComponentType } from "react";
import {
  BookOpenIcon as BookOpen,
  CertificateIcon as Certificate,
  ChalkboardTeacherIcon as ChalkboardTeacher,
  GraduationCapIcon as GraduationCap,
  SealCheckIcon as SealCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { CountUp } from "@/components/shared/CountUp";

type IconType = ComponentType<{
  size?: number;
  weight?: "regular" | "fill" | "light";
  className?: string;
}>;

type Credential = {
  eyebrow: string;
  title: string;
  count?: { value: number; suffix: string };
  text: string;
  icon: IconType;
  /** Tailwind classes per colour family. */
  accent: {
    bar: string;
    tile: string;
    glow: string;
    eyebrow: string;
    mark: string;
  };
};

const ROSE = {
  bar: "from-rose-400 to-pink-500",
  tile: "from-rose-500 to-pink-400",
  glow: "shadow-[0_10px_22px_-8px_rgba(244,63,94,0.7)]",
  eyebrow: "text-rose-600",
  mark: "text-rose-100",
};
const SKY = {
  bar: "from-sky-400 to-blue-500",
  tile: "from-sky-500 to-blue-400",
  glow: "shadow-[0_10px_22px_-8px_rgba(14,165,233,0.7)]",
  eyebrow: "text-sky-600",
  mark: "text-sky-100",
};

const CREDENTIALS: Credential[] = [
  {
    eyebrow: "Fellowship",
    title: "FICOG",
    text: "Fellowship, ICOG India",
    icon: GraduationCap,
    accent: ROSE,
  },
  {
    eyebrow: "Board certified",
    title: "DNB (OBG)",
    text: "National Board of Exams",
    icon: Certificate,
    accent: SKY,
  },
  {
    eyebrow: "Academic",
    title: "Professor",
    text: "KMCH, Coimbatore",
    icon: ChalkboardTeacher,
    accent: SKY,
  },
  {
    eyebrow: "Experience",
    title: "Years",
    count: { value: 20, suffix: "+" },
    text: "In women's healthcare",
    icon: BookOpen,
    accent: ROSE,
  },
];

export function CredentialsStrip() {
  return (
    <section className="bg-gradient-to-b from-sky-100 via-sky-50 to-rose-50 py-10">
      <Reveal className="mx-auto w-full max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CREDENTIALS.map(
            ({ eyebrow, title, count, text, icon: Icon, accent }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-white bg-white/90 p-4 pl-5 shadow-[0_14px_32px_-18px_rgba(15,23,42,0.4)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_40px_-18px_rgba(15,23,42,0.45)]"
              >
                {/* accent bar */}
                <span
                  aria-hidden
                  className={`absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b ${accent.bar}`}
                />
                {/* watermark */}
                <Icon
                  size={76}
                  weight="light"
                  className={`pointer-events-none absolute -bottom-6 -right-4 rotate-[-12deg] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110 ${accent.mark}`}
                />
                {/* shine sweep */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100"
                />

                <div className="relative flex items-start gap-3.5">
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ring-4 ring-white ${accent.tile} ${accent.glow}`}
                  >
                    <Icon size={24} weight="regular" />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-[0.14em] ${accent.eyebrow}`}
                    >
                      <SealCheck size={12} weight="fill" />
                      {eyebrow}
                    </span>
                    <span className="mt-1 block font-display text-xl font-bold leading-tight text-rose-950">
                      {count ? (
                        <>
                          <CountUp value={count.value} suffix={count.suffix} />{" "}
                          {title}
                        </>
                      ) : (
                        title
                      )}
                    </span>
                    <span className="mt-1 block whitespace-nowrap text-sm leading-snug text-rose-950/60">
                      {text}
                    </span>
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      </Reveal>
    </section>
  );
}
