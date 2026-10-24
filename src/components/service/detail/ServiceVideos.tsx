import { InstagramLogoIcon as InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Carousel } from "@/components/shared/Carousel";
import { Reveal } from "@/components/shared/Reveal";
import { ReelEmbed } from "@/components/shared/ReelEmbed";

export function ServiceVideos({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/70 to-white py-16 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-8 size-[28rem] rounded-full bg-rose-100/50" />
      <Reveal className="relative mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_10px_22px_-10px_rgba(244,63,94,0.7)]">
            <InstagramLogo size={14} weight="bold" />
            Watch &amp; learn
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            Short videos from <span className="text-rose-600">Dr. Prema</span>
          </h2>
        </div>

        <div className="mt-12">
          <Carousel
            label="videos"
            centered
            itemClassName=""
            items={urls.map((url, index) => (
              <ReelEmbed key={`${url}-${index}`} url={url} />
            ))}
          />
        </div>
      </Reveal>
    </section>
  );
}
