import {
  ArrowUpRightIcon as ArrowUpRight,
  InstagramLogoIcon as InstagramLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Carousel } from "@/components/shared/Carousel";
import { Reveal } from "@/components/shared/Reveal";
import { ReelEmbed } from "@/components/shared/ReelEmbed";
import { INSTAGRAM_URL } from "@/components/layout/nav-links";
import { getVideoUrls } from "@/lib/site-api";

export async function InstagramReels() {
  const reels = await getVideoUrls();
  if (reels.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/70 to-white py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-8 size-[28rem] rounded-full bg-rose-100/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 size-[26rem] rounded-full bg-amber-100/40"
      />

      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
            <span className="h-px w-8 bg-rose-600" />
            <InstagramLogo size={16} weight="bold" />
            Instagram
            <span className="h-px w-8 bg-rose-600" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-rose-950 md:text-5xl">
            From our <span className="text-rose-600">Instagram</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-rose-950/65">
            Short clips from the practice and everyday women&apos;s health tips.
          </p>
        </div>

        <div className="mt-12">
          <Carousel
            label="reels"
            centered
            itemClassName=""
            items={reels.map((url, index) => (
              <ReelEmbed key={`${url}-${index}`} url={url} />
            ))}
          />
        </div>

        <div className="mt-6 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(232,64,122,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-[0.98]"
          >
            <InstagramLogo size={18} weight="fill" />
            Follow on Instagram
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
