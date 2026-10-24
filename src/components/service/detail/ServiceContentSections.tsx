import Image from "next/image";
import { CheckCircleIcon as CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import type { ServiceDetail } from "@/lib/site-api";
import type { ServiceBlock } from "@/lib/service-content";

const BLOB = "rounded-[44%_56%_48%_52%/40%_46%_54%_60%]";
const EYEBROW = "inline-flex rounded-full bg-rose-100/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700";

function Blocks({ blocks }: { blocks: ServiceBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.t === "p") {
          return (
            <p key={i} className="text-[17px] leading-relaxed text-rose-950/70">
              {block.text}
            </p>
          );
        }
        if (block.t === "ul") {
          return (
            <ul key={i} className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-rose-950/75">
                  <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-rose-400" />
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <dl key={i} className="grid gap-3 sm:grid-cols-2">
            {block.items.map((item, n) => (
              <div key={item.label} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-white p-5 ring-1 ring-rose-100">
                <span aria-hidden className="pointer-events-none absolute -right-1 -top-3 font-display text-6xl font-bold text-rose-100/80">
                  {n + 1}
                </span>
                <dt className="relative font-display text-base font-bold text-rose-950">{item.label}</dt>
                <dd className="relative mt-1.5 text-sm leading-relaxed text-rose-950/65">{item.text}</dd>
              </div>
            ))}
          </dl>
        );
      })}
    </div>
  );
}

export function ServiceWhatIs({ service }: { service: ServiceDetail }) {
  const [intro] = service.sections;
  if (!intro) return null;
  return (
    <section className="relative overflow-hidden py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[28rem] rounded-full bg-pink-100/50 blur-3xl" />
      <Reveal className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-14 px-[22px] md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
        <div className="relative mx-auto w-full max-w-[30rem] pb-4 lg:mx-0">
          <div aria-hidden className={`absolute inset-x-0 top-2 bottom-6 rotate-3 scale-[1.04] border-2 border-rose-200/80 bg-gradient-to-br from-rose-100/60 to-transparent ${BLOB}`} />
          <div className={`relative aspect-[1/1.05] overflow-hidden shadow-[0_40px_70px_-30px_rgba(190,24,93,0.45)] ring-8 ring-white/70 ${BLOB}`}>
            <Image src={service.image} alt="" fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
          </div>
        </div>
        <div>
          <span className={EYEBROW}>About this care</span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            {intro.heading.startsWith("What") ? intro.heading : `What is ${service.name}?`}
          </h2>
          <div className="mt-6">
            <Blocks blocks={intro.blocks} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function ServiceDetails({ service }: { service: ServiceDetail }) {
  const rest = service.sections.slice(1).filter((s) => s.blocks.length > 0);
  if (rest.length === 0) return null;
  return (
    <section className="bg-gradient-to-b from-white via-rose-50/50 to-white py-20 lg:py-24">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-[22px] md:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16 lg:px-10">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <span className={EYEBROW}>In detail</span>
          <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-4xl">
            Everything you need to know about <span className="text-rose-600">{service.name}</span>
          </h2>
          <ol className="mt-7 hidden space-y-1 border-l-2 border-rose-100 lg:block">
            {rest.map((s, i) => (
              <li key={s.heading + i}>
                <a
                  href={`#detail-${i}`}
                  className="-ml-0.5 flex items-start gap-3 border-l-2 border-transparent py-2 pl-4 text-sm font-medium leading-snug text-rose-950/65 transition-colors hover:border-rose-500 hover:text-rose-700"
                >
                  <span className="font-display text-xs font-bold text-rose-400">{String(i + 1).padStart(2, "0")}</span>
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="space-y-6">
          {rest.map((section, i) => (
            <Reveal key={section.heading + i}>
              <article id={`detail-${i}`} className="scroll-mt-32 rounded-3xl border border-rose-100 bg-white p-7 shadow-[0_14px_36px_-24px_rgba(159,18,57,0.35)] md:p-9">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-400 font-display text-lg font-bold text-white shadow-[0_10px_22px_-8px_rgba(244,63,94,0.7)]">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-2xl font-bold leading-snug text-rose-950">{section.heading}</h3>
                </div>
                <div className="mt-6">
                  <Blocks blocks={section.blocks} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
