import {
  SmileyIcon as Smiley,
  StarIcon as Star,
  StethoscopeIcon as Stethoscope,
  ThumbsUpIcon as ThumbsUp,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { CountUp } from "@/components/shared/CountUp";

const METRICS = [
  { icon: Stethoscope, value: 20, suffix: "+", label: "Years of experience" },
  { icon: Smiley, value: 4000, suffix: "+", label: "Patients cared for" },
  { icon: Star, value: 1353, suffix: "", label: "Google reviews" },
  { icon: ThumbsUp, value: 98, suffix: "%", label: "Recommended on Practo" },
];

export function ServiceMetrics() {
  return (
    <Reveal className="relative z-10 mx-auto -mt-12 max-w-[90rem] px-[22px] md:px-8 lg:px-10">
      <ul className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white bg-white shadow-[0_30px_60px_-30px_rgba(159,18,57,0.4)] lg:grid-cols-4">
        {METRICS.map(({ icon: Icon, value, suffix, label }, i) => (
          <li
            key={label}
            className={`flex items-center gap-4 p-6 md:p-7 ${i % 2 === 1 ? "border-l border-rose-100" : ""} ${i > 1 ? "border-t border-rose-100 lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-rose-100" : ""}`}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-[0_10px_22px_-8px_rgba(244,63,94,0.7)]">
              <Icon size={24} weight="light" />
            </span>
            <span>
              <span className="block font-display text-3xl font-bold leading-none text-rose-950 md:text-4xl">
                <CountUp value={value} suffix={suffix} />
              </span>
              <span className="mt-1 block text-xs leading-snug text-rose-950/60 md:text-sm">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
