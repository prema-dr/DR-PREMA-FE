import {
  FlagIcon as Flag,
  MapPinIcon as MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

const ENTRIES = [
  { years: "2008 – 2011", role: "Junior Resident", place: "Government Medical College, Thiruvananthapuram" },
  { years: "2011 – 2013", role: "Assistant Professor", place: "Dhanalakshmi Srinivasan Medical College, Perambalur" },
  { years: "2013 – 2017", role: "Assistant Professor", place: "Karpagam Faculty of Medical Sciences & Research" },
  { years: "2017 – 2020", role: "Associate Professor", place: "Karpagam Faculty of Medical Sciences & Research" },
  { years: "2020 – 2023", role: "Associate Professor", place: "KMCH Institute of Health Sciences & Research" },
  { years: "2023 – 2026", role: "Professor", place: "KMCH Institute of Health Sciences & Research" },
  { years: "2026 – Present", role: "Consultant – Obstetrics & Gynaecology", place: "Kovai Medical Center & Hospital, Coimbatore" },
];

const LAST = ENTRIES.length - 1;

// Pin positions in % of the mountain canvas, climbing left to right.
const POINTS = ENTRIES.map((_, i) => ({ x: 7 + i * 14.3, y: 80 - i * 11.5 }));

// Winding trail through the pins (SVG viewBox is 0..100 on both axes).
const TRAIL = POINTS.reduce((d, p, i) => {
  if (i === 0) return `M${p.x} ${p.y}`;
  const q = POINTS[i - 1];
  const mx = (q.x + p.x) / 2;
  return `${d} C${mx} ${q.y} ${mx} ${p.y} ${p.x} ${p.y}`;
}, "");

export function Timeline() {
  return (
    <section id="journey" className="relative scroll-mt-32 overflow-hidden bg-gradient-to-b from-rose-50 via-sky-50/70 to-rose-50/40 pt-20 lg:pt-28 lg:pb-0">
      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 shadow-sm">
          Professional journey
        </span>
        <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
          A climb of learning, service and{" "}
          <span className="text-rose-600">growing impact</span>
        </h2>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
          From early clinical training to consultant practice and academic
          leadership, every step has taken Dr. Prema higher.
        </p>

      </Reveal>

        {/* Desktop: mountain */}
        <div className="relative mt-4 hidden h-[640px] w-full overflow-hidden lg:block">
          <div aria-hidden className="absolute right-[14%] top-8 size-20 rounded-full bg-gradient-to-br from-amber-100 to-rose-200 blur-[2px]" />
          <div className="absolute inset-0 mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
            <div className="relative h-full">
              <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
                <polygon points="-60,100 -60,60 -10,45 14,40 26,54 42,28 58,50 72,30 100,55 160,40 160,100" fill="#fbd5e2" opacity="0.55" />
                <polygon points="-60,100 -60,85 0,80 16,62 30,74 50,48 66,62 92.8,8 112,50 160,70 160,100" fill="#f9a8c6" opacity="0.5" />
                <polygon points="92.8,8 87,20 90.5,17 93,22 96,17 99,20" fill="#fff" opacity="0.85" />
                <polygon points="-60,100 -60,92 20,76 38,88 60,70 82,84 160,72 160,100" fill="#f472a3" opacity="0.35" />
                <path d={TRAIL} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 7" vectorEffect="non-scaling-stroke" />
              </svg>

              {ENTRIES.map((e, i) => {
                const p = POINTS[i];
                const top = i === LAST;
                return (
                  <div key={e.years + e.place}>
                    <span
                      className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white ring-4 ring-white ${
                        top
                          ? "size-14 bg-rose-700 shadow-[0_0_0_10px_rgba(225,29,72,0.18)]"
                          : "size-9 bg-rose-500 shadow-[0_8px_18px_-6px_rgba(225,29,72,0.7)]"
                      }`}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    >
                      {top ? <Flag size={26} weight="fill" /> : <MapPin size={18} weight="fill" />}
                    </span>
                    <div
                      className="absolute z-10 w-[10.5rem] -translate-x-1/2 text-center"
                      style={{ left: `${p.x}%`, top: `calc(${p.y}% + ${top ? 36 : 26}px)` }}
                    >
                      <p className={`font-bold uppercase tracking-wider text-rose-600 ${top ? "text-xs" : "text-[11px]"}`}>{e.years}</p>
                      <p className={`mt-1 font-display font-bold leading-tight text-rose-950 ${top ? "text-base" : "text-sm"}`}>{e.role}</p>
                      <p className="mt-1 text-[11.5px] leading-snug text-rose-950/70">{e.place}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
        </div>

        {/* Mobile: trail */}
      <div className="mx-auto max-w-[90rem] px-[22px] pb-16 md:px-8 lg:hidden">
        <ol className="relative mt-10 space-y-5 border-l-2 border-dashed border-rose-300 pl-8 lg:hidden">
          {[...ENTRIES].reverse().map((e, r) => {
            const top = r === 0;
            return (
              <li key={e.years + e.place} className="relative">
                <span
                  className={`absolute -left-[3.2rem] top-3 flex size-9 items-center justify-center rounded-full text-white ring-4 ring-white ${top ? "bg-rose-700" : "bg-rose-500"}`}
                >
                  {top ? <Flag size={18} weight="fill" /> : <MapPin size={16} weight="fill" />}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-600">{e.years}</p>
                  <p className="mt-1 font-display text-base font-bold text-rose-950">{e.role}</p>
                  <p className="mt-1 text-[13px] text-rose-950/65">{e.place}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
