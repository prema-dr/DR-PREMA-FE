import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";

export function ContactBanner({
  title,
  body,
  tone = "rose",
}: {
  title: string;
  body: string;
  tone?: "rose" | "emerald";
}) {
  const bg = tone === "rose" ? "bg-rose-700" : "bg-emerald-700";
  const linkColor = tone === "rose" ? "text-rose-700" : "text-emerald-700";
  const bodyColor = tone === "rose" ? "text-rose-50/85" : "text-emerald-50/85";

  return (
    <Reveal className="mx-auto mt-28 max-w-[90rem] px-[22px] md:px-8 lg:px-10">
      <div className={`relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16 ${bg}`}>
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <h2 className="relative font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        <p className={`relative mx-auto mt-4 max-w-md ${bodyColor}`}>{body}</p>
        <Link
          href="/contact-us"
          className={`relative mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] ${linkColor}`}
        >
          Get in Touch
        </Link>
      </div>
    </Reveal>
  );
}
