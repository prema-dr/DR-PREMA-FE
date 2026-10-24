import { HeroContent } from "@/components/home/HeroContent";
import { HeroVisual } from "@/components/home/HeroVisual";

export function Hero() {
  return (
    <section className="relative -mt-36 overflow-hidden bg-gradient-to-b from-rose-50 via-white to-sky-50/70 pt-[92px] pb-4 sm:pt-[120px] sm:pb-8 md:-mt-40 lg:pt-[136px] lg:pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 size-[34rem] rounded-full bg-rose-100/50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -right-32 size-[34rem] rounded-full bg-sky-100/60"
      />
      {/* Fades the hero into the credentials strip's top colour so the two sections merge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-sky-100"
      />
      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-start gap-12 px-[22px] md:px-8 lg:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <HeroContent />
        <HeroVisual />
      </div>
    </section>
  );
}
