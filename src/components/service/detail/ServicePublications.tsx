import {
  ArrowUpRightIcon as ArrowUpRight,
  FileTextIcon as FileText,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import type { ServicePublication } from "@/lib/site-api";

export function ServicePublications({ items }: { items: ServicePublication[] }) {
  if (items.length === 0) return null;
  return (
    <section className="py-16 lg:py-20">
      <Reveal className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-[22px] md:px-8 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16 lg:px-10">
        <div>
          <span className="inline-flex rounded-full bg-rose-100/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
            Research
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            Publications &amp; <span className="text-rose-600">research</span>
          </h2>
          <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-rose-950/65">
            Evidence-based practice, backed by published work in Obstetrics and Gynaecology.
          </p>
        </div>

        <ul className="divide-y divide-rose-100 overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-[0_14px_36px_-24px_rgba(159,18,57,0.35)]">
          {items.map((pub, i) => (
            <li key={pub.url}>
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 transition-colors hover:bg-rose-50/60 md:p-6"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 transition-colors group-hover:bg-rose-600 group-hover:text-white">
                  <FileText size={24} weight="light" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-rose-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-0.5 block font-display text-lg font-bold leading-snug text-rose-950 group-hover:text-rose-700">
                    {pub.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-rose-950/60">{pub.description}</span>
                </span>
                <ArrowUpRight size={20} weight="bold" className="mt-1 shrink-0 text-rose-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-600" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
