import {
  ChalkboardTeacherIcon as ChalkboardTeacher,
  MapPinIcon as MapPin,
  MicrophoneStageIcon as MicrophoneStage,
  TrophyIcon as Trophy,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { getAwards, getGuestLectures } from "@/lib/site-api";

const GOLD = "bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent";

/** Editorial agenda: a big year, a hairline spine, the talk title set large, event and place beneath. */
function Lectures({ items, wide }: { items: Awaited<ReturnType<typeof getGuestLectures>>; wide: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-rose-950 text-amber-300">
          <MicrophoneStage size={20} weight="fill" />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600">On stage</p>
      </div>
      <h3 className="mt-4 font-display text-4xl font-bold leading-tight text-rose-950 md:text-5xl">
        Guest <span className="italic text-rose-600">Lectures</span>
      </h3>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-rose-950/60">
        Invited talks and sessions shared with fellow clinicians and students.
      </p>

      <ol
        className={
          wide
            ? "mt-10 grid gap-x-12 gap-y-12 md:grid-cols-2 xl:grid-cols-3"
            : "relative mt-10 ml-3 border-l border-rose-200"
        }
      >
        {items.map((l, i) => (
          <li
            key={l.id}
            className={
              wide
                ? "group relative border-t-2 border-rose-200 pt-6 transition-colors duration-300 hover:border-rose-500"
                : "group relative pb-10 pl-8 last:pb-0 md:pl-10"
            }
          >
            {!wide && (
              <span
                aria-hidden
                className="absolute -left-[7px] top-2 size-3.5 rounded-full border-2 border-rose-500 bg-white transition-all duration-300 group-hover:scale-125 group-hover:bg-rose-500"
              />
            )}
            <div className={wide ? "flex flex-col-reverse gap-5" : "flex flex-col gap-5 xl:flex-row xl:items-start"}>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-sm font-bold tabular-nums text-rose-300">{String(i + 1).padStart(2, "0")}</span>
                  {l.year && (
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">{l.year}</span>
                  )}
                </div>
                <h4 className="mt-1.5 font-display text-2xl font-bold leading-snug text-rose-950 transition-colors duration-300 group-hover:text-rose-600">
                  {l.title}
                </h4>
                <p className="mt-2 text-[15px] font-medium text-rose-950/75">{l.event}</p>
                {l.location && (
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-rose-950/50">
                    <MapPin size={14} weight="fill" className="text-rose-400" />
                    {l.location}
                  </p>
                )}
                {l.description && <p className="mt-3 max-w-xl text-sm leading-relaxed text-rose-950/60">{l.description}</p>}
              </div>
              {l.imageUrl && (
                <div className={`w-full shrink-0 overflow-hidden rounded-2xl shadow-[0_24px_44px_-22px_rgba(159,18,57,0.55)] ring-4 ring-white ${wide ? "" : "sm:max-w-md xl:w-64 xl:max-w-none"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.imageUrl}
                    alt={l.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Dark, gold-trimmed panel so honours feel distinct from the light lecture agenda. */
function Awards({ items, wide }: { items: Awaited<ReturnType<typeof getAwards>>; wide: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-950 via-[#4a0d20] to-rose-900 p-8 shadow-[0_40px_70px_-35px_rgba(92,15,35,0.8)] md:p-10">
      <Trophy size={260} weight="thin" aria-hidden className="pointer-events-none absolute -bottom-16 -right-12 rotate-12 text-amber-300/10" />
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-rose-500/20 blur-3xl" />

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300/90">Honours</p>
        <h3 className="mt-3 font-display text-4xl font-bold leading-tight text-white md:text-5xl">
          Awards <span className={`italic ${GOLD}`}>&amp; Recognition</span>
        </h3>

        <ul className={wide ? "mt-8 grid gap-x-12 gap-y-6 md:grid-cols-2 xl:grid-cols-3" : "mt-8 divide-y divide-white/10"}>
          {items.map((a) => (
            <li key={a.id} className={`group flex items-start gap-4 ${wide ? "" : "py-5 first:pt-0 last:pb-0"}`}>
              {a.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.imageUrl} alt={a.title} loading="lazy" className="size-24 shrink-0 rounded-2xl object-cover ring-2 ring-amber-300/70" />
              ) : (
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-rose-950 shadow-[0_10px_24px_-8px_rgba(251,191,36,0.6)] transition-transform duration-300 group-hover:scale-110">
                  <Trophy size={22} weight="fill" />
                </span>
              )}
              <div className="min-w-0">
                {a.year && <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{a.year}</p>}
                <p className="mt-0.5 font-display text-xl font-bold leading-snug text-white">{a.title}</p>
                {a.awardedBy && <p className="mt-1 text-sm font-medium text-white/70">{a.awardedBy}</p>}
                {a.description && <p className="mt-2 text-sm leading-relaxed text-white/55">{a.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function LecturesAndAwards() {
  const [lectures, awards] = await Promise.all([getGuestLectures(), getAwards()]);
  if (lectures.length === 0 && awards.length === 0) return null;

  const both = lectures.length > 0 && awards.length > 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/50 to-white py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-20 size-[30rem] rounded-full bg-rose-100/60 blur-3xl" />
      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 shadow-sm ring-1 ring-rose-100">
            <ChalkboardTeacher size={14} weight="fill" className="text-rose-500" />
            Beyond the clinic
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-rose-950 md:text-5xl lg:text-6xl">
            Teaching, speaking <span className="text-rose-600">&amp; honours</span>
          </h2>
        </div>

        <div className={`mt-16 grid items-start gap-14 ${both ? "lg:grid-cols-[1.15fr_1fr] lg:gap-16" : ""}`}>
          {lectures.length > 0 && <Lectures items={lectures} wide={!both} />}
          {awards.length > 0 && <Awards items={awards} wide={!both} />}
        </div>
      </Reveal>
    </section>
  );
}
