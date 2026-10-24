import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { CountUp } from "@/components/shared/CountUp";

const STATS = [
  { value: 20, suffix: "+", label: "Years of experience" },
  { value: 4000, suffix: "+", label: "Patients cared for" },
  { value: 3, suffix: "", label: "Hospital affiliations" },
  { value: 5, suffix: "", label: "Professional qualifications" },
];

export function TrustStats() {
  return (
    <Reveal className="mx-auto mt-[60px] max-w-[90rem] px-[22px] md:px-8 lg:px-10">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-sky-50 px-6 py-10 sm:px-10 md:min-h-[27rem] md:py-14 lg:px-14">
        {/* Soft colour glows */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(55% 75% at 85% 25%, rgba(251,113,133,0.28), transparent 62%), radial-gradient(45% 60% at 0% 100%, rgba(244,114,182,0.18), transparent 65%), radial-gradient(40% 50% at 60% 100%, rgba(125,211,252,0.28), transparent 70%)",
          }}
        />
        {/* Dot grid, fading toward the left */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: "radial-gradient(rgba(190,24,93,0.28) 1px, transparent 1.4px)",
            backgroundSize: "26px 26px",
            maskImage: "linear-gradient(90deg, transparent 25%, black 85%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 25%, black 85%)",
          }}
        />
        {/* Concentric rings behind the portrait */}
        <div aria-hidden className="absolute -right-24 top-1/2 -z-10 hidden -translate-y-1/2 md:block">
          <div className="relative size-[34rem]">
            <div className="absolute inset-0 rounded-full border border-rose-200/70" />
            <div className="absolute inset-[12%] rounded-full border border-dashed border-rose-300/60" />
            <div className="absolute inset-[26%] rounded-full border border-rose-200/60" />
            <div className="absolute inset-[38%] rounded-full bg-rose-300/40 blur-2xl" />
          </div>
        </div>
        {/* Heartbeat line */}
        <svg
          aria-hidden
          viewBox="0 0 800 80"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-[44%] -z-10 h-16 w-full opacity-50"
        >
          <path
            d="M0 40 H250 L275 40 L292 8 L318 72 L338 24 L352 40 H520 L545 40 L562 14 L585 64 L602 40 H800"
            fill="none"
            stroke="url(#ecg)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="ecg" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fb7185" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fb7185" />
              <stop offset="1" stopColor="#fb7185" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Doctor portrait */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-4 -z-10 hidden h-[92%] w-[26rem] md:block lg:right-16"
        >
          <Image
            src="/images/hero-img.png"
            alt=""
            fill
            sizes="416px"
            className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(159,18,57,0.18)]"
          />
        </div>

        <div className="flex h-full flex-col justify-between gap-12 md:min-h-[19rem]">
          <div>
            <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
              <span className="h-px w-8 bg-rose-600" />
              Trusted care
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
              Care that listens <span className="text-rose-600">before it treats.</span>
            </h2>
          </div>

          <dl className="grid grid-cols-2 gap-y-8 md:max-w-[46rem] md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="border-l border-rose-200 pl-5 pr-4">
                <dt className="font-display text-4xl font-bold text-rose-700 md:text-[2.6rem]">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dt>
                <dd className="mt-2 max-w-[10rem] text-sm leading-snug text-rose-950/65">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Reveal>
  );
}
