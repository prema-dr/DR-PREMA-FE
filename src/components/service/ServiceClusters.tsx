import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon as ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { ServiceIcon } from "@/lib/service-icons";
import type { Service } from "@/lib/site-api";

const GROUPS: { eyebrow: string; title: string; text: string; slugs: string[] }[] = [
  {
    eyebrow: "Pregnancy & birth",
    title: "Supporting you from labour to recovery",
    text: "Safe, respectful maternity care, whatever kind of birth is right for you.",
    slugs: [
      "normal-delivery",
      "natural-birthing",
      "waterbirthing",
      "hydrotherapy-during-labour",
      "labour-pain-relief",
      "vbac",
      "high-risk-pregnancy-care",
      "postpartum-care",
    ],
  },
  {
    eyebrow: "Gynaecology & fertility",
    title: "Clear answers for every stage of womanhood",
    text: "Careful evaluation and treatment, from hormonal health to advanced surgery.",
    slugs: [
      "no-scar-hysterectomy",
      "pcos",
      "fertility-treatment",
      "uterine-fibroids",
      "tubal-recanalisation",
      "bleeding-menses-problems",
    ],
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Reveal delay={(index % 3) * 0.06} className="h-full">
      <Link
        href={`/service/${service.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-[0_14px_36px_-24px_rgba(159,18,57,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-200 hover:shadow-[0_30px_50px_-24px_rgba(159,18,57,0.45)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-rose-100">
          <Image
            src={service.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, (min-width: 768px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-950/35 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-display text-xs font-bold text-rose-600 backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="relative flex flex-1 flex-col px-6 pb-6 pt-9">
          <span className="absolute -top-7 left-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-[0_12px_24px_-8px_rgba(244,63,94,0.7)] ring-4 ring-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
            <ServiceIcon iconKey={service.iconKey} size={28} weight="light" />
          </span>
          <h3 className="font-display text-xl font-bold leading-snug text-rose-950 transition-colors group-hover:text-rose-700">
            {service.name}
          </h3>
          <p className="mt-2 flex-1 text-[15px] leading-relaxed text-rose-950/60">{service.summary}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600">
            Learn more
            <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function ServiceClusters({ services }: { services: Service[] }) {
  const bySlug = new Map(services.map((s) => [s.slug, s]));
  const grouped = new Set(GROUPS.flatMap((g) => g.slugs));
  const others = services.filter((s) => !grouped.has(s.slug));
  const groups = [
    ...GROUPS.map((g) => ({ ...g, items: g.slugs.map((s) => bySlug.get(s)).filter((s): s is Service => !!s) })),
    ...(others.length
      ? [{ eyebrow: "More care", title: "Additional services", text: "", slugs: [], items: others }]
      : []),
  ];

  return (
    <section id="all-services" className="scroll-mt-32 py-20 lg:py-24">
      <div className="mx-auto max-w-[90rem] space-y-20 px-[22px] md:px-8 lg:space-y-28 lg:px-10">
        {groups.map((group) => (
          <div key={group.eyebrow}>
            <Reveal className="mb-12 max-w-2xl">
              <span className="inline-flex rounded-full bg-rose-100/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
                {group.eyebrow}
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
                {group.title}
              </h2>
              {group.text && <p className="mt-4 text-[17px] leading-relaxed text-rose-950/65">{group.text}</p>}
            </Reveal>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((service, i) => (
                <ServiceCard key={service.slug} service={service} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
