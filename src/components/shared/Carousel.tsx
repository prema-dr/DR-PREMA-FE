"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import {
  CaretLeftIcon as CaretLeft,
  CaretRightIcon as CaretRight,
} from "@phosphor-icons/react/dist/ssr";

const AUTOPLAY_MS = 5000;
const SLIDE_MS = 1400;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function Carousel({
  items,
  itemClassName,
  label,
  centered = false,
}: {
  items: ReactNode[];
  /** Width / snap classes applied to each slide wrapper. */
  itemClassName: string;
  /** Used in the arrow and dot aria-labels, e.g. "testimonials". */
  label: string;
  /** Centre the track when every item fits without scrolling. */
  centered?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pages, setPages] = useState(items.length);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const frame = useRef(0);

  const step = useCallback(() => {
    const el = track.current;
    if (!el || el.children.length < 2) return el?.clientWidth ?? 0;
    return (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
  }, []);

  const measure = useCallback(() => {
    const el = track.current;
    const s = step();
    if (!el || !s) return;
    setPages(Math.max(1, Math.round((el.scrollWidth - el.clientWidth) / s) + 1));
    setActive(Math.round(el.scrollLeft / s));
  }, [step]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Slow eased slide; scroll-snap is switched off while animating so it can't fight the tween.
  const goTo = useCallback(
    (index: number) => {
      const el = track.current;
      if (!el) return;
      const target = index * step();
      cancelAnimationFrame(frame.current);
      if (reduce) {
        el.scrollTo({ left: target });
        return;
      }
      const from = el.scrollLeft;
      const start = performance.now();
      el.style.scrollSnapType = "none";
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SLIDE_MS);
        el.scrollLeft = from + (target - from) * easeInOutCubic(t);
        if (t < 1) {
          frame.current = requestAnimationFrame(tick);
        } else {
          el.style.scrollSnapType = "";
        }
      };
      frame.current = requestAnimationFrame(tick);
    },
    [reduce, step],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useEffect(() => {
    if (paused || reduce || pages <= 1) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      goTo(active >= pages - 1 ? 0 : active + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, pages, paused, reduce, goTo]);

  const scrollable = pages > 1;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={track}
        onScroll={measure}
        className={`flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          centered ? "mx-auto w-fit max-w-full" : ""
        }`}
      >
        {items.map((item, index) => (
          <div key={index} className={`shrink-0 snap-start ${itemClassName}`}>
            {item}
          </div>
        ))}
      </div>

      {scrollable && (
        <>
          <button
            type="button"
            aria-label={`Previous ${label}`}
            onClick={() => goTo(Math.max(0, active - 1))}
            disabled={active === 0}
            className="absolute left-0 top-1/2 hidden size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-rose-950 shadow-md transition-all hover:scale-105 disabled:opacity-40 md:flex"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            aria-label={`Next ${label}`}
            onClick={() => goTo(Math.min(pages - 1, active + 1))}
            disabled={active >= pages - 1}
            className="absolute right-0 top-1/2 hidden size-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-rose-950 shadow-md transition-all hover:scale-105 disabled:opacity-40 md:flex"
          >
            <CaretRight size={18} weight="bold" />
          </button>

          <div className="mt-2 flex items-center justify-center gap-2.5">
            {Array.from({ length: pages }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to ${label} ${index + 1}`}
                aria-current={index === active}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === active ? "w-6 bg-rose-600" : "w-1.5 bg-rose-950/15 hover:bg-rose-950/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
