"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ImagesIcon as Images,
  ArrowLeftIcon as ArrowLeft,
  ArrowRightIcon as ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import type { ServiceGalleryImage } from "@/lib/site-api";

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );
}

export function ServiceGallery({ serviceName, images }: { serviceName: string; images: ServiceGalleryImage[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  if (images.length === 0) return null;

  const count = images.length;
  // Sliding only makes sense once there are more images than the three visible cards.
  const canSlide = count > 3;
  const wrap = (i: number) => (i + count) % count;
  const prev = () => setActive((i) => wrap(i - 1));
  const next = () => setActive((i) => wrap(i + 1));

  // Offsets rendered around the active card; the outer two (±2) stay clipped and slide in on navigation.
  const offsets = canSlide ? [-2, -1, 0, 1, 2] : count === 3 ? [-1, 0, 1] : count === 2 ? [0, 1] : [0];

  return (
    <section className="py-16 lg:py-20">
      <Reveal className="mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
            <span className="h-px w-8 bg-rose-600" />
            <Images size={16} weight="bold" />
            Gallery
            <span className="h-px w-8 bg-rose-600" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-rose-950 md:text-5xl">
            A look at our <span className="text-rose-600">{serviceName}</span> care
          </h2>
        </div>

        <ul className="mt-12 flex items-center justify-center gap-4 overflow-hidden py-8 md:gap-8">
          {offsets.map((offset) => {
            const index = wrap(active + offset);
            const image = images[index];
            const isCenter = offset === 0;
            // With exactly 4 images the -2 and +2 slots hold the same image, so key them apart.
            const key = count === 4 && offset === 2 ? `${index}-b` : String(index);
            const clickable = canSlide && !isCenter && Math.abs(offset) === 1;

            return (
              <motion.li
                key={key}
                initial={false}
                animate={{
                  width: isDesktop ? (isCenter ? "44%" : "27%") : "100%",
                  height: isDesktop ? (isCenter ? "30rem" : "22rem") : "22rem",
                }}
                transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={`shrink-0 ${isDesktop || isCenter ? "" : "pointer-events-none"}`}
                aria-hidden={Math.abs(offset) === 2 || undefined}
              >
                <button
                  type="button"
                  onClick={clickable ? (offset < 0 ? prev : next) : undefined}
                  disabled={!clickable}
                  aria-label={clickable ? `Show image: ${image.alt}` : image.alt}
                  className={`group relative block size-full overflow-hidden rounded-3xl bg-rose-50 text-left shadow-[0_24px_50px_-28px_rgba(159,18,57,0.5)] ${
                    clickable ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={isCenter ? "(min-width: 768px) 44vw, 100vw" : "27vw"}
                    className={`object-cover transition-transform duration-500 ${clickable ? "group-hover:scale-105" : ""}`}
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-rose-950/70 via-transparent to-rose-950/10" />
                  <span className="absolute left-5 top-5 rounded-full bg-white/25 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30 backdrop-blur-md">
                    {serviceName}
                  </span>
                  <span
                    className={`absolute bottom-5 left-6 right-6 font-display font-bold leading-tight text-white ${
                      isCenter ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                    }`}
                  >
                    {image.alt}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            disabled={!canSlide}
            aria-label="Previous image"
            className="flex size-14 items-center justify-center rounded-xl border border-rose-300 bg-white text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-rose-100 disabled:text-rose-200 disabled:hover:bg-white"
          >
            <ArrowLeft size={22} weight="bold" />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canSlide}
            aria-label="Next image"
            className="flex size-14 items-center justify-center rounded-xl bg-rose-600 text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-200 disabled:hover:bg-rose-200"
          >
            <ArrowRight size={22} weight="bold" />
          </button>
        </div>
      </Reveal>
    </section>
  );
}
