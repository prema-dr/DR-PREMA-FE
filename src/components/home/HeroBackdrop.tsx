// Soft blush-pink backdrop with watercolour-style flowers, drifting petals and a flowing wave.
function Flower({ className, rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={{ transform: `rotate(${rotate}deg)` }}>
      <defs>
        <radialGradient id="petal" cx="50%" cy="85%" r="90%">
          <stop offset="0%" stopColor="#f27aa6" />
          <stop offset="60%" stopColor="#f9b8d0" />
          <stop offset="100%" stopColor="#fde4ee" />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d="M50 50 C28 40 30 8 50 4 C70 8 72 40 50 50Z"
          fill="url(#petal)"
          opacity="0.92"
          transform={`rotate(${a} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="6" fill="#e8407a" opacity="0.75" />
      <circle cx="50" cy="50" r="2.5" fill="#fbd34d" />
    </svg>
  );
}

function Petal({ className, rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg viewBox="0 0 20 30" aria-hidden className={className} style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M10 0 C20 8 20 22 10 30 C0 22 0 8 10 0Z" fill="#f7a3c3" opacity="0.7" />
    </svg>
  );
}

export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base blush gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff5f9_0%,#fde7f0_45%,#fbd3e3_100%)]" />
      {/* Watercolour glows */}
      <div className="absolute -left-24 top-0 size-[32rem] rounded-full bg-pink-200/25 blur-3xl" />
      <div className="absolute right-[-6rem] top-10 size-[36rem] rounded-full bg-rose-200/30 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-1/3 size-[30rem] rounded-full bg-pink-300/15 blur-3xl" />

      {/* Flowers: left edge */}
      <Flower className="absolute -left-10 top-[12%] hidden size-44 opacity-90 sm:block sm:size-56" rotate={-15} />
      <Flower className="absolute left-4 top-[48%] hidden size-24 opacity-80 sm:block sm:size-32" rotate={25} />
      <Flower className="absolute -left-8 bottom-[8%] hidden size-36 opacity-80 sm:block" rotate={40} />
      {/* Flowers: behind portrait */}
      <Flower className="absolute right-[4%] top-[6%] hidden size-28 opacity-80 lg:block" rotate={10} />
      <Flower className="absolute bottom-[10%] right-[2%] hidden size-40 opacity-85 lg:block" rotate={-30} />
      <Flower className="absolute bottom-[4%] left-[46%] hidden size-24 opacity-70 lg:block" rotate={55} />

      {/* Drifting petals */}
      <Petal className="absolute left-[18%] top-[10%] hidden w-4 sm:block" rotate={-30} />
      <Petal className="absolute left-[42%] top-[22%] hidden w-5 lg:block" rotate={35} />
      <Petal className="absolute right-[30%] top-[8%] hidden w-4 lg:block" rotate={70} />
      <Petal className="absolute bottom-[30%] left-[8%] hidden w-4 sm:block" rotate={110} />
      <Petal className="absolute bottom-[18%] right-[38%] hidden w-5 lg:block" rotate={-60} />

      {/* Flowing wave at the bottom */}
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-20 h-28 w-full sm:h-40"
      >
        <path d="M0 90 C240 20 480 150 760 80 C1040 10 1240 120 1440 50 L1440 160 L0 160Z" fill="#f9c6da" opacity="0.55" />
        <path d="M0 120 C300 60 560 160 860 105 C1100 60 1280 140 1440 100 L1440 160 L0 160Z" fill="#fdeaf2" opacity="0.9" />
      </svg>
    </div>
  );
}
