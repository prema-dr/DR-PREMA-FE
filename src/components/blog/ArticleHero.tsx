"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/** Cover image with a gentle parallax. */
export function ArticleCover({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-rose-100 shadow-[0_50px_90px_-40px_rgba(159,18,57,0.6)] ring-8 ring-white sm:aspect-[16/8]"
    >
      <motion.div className="absolute -inset-y-10 inset-x-0" style={reduce ? undefined : { y }}>
        <Image src={src} alt={alt} fill priority sizes="(min-width: 1280px) 1150px, 95vw" className="object-cover" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rose-950/25 via-transparent to-white/5" />
    </div>
  );
}
