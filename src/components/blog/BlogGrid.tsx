"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MagnifyingGlassIcon as MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { BlogCard } from "@/components/shared/BlogCard";
import { Pagination } from "@/components/shared/Pagination";
import type { BlogPost } from "@/lib/site-api";

const ALL = "All articles";
const PAGE_SIZE = 9;

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState(ALL);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [[ALL, posts.length] as const, ...counts.entries()];
  }, [posts]);

  const q = query.trim().toLowerCase();
  const items = posts.filter(
    (p) =>
      (active === ALL || p.category === active) &&
      (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)),
  );

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function goToPage(next: number) {
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-24 size-[28rem] rounded-full bg-rose-100/40" />
      <div ref={topRef} className="relative mx-auto max-w-[90rem] scroll-mt-24 px-[22px] md:px-8 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
              <span className="h-px w-8 bg-rose-600" />
              Latest reading
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-rose-950 md:text-5xl">
              Explore <span className="text-rose-600">every article</span>
            </h2>
          </div>
          <label className="relative block w-full lg:max-w-sm">
            <span className="sr-only">Search articles</span>
            <MagnifyingGlass size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search articles"
              className="w-full rounded-full border border-rose-200 bg-white py-3.5 pl-12 pr-5 text-sm text-rose-950 shadow-sm outline-none transition-all placeholder:text-rose-950/40 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)]"
            />
          </label>
        </div>

        <div role="tablist" aria-label="Filter articles by topic" className="mt-8 flex flex-wrap gap-2.5">
          {categories.map(([name, count]) => {
            const on = name === active;
            return (
              <button
                key={name}
                role="tab"
                aria-selected={on}
                type="button"
                onClick={() => {
                  setActive(name);
                  setPage(1);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-[0.97] ${
                  on
                    ? "border-rose-600 bg-rose-600 text-white shadow-[0_12px_24px_-12px_rgba(225,29,72,0.7)]"
                    : "border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50"
                }`}
              >
                {name}
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${on ? "bg-white/20" : "bg-rose-50 text-rose-500"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {items.length === 0 ? (
          <p className="mt-14 rounded-3xl border border-dashed border-rose-200 bg-rose-50/50 p-10 text-center text-rose-950/65">
            No articles match your search. Try a different word or topic.
          </p>
        ) : (
          <div key={`${active}-${q}-${current}`} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
        <Pagination page={current} totalPages={totalPages} onChange={goToPage} />
      </div>
    </section>
  );
}
