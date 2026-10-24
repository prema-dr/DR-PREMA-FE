import { ArticleIcon as Article, BookOpenTextIcon as BookOpenText } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import type { BlogPost } from "@/lib/site-api";

export function BlogHeader({ posts }: { posts: BlogPost[] }) {
  const topics = new Set(posts.map((p) => p.category)).size;
  return (
    <section className="relative -mt-36 overflow-hidden bg-gradient-to-b from-rose-100/70 via-rose-50 to-white pt-[112px] pb-28 sm:pt-[130px] md:-mt-40 lg:pt-[140px] lg:pb-36">
      <BookOpenText size={380} weight="light" aria-hidden className="pointer-events-none absolute -right-16 -top-8 rotate-12 text-rose-200/40" />
      <svg aria-hidden viewBox="0 0 800 800" className="pointer-events-none absolute -left-60 top-1/2 hidden size-[48rem] -translate-y-1/2 text-rose-300/40 lg:block">
        {[140, 220, 300, 380].map((r) => (
          <circle key={r} cx="400" cy="400" r={r} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray={r % 220 === 0 ? "2 9" : undefined} />
        ))}
      </svg>
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[26rem] rounded-full bg-sky-100/70 blur-3xl" />

      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] text-center md:px-8 lg:px-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 backdrop-blur-sm">
          <Article size={14} weight="fill" className="text-rose-500" />
          The Blog
        </span>
        <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-rose-950 md:text-5xl lg:text-6xl">
          Notes for the way you{" "}
          <span className="relative inline-block text-rose-600">
            live
            <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-rose-300">
              <path d="M2 8c60-8 140-8 296-2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-rose-950/65">
          Plain-language reading on gynaecology, pregnancy and women&apos;s
          health, written to answer the questions patients ask most.
        </p>
        <p className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-rose-950/70">
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">{posts.length} articles</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">{topics} topics</span>
        </p>
      </Reveal>
    </section>
  );
}
