import Image from "next/image";
import {
  ChatsCircleIcon as ChatsCircle,
  HandHeartIcon as HandHeart,
  HeartIcon as Heart,
  UsersThreeIcon as UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

const STEPS = [
  { icon: ChatsCircle, title: "Listen carefully", text: "Understanding each woman's unique needs." },
  { icon: HandHeart, title: "Explain clearly", text: "Helping you make informed decisions." },
  { icon: UsersThree, title: "Care continuously", text: "Support at every stage of life." },
];

export function Approach() {
  return (
    <section className="py-8 lg:py-12">
      <Reveal className="mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100/70 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative min-h-[18rem] lg:min-h-[28rem]">
            <Image
              src="/images/approach.jpeg"
              alt="Dr. Prema listening to a patient in a calm, softly lit consultation room"
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover object-[50%_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-rose-50/40" />
          </div>
          <div className="p-8 md:p-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 shadow-sm">
              <Heart size={14} weight="fill" className="text-rose-500" />
              Her approach
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
              Every woman&apos;s <span className="text-rose-600">story matters</span>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
              Dr. Prema believes every woman&apos;s healthcare journey is
              unique. Her approach is built on listening, clear communication
              and compassionate, evidence-based care.
            </p>
            <ul className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span className="flex size-14 items-center justify-center rounded-full bg-white text-rose-500 shadow-[0_10px_24px_-12px_rgba(244,63,94,0.5)] ring-4 ring-white/60">
                    <Icon size={26} weight="light" />
                  </span>
                  <p className="mt-3 font-display text-lg font-bold text-rose-950">{title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-rose-950/60">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
