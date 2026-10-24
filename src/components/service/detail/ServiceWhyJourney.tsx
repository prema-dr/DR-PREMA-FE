import {
  UserCircleIcon as UserCircle,
  BookOpenIcon as BookOpen,
  HeartIcon as Heart,
  ChatsCircleIcon as ChatsCircle,
  MagnifyingGlassIcon as MagnifyingGlass,
  ClipboardTextIcon as ClipboardText,
  StethoscopeIcon as Stethoscope,
  HeartHalfIcon as HeartHalf,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

const WHY = [
  { icon: UserCircle, title: "Experienced Gynaecologist", body: "Over two decades of clinical, academic and surgical experience." },
  { icon: BookOpen, title: "Evidence-Based Approach", body: "Recommendations grounded in current research and clinical guidelines." },
  { icon: Heart, title: "Personalised Care", body: "Every plan is shaped around your health, history and preferences." },
  { icon: ChatsCircle, title: "Clear Communication", body: "Plain-language explanations so you can make informed decisions." },
];

const STEPS = [
  { icon: ChatsCircle, title: "Consultation", body: "A detailed discussion of your history, symptoms and goals." },
  { icon: MagnifyingGlass, title: "Evaluation", body: "Examination and investigations, only as needed." },
  { icon: ClipboardText, title: "Personalised Plan", body: "Options explained clearly, with benefits and risks." },
  { icon: Stethoscope, title: "Treatment & Care", body: "Safe, closely monitored care at every step." },
  { icon: HeartHalf, title: "Follow-up Support", body: "Ongoing review and guidance after treatment." },
];

export function ServiceWhy({ serviceName }: { serviceName: string }) {
  return (
    <section className="py-16 lg:py-20">
      <Reveal className="mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-rose-100/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
            Why choose Dr. Prema
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            Why choose Dr. Prema for <span className="text-rose-600">{serviceName}</span>?
          </h2>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-rose-100 bg-white p-7 shadow-[0_14px_36px_-24px_rgba(159,18,57,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-200 hover:shadow-[0_28px_48px_-24px_rgba(159,18,57,0.45)]"
            >
              <span aria-hidden className="pointer-events-none absolute -right-2 -top-5 font-display text-8xl font-bold text-rose-50 transition-colors group-hover:text-rose-100">
                {i + 1}
              </span>
              <span className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-[0_12px_24px_-10px_rgba(244,63,94,0.7)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Icon size={28} weight="light" />
              </span>
              <p className="relative mt-6 font-display text-xl font-bold leading-tight text-rose-950">{title}</p>
              <p className="relative mt-2.5 text-[15px] leading-relaxed text-rose-950/60">{body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function ServiceJourney({ serviceName }: { serviceName: string }) {
  return (
    <section className="relative mt-16 overflow-hidden bg-gradient-to-b from-rose-50 via-sky-50/60 to-white py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 size-[28rem] rounded-full bg-rose-100/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[28rem] rounded-full bg-sky-100/70 blur-3xl" />
      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 shadow-sm">
            Your care journey
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            How we support your <span className="text-rose-600">{serviceName}</span> journey
          </h2>
        </div>

        <ol className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-4">
          <span aria-hidden className="absolute left-[10%] right-[10%] top-10 hidden h-1 rounded-full bg-gradient-to-r from-rose-200 via-rose-400 to-rose-600 md:block" />
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
