import Link from "next/link";
import Image from "next/image";
import { ClockIcon as Clock } from "@phosphor-icons/react/dist/ssr";
import type { BlogPost } from "@/lib/site-api";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_-12px_rgba(159,18,57,0.18)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-14px_rgba(159,18,57,0.28)]">
        <div className="relative h-48 overflow-hidden bg-rose-100">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <span className="w-fit rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
            {post.category}
          </span>
          <p className="mt-4 font-display text-lg font-semibold leading-snug text-rose-950 transition-colors group-hover:text-rose-700">
            {post.title}
          </p>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-rose-950/65">
            {post.excerpt}
          </p>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-rose-950/55">
            <Clock size={14} weight="regular" />
            {post.readTime}
          </p>
        </div>
      </article>
    </Link>
  );
}
