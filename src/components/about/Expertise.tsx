import type { ComponentType } from "react";
import {
  BabyIcon as Baby,
  FlowerLotusIcon as FlowerLotus,
  HeartbeatIcon as Heartbeat,
  LeafIcon as Leaf,
  CrosshairIcon as Scalpel,
  SparkleIcon as Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

type IconType = ComponentType<{ size?: number; weight?: "light" | "regular" | "fill"; className?: string }>;

const AREAS: { title: string; text: string; icon: IconType; featured?: boolean }[] = [
  {
    title: "No Scar Vaginal Hysterectomy — NOVA",
    text: "Specialised experience in vaginal hysterectomy techniques designed to avoid an abdominal surgical scar in appropriately selected cases.",
    icon: Sparkle,
    featured: true,
  },
  {
    title: "Advanced Laparoscopic Gynaecological Surgery",
    text: "Experience in minimally invasive approaches for selected gynaecological conditions.",
    icon: Scalpel,
  },
  {
    title: "Natural & Bio-Mimic Birthing",
    text: "Clinical interest in supporting physiological approaches to childbirth when medically appropriate.",
    icon: Leaf,
  },
  {
    title: "VBAC",
    text: "Experience in counselling and managing eligible women considering Vaginal Birth After Caesarean.",
    icon: Baby,
  },
  {
    title: "High-Risk Obstetrics",
    text: "Comprehensive clinical management of pregnancies requiring closer monitoring and specialised obstetric care.",
    icon: Heartbeat,
  },
  {
    title: "Reproductive & Women's Health",
    text: "Care covering a broad range of reproductive and gynaecological concerns across different stages of a woman's life.",
    icon: FlowerLotus,
  },
];

export function Expertise() {
  return (
    <section className="py-20 lg:py-24">
      <Reveal className="mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-rose-100/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
            Key areas of expertise
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            Specialised care across Obstetrics &amp;{" "}
            <span className="text-rose-600">Gynaecology</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-rose-950/65">
            Comprehensive care for a wide range of women&apos;s health needs,
            with a focus on safety, evidence-based practice and individualised
            treatment.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {AREAS.map(({ title, text, icon: Icon, featured }) => (
            <li
              key={title}
              className={`group relative overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 ${
                featured
                  ? "bg-gradient-to-br from-rose-600 to-rose-800 text-white shadow-[0_30px_60px_-28px_rgba(159,18,57,0.65)] lg:row-span-1"
                  : "border border-rose-100 bg-white shadow-[0_14px_36px_-22px_rgba(159,18,57,0.35)] hover:shadow-[0_26px_44px_-22px_rgba(159,18,57,0.4)]"
              }`}
            >
              <Icon
                size={120}
                weight="light"
                aria-hidden
                className={`pointer-events-none absolute -bottom-8 -right-6 -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110 ${
                  featured ? "text-white/10" : "text-rose-50"
                }`}
              />
              <span
                className={`relative flex size-14 items-center justify-center rounded-2xl ${
                  featured
                    ? "bg-white/15 text-white ring-1 ring-white/30"
                    : "bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-[0_10px_22px_-8px_rgba(244,63,94,0.7)]"
                }`}
              >
                <Icon size={28} weight="light" />
              </span>
              <h3 className={`relative mt-5 font-display text-xl font-bold leading-snug ${featured ? "text-white" : "text-rose-950"}`}>
                {title}
              </h3>
              <p className={`relative mt-2.5 text-[15px] leading-relaxed ${featured ? "text-rose-50/85" : "text-rose-950/60"}`}>
                {text}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
