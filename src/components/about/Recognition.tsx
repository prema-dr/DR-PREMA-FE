import {
  BookOpenIcon as BookOpen,
  ChalkboardTeacherIcon as ChalkboardTeacher,
  GlobeHemisphereWestIcon as Globe,
  MedalIcon as Medal,
  QuotesIcon as Quotes,
  SealCheckIcon as SealCheck,
  StarIcon as Star,
  TrophyIcon as Trophy,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { CountUp } from "@/components/shared/CountUp";

const RESEARCH = [
  "High-Risk Obstetrics",
  "VBAC Outcomes",
  "Reproductive Medicine & ICSI",
  "PCOS and Thyroid Disorders",
  "Preeclampsia Screening",
];

const MEMBERSHIPS = [
  { code: "FICOG", text: "Fellow, Indian College of Obstetricians and Gynaecologists" },
  { code: "FOGSI", text: "Life Member, Federation of Obstetric and Gynaecological Societies of India" },
  { code: "IMA", text: "Life Member, Indian Medical Association" },
  { code: "TNMC", text: "Life Member, Tamil Nadu Medical Council" },
];

const LADDER = ["Assistant Professor", "Associate Professor", "Professor"];

const TILE =
  "group relative overflow-hidden rounded-3xl border border-rose-100 bg-white p-7 shadow-[0_14px_36px_-22px_rgba(159,18,57,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_44px_-22px_rgba(159,18,57,0.4)]";
const EYEBROW = "text-xs font-bold uppercase tracking-[0.2em] text-rose-600";
const GOLD = "bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 bg-clip-text text-transparent";

export function Recognition() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/70 to-sky-50/60 py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-0 size-[34rem] rounded-full bg-rose-200/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 size-[34rem] rounded-full bg-sky-200/50 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#f9a8c6_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 shadow-sm ring-1 ring-rose-100">
            <Trophy size={14} weight="fill" className="text-amber-500" />
            Recognition &amp; standing
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-rose-950 md:text-5xl lg:text-6xl">
            A career built on <span className={GOLD}>excellence</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-rose-950/60">
            Honours, research and professional memberships that reflect a
            lifelong commitment to women&apos;s healthcare.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-6 lg:grid-cols-12">
          {/* Gold medals */}
          <div className={`${TILE} md:col-span-3 lg:col-span-5`}>
            <Medal size={170} weight="light" aria-hidden className="pointer-events-none absolute -bottom-10 -right-6 rotate-12 text-amber-200/50 transition-transform duration-500 group-hover:rotate-0" />
            <p className={EYEBROW}>Achievements</p>
            <p className={`mt-3 font-display text-8xl font-bold leading-none ${GOLD}`}>
              <CountUp value={2} />
            </p>
            <p className="mt-3 font-display text-2xl font-bold text-rose-950">University Gold Medals</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["MS (Obstetrics & Gynaecology)", "DGO"].map((m) => (
                <span key={m} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                  <Medal size={13} weight="fill" /> {m}
                </span>
              ))}
            </div>
          </div>

          {/* Best outgoing */}
          <div className={`${TILE} md:col-span-3 lg:col-span-4`}>
            <Trophy size={150} weight="light" aria-hidden className="pointer-events-none absolute -bottom-8 -right-4 -rotate-12 text-rose-950/60 transition-transform duration-500 group-hover:rotate-0" />
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 text-rose-950 shadow-[0_14px_28px_-10px_rgba(251,191,36,0.6)]">
              <Trophy size={28} weight="fill" />
            </span>
            <p className="mt-6 font-display text-2xl font-bold leading-tight text-rose-950">Best Outgoing Doctor</p>
            <p className="mt-2 text-sm leading-relaxed text-rose-950/60">
              Recognised during postgraduate training, in both MS &amp; DGO.
            </p>
          </div>

          {/* Years */}
          <div className={`${TILE} md:col-span-6 lg:col-span-3`}>
            <Star size={140} weight="light" aria-hidden className="pointer-events-none absolute -bottom-8 -right-4 rotate-12 text-rose-950/60" />
            <p className="font-display text-7xl font-bold leading-none text-rose-950">
              <CountUp value={20} suffix="+" />
            </p>
            <p className="mt-3 font-display text-xl font-bold text-rose-600">Years of Experience</p>
            <p className="mt-2 text-sm leading-relaxed text-rose-950/60">Across clinical practice and medical education.</p>
          </div>

          {/* Academic leadership ladder */}
          <div className={`${TILE} md:col-span-6 lg:col-span-7`}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xs">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                  <ChalkboardTeacher size={26} weight="light" />
                </span>
                <p className="mt-5 font-display text-2xl font-bold text-rose-950">Academic Leadership</p>
                <p className="mt-2 text-sm leading-relaxed text-rose-950/60">
                  Teaching and academic positions across leading medical institutions.
                </p>
              </div>
              <ol className="flex flex-1 items-end gap-2 sm:max-w-sm">
                {LADDER.map((step, i) => (
                  <li key={step} className="flex-1">
                    <span className="mb-2 block text-center text-[11px] font-semibold leading-tight text-rose-700">{step}</span>
                    <span
                      className="block rounded-t-xl bg-gradient-to-t from-rose-700 to-rose-400 shadow-[0_10px_24px_-10px_rgba(244,63,94,0.6)]"
                      style={{ height: `${3.5 + i * 2.25}rem` }}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Publications */}
          <div className={`${TILE} md:col-span-6 lg:col-span-5`}>
            <Globe size={150} weight="light" aria-hidden className="pointer-events-none absolute -bottom-10 -right-6 text-sky-100 transition-transform duration-700 group-hover:rotate-12" />
            <span className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Globe size={26} weight="light" />
            </span>
            <p className="mt-5 font-display text-2xl font-bold text-rose-950">International Publications</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-rose-950/60">
              Multiple international publications in Obstetrics and Gynaecology.
            </p>
          </div>

          {/* Research */}
          <div className={`${TILE} md:col-span-6 lg:col-span-7`}>
            <Quotes size={120} weight="fill" aria-hidden className="pointer-events-none absolute -right-2 -top-2 text-rose-950/60" />
            <p className={EYEBROW}>Research &amp; publications</p>
            <p className="mt-3 font-display text-3xl font-bold leading-tight text-rose-950 md:text-4xl">
              Research. Learn. Improve. <span className="text-rose-500">Care better.</span>
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-rose-950/60">
              Her involvement in research and academic medicine reflects an
              ongoing commitment to evidence-based clinical practice and
              continuous professional learning.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm font-bold text-rose-950">
              <BookOpen size={18} weight="light" className="text-rose-500" /> Areas of research interest
            </p>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {RESEARCH.map((r, i) => (
                <li key={r} className="flex items-center gap-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-950">
                  <span className="font-display text-xs font-bold text-rose-500">{String(i + 1).padStart(2, "0")}</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>

          {/* Memberships */}
          <div className={`${TILE} md:col-span-6 lg:col-span-5`}>
            <p className={EYEBROW}>Professional memberships</p>
            <p className="mt-3 font-display text-2xl font-bold text-rose-950">Connected to the medical community</p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MEMBERSHIPS.map(({ code, text }) => (
                <li key={code} className="rounded-2xl bg-rose-50/70 p-4 ring-1 ring-rose-100">
                  <span className="flex items-center justify-between">
                    <span className={`font-display text-xl font-bold ${GOLD}`}>{code}</span>
                    <SealCheck size={18} weight="fill" className="text-sky-500" />
                  </span>
                  <span className="mt-1.5 block text-xs leading-snug text-rose-950/60">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
