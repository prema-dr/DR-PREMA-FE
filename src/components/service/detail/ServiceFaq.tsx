"use client";

import { useState } from "react";
import { MinusIcon as Minus, PlusIcon as Plus } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

export function ServiceFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (faqs.length === 0) return null;

  return (
    <section className="bg-rose-50/60 py-20">
      <Reveal className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-[22px] md:px-8 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16 lg:px-10">
        <div>
          <span className="inline-flex rounded-full border border-rose-400 px-3 py-1 text-xs font-semibold text-rose-600">
            FAQ
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            Frequently
            <span className="block text-rose-600">Asked Questions</span>
          </h2>
          <p className="mt-5 text-rose-950/60">Your questions, answered.</p>
        </div>

        <ul className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <li
                key={item.q}
                className={`rounded-2xl border bg-white transition-colors duration-300 ${
                  isOpen ? "border-rose-400 shadow-[0_14px_30px_-18px_rgba(225,29,72,0.35)]" : "border-rose-100"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`svc-faq-panel-${index}`}
                    id={`svc-faq-trigger-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-4 text-left"
                  >
                    <span className="text-[15.5px] font-semibold leading-snug text-rose-950">{item.q}</span>
                    <span className="shrink-0 text-rose-600">
                      {isOpen ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                    </span>
                  </button>
                </h3>
                <div
                  id={`svc-faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`svc-faq-trigger-${index}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-2 px-6 pb-5 text-sm leading-relaxed text-rose-950/65">
                      {item.a.split("\n").map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
