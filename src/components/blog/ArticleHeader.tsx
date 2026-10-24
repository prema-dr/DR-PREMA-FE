import Link from "next/link";
import { ArrowLeftIcon as ArrowLeft, CalendarBlankIcon as CalendarBlank, ClockIcon as Clock, SealCheckIcon as SealCheck } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { ArticleCover } from "@/components/blog/ArticleHero";
import type { BlogPost } from "@/lib/site-api";

export function ArticleHeader({ post }: { post: BlogPost }) {
  return (
    <>
      <section className="relative -mt-36 overflow-hidden bg-gradient-to-b from-rose-100/70 via-rose-50 to-white pt-[112px] pb-40 sm:pt-[130px] md:-mt-40 lg:pt-[140px] lg:pb-52">
        <svg aria-hidden viewBox="0 0 800 800" className="pointer-events-none absolute -right-48 top-1/2 hidden size-[50rem] -translate-y-1/2 text-rose-300/40 lg:block">
          {[140, 220, 300, 380].map((r) => (
            <circle key={r} cx="400" cy="400" r={r} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray={r % 220 === 0 ? "2 9" : undefined} />
          ))}
        </svg>
        <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 size-[26rem] rounded-full bg-sky-100/70 blur-3xl" />

        <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-rose-950/60">
            <Link href="/blog" className="inline-flex items-center gap-1.5 font-semibold text-rose-700 transition-colors hover:text-rose-800">
              <ArrowLeft size={15} weight="bold" /> All articles
            </Link>
            <span aria-hidden>/</span>
            <span>{post.category}</span>
          </nav>

          <div className="mt-8 max-w-4xl">
            <span className="inline-flex rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 backdrop-blur-sm">
              {post.category}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-rose-950 md:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-rose-950/65 md:text-xl">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-400 font-display text-sm font-bold text-white ring-4 ring-white">
                  DP
                </span>
                <span>
                  <span className="flex items-center gap-1 text-sm font-bold text-rose-950">
                    Dr. Prema N. <SealCheck size={15} weight="fill" className="text-sky-500" />
                  </span>
                  <span className="block text-xs text-rose-950/60">Consultant Obstetrician &amp; Gynaecologist</span>
                </span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-rose-950/70 shadow-sm">
                <Clock size={16} className="text-rose-500" /> {post.readTime}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-rose-950/70 shadow-sm">
                <CalendarBlank size={16} className="text-rose-500" /> Women&apos;s health
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal className="relative z-10 mx-auto -mt-28 max-w-[78rem] px-[22px] md:px-8 lg:-mt-36 lg:px-10">
        <ArticleCover src={post.image} alt={post.imageAlt} />
      </Reveal>
    </>
  );
}
