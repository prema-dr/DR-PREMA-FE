"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export function CountUp({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 90 });

  useEffect(() => {
    if (!isInView || reduce) return;
    // Server/initial markup shows the real value (so it is never stuck at "0+"); restart from 0 only once visible.
    if (ref.current) ref.current.textContent = "0" + suffix;
    motionValue.set(value);
  }, [isInView, value, suffix, reduce, motionValue]);

  useEffect(() => {
    if (reduce) return;
    return springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString() + suffix;
    });
  }, [springValue, suffix, reduce]);

  return <span ref={ref}>{value.toLocaleString() + suffix}</span>;
}
