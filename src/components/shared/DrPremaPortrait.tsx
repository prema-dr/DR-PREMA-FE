export function DrPremaPortrait({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100 via-rose-50 to-white ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 400 480"
        className="h-full w-full"
        role="img"
        aria-label="Illustrated placeholder portrait of Dr. Prema"
      >
        <circle cx="200" cy="180" r="150" fill="var(--color-rose-100)" opacity="0.6" />
        <path
          d="M115 420c0-72 38-118 85-118s85 46 85 118"
          fill="none"
          stroke="var(--color-rose-700)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="200"
          cy="196"
          r="72"
          fill="none"
          stroke="var(--color-rose-700)"
          strokeWidth="3"
        />
        <path
          d="M148 176c6-30 30-48 52-48s46 18 52 48"
          fill="none"
          stroke="var(--color-rose-700)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M96 340c26-14 54-20 104-20s78 6 104 20"
          fill="none"
          stroke="var(--color-rose-300)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M300 60c-18 8-28 24-26 44 18-4 32-16 38-34 3-8-4-14-12-10z"
          fill="var(--color-rose-200)"
          opacity="0.8"
        />
        <path
          d="M60 400c14-18 34-28 56-28"
          fill="none"
          stroke="var(--color-rose-200)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60" />
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-rose-950/70 backdrop-blur-sm">
        Illustrated placeholder
      </span>
    </div>
  );
}
