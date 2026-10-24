"use client";

import { ArrowLeftIcon as ArrowLeft, ArrowRightIcon as ArrowRight } from "@phosphor-icons/react/dist/ssr";

// Compact page list: always first/last, current ±1, with ellipses for gaps.
function pageList(current: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const arrow =
    "flex size-11 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-rose-100 disabled:text-rose-200 disabled:hover:bg-white";

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      <button type="button" className={arrow} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ArrowLeft size={18} weight="bold" />
      </button>
      {pageList(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-rose-300">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`size-11 rounded-xl text-sm font-semibold transition-colors ${
              p === page
                ? "bg-rose-600 text-white shadow-[0_12px_24px_-12px_rgba(225,29,72,0.7)]"
                : "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className={arrow} disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ArrowRight size={18} weight="bold" />
      </button>
    </nav>
  );
}
