import Link from "next/link";
import {
  ArrowRightIcon as ArrowRight,
  ArticleIcon as Article,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { BlogCard } from "@/components/shared/BlogCard";
import type { BlogPost } from "@/lib/site-api";

export function ServiceBlogs({ serviceName, posts }: { serviceName: string; posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/70 to-white py-16">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-8 size-[28rem] rounded-full bg-rose-100/40" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[26rem] rounded-full bg-sky-100/50" />
      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
            <span className="h-px w-8 bg-rose-600" />
            <Article size={16} weight="bold" />
            Blog
            <span className="h-px w-8 bg-rose-600" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-rose-950 md:text-5xl">
            Learn more about <span className="text-rose-600">{serviceName}</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-rose-950/65">
            Plain-language reading on the questions patients ask most.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(232,64,122,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-[0.98]"
          >
            Read the Blog
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
