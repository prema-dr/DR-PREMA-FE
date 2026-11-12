import { HeroContent } from "@/components/home/HeroContent";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { HeroVisual } from "@/components/home/HeroVisual";

export function Hero() {
  return (
    <section className="relative -mt-36 flex min-h-[100svh] items-center overflow-hidden pt-[120px] pb-8 sm:pt-[130px] md:-mt-40 lg:pt-[140px] lg:pb-12">
      <HeroBackdrop />
      <div className="relative mx-auto grid w-full max-w-[90rem] grid-cols-1 items-center gap-12 px-[22px] md:px-8 lg:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <HeroContent />
        <HeroVisual />
      </div>
    </section>
  );
}
