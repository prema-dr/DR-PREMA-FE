"use client";

import { motion, useReducedMotion } from "motion/react";

export function Ambient({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2.5rem] ${className ?? ""}`}
    >
      <motion.div
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl"
        animate={reduce ? undefined : { y: [0, 24, 0], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-emerald-200/35 blur-3xl"
        animate={reduce ? undefined : { y: [0, -24, 0], x: [0, -14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
