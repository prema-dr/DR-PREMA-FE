"use client";

import { useState } from "react";
import {
  CheckIcon as Check,
  LinkSimpleIcon as LinkSimple,
  PhoneCallIcon as PhoneCall,
  WhatsappLogoIcon as WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { PHONE_TEL, whatsappLink } from "@/components/layout/nav-links";

export function ArticleAside({ title, headings }: { title: string; headings: { id: string; text: string }[] }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
      {headings.length > 0 && (
        <nav aria-label="In this article" className="rounded-3xl border border-rose-100 bg-white p-6 shadow-[0_14px_36px_-24px_rgba(159,18,57,0.35)]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">In this article</p>
          <ol className="mt-4 space-y-1 border-l-2 border-rose-100">
            {headings.map((h, i) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="-ml-0.5 flex items-start gap-3 border-l-2 border-transparent py-2 pl-4 text-sm font-medium leading-snug text-rose-950/65 transition-colors hover:border-rose-500 hover:text-rose-700"
                >
                  <span className="font-display text-xs font-bold text-rose-400">{String(i + 1).padStart(2, "0")}</span>
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-[0_14px_36px_-24px_rgba(159,18,57,0.35)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">Share this article</p>
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={copy}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-all hover:bg-rose-50 active:scale-[0.97]"
          >
            {copied ? <Check size={16} weight="bold" /> : <LinkSimple size={16} weight="bold" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <button
            type="button"
            aria-label="Share on WhatsApp"
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${window.location.href}`)}`, "_blank", "noopener,noreferrer")}
            className="inline-flex size-11 items-center justify-center rounded-full bg-emerald-500 text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-600 active:scale-[0.95]"
          >
            <WhatsappLogo size={20} weight="fill" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 p-6 text-white shadow-[0_30px_60px_-34px_rgba(159,18,57,0.8)]">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
        <p className="relative font-display text-xl font-bold leading-snug">Have a question about this?</p>
        <p className="relative mt-2 text-sm leading-relaxed text-rose-50/80">Talk it through with Dr. Prema, with no pressure to decide anything.</p>
        <div className="relative mt-5 flex flex-col gap-2.5">
          <a href={PHONE_TEL} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-rose-700 transition-all hover:-translate-y-0.5 active:scale-[0.98]">
            <PhoneCall size={17} weight="fill" /> Book Consultation
          </a>
          <a
            href={whatsappLink(`Hello Dr. Prema, I read "${title}" and have a question.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10 active:scale-[0.98]"
          >
            <WhatsappLogo size={18} weight="fill" /> WhatsApp Us
          </a>
        </div>
      </div>
    </aside>
  );
}
