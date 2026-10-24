import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon as ArrowRight, ClockIcon as Clock, SparkleIcon as Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import type { BlogPost } from "@/lib/site-api";

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Reveal className="relative z-10 mx-auto -mt-20 max-w-[90rem] px-[22px] md:px-8 lg:-mt-24 lg:px-10">
      <Link href={`/blog/${post.slug}`} className="group relative block overflow-hidden rounded-[2.5rem] shadow-[0_50px_90px_-40px_rgba(159,18,57,0.7)]">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[21/9]">
          <Image
            src="/images/blog-featured-article.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 1200px, 95vw"
            className="object-cover object-[75%_50%] transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-950/45 to-rose-900/10 lg:bg-gradient-to-r lg:from-rose-950/30 lg:via-transparent lg:to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-10 lg:max-w-2xl lg:justify-center lg:p-14">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white ring-1 ring-white/30 backdrop-blur-sm">
            <Sparkle size={13} weight="fill" className="text-amber-300" />
            Featured article
          </span>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-rose-200">{post.category}</p>
          <h2 className="mt-2 font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
            {post.title}
          </h2>
          <p className="mt-4 line-clamp-3 max-w-xl text-[15px] leading-relaxed text-rose-50/85 md:text-base">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-rose-700 transition-transform group-hover:-translate-y-0.5">
              Read article
              <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-rose-100">
              <Clock size={15} /> {post.readTime}
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
