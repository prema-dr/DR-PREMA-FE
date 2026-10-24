import Image from "next/image";
import {
  ChatCircleDotsIcon as ChatCircleDots,
  EnvelopeSimpleIcon as EnvelopeSimple,
  HeartStraightIcon as HeartStraight,
  PhoneCallIcon as PhoneCall,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

export function ContactHero() {
  return (
    <section className="relative -mt-36 overflow-hidden bg-gradient-to-b from-rose-100/70 via-rose-50 to-white pt-[112px] pb-36 sm:pt-[130px] md:-mt-40 lg:pt-[140px] lg:pb-44">
      <div aria-hidden className="pointer-events-none absolute -left-32 bottom-10 size-[26rem] rounded-full bg-sky-100/70 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-1/3 -top-24 size-[22rem] rounded-full bg-pink-200/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-14 px-[22px] md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 backdrop-blur-sm">
            <HeartStraight size={14} weight="fill" className="text-rose-500" />
            Contact us
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.06] tracking-tight text-rose-950 md:text-5xl lg:text-6xl">
            We&apos;re here to{" "}
            <span className="relative inline-block text-rose-600">
              listen
              <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-rose-300">
                <path d="M2 8c60-8 140-8 296-2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
            , whenever you&apos;re ready to talk
          </h1>
          <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
            Have a question before your visit, or about a service you&apos;re
            considering? Send us a note. For scheduling, please call the
            clinic directly.
          </p>
        </Reveal>

        {/* Visual */}
        <Reveal delay={0.1} className="relative mx-auto aspect-square w-full max-w-[26rem] lg:max-w-[30rem]">
          <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 h-full w-full scale-[1.18] text-rose-300/60">
            <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 9" />
            <circle cx="200" cy="200" r="195" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
          <div className="absolute inset-[8%] overflow-hidden rounded-full shadow-[0_50px_80px_-35px_rgba(190,24,93,0.55)] ring-8 ring-white/80">
            <Image src="/images/consultation-room.jpg" alt="A calm consultation room" fill priority sizes="(min-width: 1024px) 480px, 80vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-200/25 via-transparent to-white/10" />
          </div>
          {[
            { icon: PhoneCall, label: "Call the clinic", pos: "left-0 top-[14%] sm:-left-6", anim: "6s" },
            { icon: ChatCircleDots, label: "WhatsApp us", pos: "right-0 top-[42%] sm:-right-6", anim: "7s" },
            { icon: EnvelopeSimple, label: "Send a message", pos: "bottom-[8%] left-[6%]", anim: "8s" },
          ].map(({ icon: Icon, label, pos, anim }) => (
            <div
              key={label}
              style={{ animationDuration: anim }}
              className={`absolute z-10 flex animate-[float-y_6s_ease-in-out_infinite] items-center gap-3 rounded-2xl border border-white bg-white/90 py-2.5 pl-2.5 pr-4 shadow-[0_18px_40px_-18px_rgba(190,24,93,0.4)] backdrop-blur-md motion-reduce:animate-none ${pos}`}
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 text-white">
                <Icon size={20} weight="light" />
              </span>
              <span className="text-sm font-bold text-rose-950">{label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
