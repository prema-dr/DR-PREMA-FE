import {
  ChatCircleTextIcon as ChatCircleText,
  EyeIcon as Eye,
  ListChecksIcon as ListChecks,
  CompassIcon as Compass,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

const STEPS = [
  { icon: ChatCircleText, title: "Share your concern", body: "Tell us what's on your mind. No detail is too small to raise." },
  { icon: Eye, title: "Discuss and examine", body: "A conversation first, then an exam only where it's needed." },
  { icon: ListChecks, title: "Understand your options", body: "Leave with a clear plan, explained without jargon." },
  { icon: Compass, title: "Follow up with confidence", body: "Ongoing support for as long as you need it." },
];

export function ProcessFlow() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-sky-50/60 to-white py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 size-[28rem] rounded-full bg-rose-100/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[28rem] rounded-full bg-sky-100/70 blur-3xl" />
      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 shadow-sm">
            Your first visit
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            What a visit <span className="text-rose-600">looks like</span>
          </h2>
        </div>

        <ol className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-4">
          <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-1 rounded-full bg-gradient-to-r from-rose-200 via-rose-400 to-rose-600 md:block" />
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="group relative text-center">
              <span aria-hidden className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 font-display text-[7.5rem] font-bold leading-none text-rose-100/80">
                {i + 1}
              </span>
              <span className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-white text-rose-600 shadow-[0_18px_34px_-14px_rgba(225,29,72,0.6)] ring-[6px] ring-rose-100 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:bg-rose-600 group-hover:text-white">
                <Icon size={34} weight="light" />
                <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white ring-2 ring-white">
                  {i + 1}
                </span>
              </span>
              <p className="relative mt-6 font-display text-xl font-bold text-rose-950">{title}</p>
              <p className="relative mx-auto mt-2 max-w-[15rem] text-sm leading-relaxed text-rose-950/60">{body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
