import Image from "next/image";
import {
  CertificateIcon as Certificate,
  ChatsCircleIcon as ChatsCircle,
  HeartStraightIcon as HeartStraight,
  ShieldCheckIcon as ShieldCheck,
  UsersThreeIcon as UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

const PILLARS = [
  { icon: HeartStraight, title: "Patient-centred care", text: "Personalised care for every woman." },
  { icon: ShieldCheck, title: "Clinical precision & safety", text: "Evidence-based practice, guided by experience." },
  { icon: ChatsCircle, title: "Clear communication", text: "Understanding your needs and concerns." },
  { icon: UsersThree, title: "Continuity of care", text: "Support from adolescence to motherhood and beyond." },
];

export function MeetDoctor() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[28rem] rounded-full bg-pink-100/50 blur-3xl" />
      <Reveal className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-14 px-[22px] md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-10">
        <div className="relative mx-auto hidden w-full max-w-[32rem] pb-6 lg:mx-0 lg:block">
          <div className="relative aspect-[4/5]">
            <Image
              src="/images/2.png"
              alt="Dr. Prema N., Consultant Obstetrician and Gynaecologist"
              fill
              sizes="512px"
              className="object-contain object-bottom"
            />
          </div>
          <div className="absolute -bottom-2 right-0 flex max-w-[15rem] items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_18px_40px_-18px_rgba(190,24,93,0.4)] backdrop-blur-md sm:-right-4">
            <Certificate size={30} weight="light" className="shrink-0 text-rose-500" />
            <span className="text-sm font-semibold leading-snug text-rose-950">
              Practising at Kovai Medical Center &amp; Hospital
            </span>
          </div>
        </div>

        <div>
          <span className="inline-flex rounded-full bg-rose-100/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
            Meet Dr. Prema
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            Experienced hands. Evidence-based care.{" "}
            <span className="text-rose-600">A woman-centred approach.</span>
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-[17px] leading-relaxed text-rose-950/65">
            <p>
              Dr. Prema N. is a Consultant Obstetrician and Gynaecologist with
              over two decades of experience in women&apos;s healthcare,
              combining clinical practice, medical education and research.
            </p>
            <p>
              Her special interests include high-risk obstetrics, VBAC, natural
              and bio-mimic birthing, No Scar Vaginal Hysterectomy (NOVA) and
              advanced laparoscopic procedures.
            </p>
            <p>
              Practising at Kovai Medical Center &amp; Hospital, Coimbatore, she
              offers clear communication and personalised, evidence-based care
              for every woman&apos;s unique needs.
            </p>
          </div>

          <ul className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(159,18,57,0.3)] transition-transform duration-300 hover:-translate-y-1">
                <span className="flex size-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <Icon size={22} weight="light" />
                </span>
                <p className="mt-3 text-sm font-bold leading-tight text-rose-950">{title}</p>
                <p className="mt-1 text-xs leading-snug text-rose-950/60">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
