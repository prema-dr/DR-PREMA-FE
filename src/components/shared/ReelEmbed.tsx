import Image from "next/image";
import { YouTubeFacade } from "./YouTubeFacade";
import { InstagramLogoIcon as InstagramLogo } from "@phosphor-icons/react/dist/ssr";

// Shared by the home page and the service pages so every reel looks the same.
// Instagram's bare embed is a 336px-wide card: a profile header on top, a 4:5
// media area (the 9:16 video is pillarboxed with black bars), and an actions
// bar below. The iframe is scaled up and shifted so only the video fills the
// frame; everything else falls outside the clipped box.
const CARD_WIDTH = 336;
const VIDEO = { x: 48, y: 54, width: 240, height: 423 };
const SCALE = CARD_WIDTH / VIDEO.width;

function toEmbedUrl(url: string): string {
  const match = url.match(/instagram\.com\/(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/);
  if (!match) return url;
  const kind = match[1] === "reels" ? "reel" : match[1];
  return `https://www.instagram.com/${kind}/${match[2]}/embed/`;
}

export function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)\//i.test(url);
}

function parseYouTube(url: string): { id: string; short: boolean } | null {
  const m = url.match(/youtu\.be\/([\w-]+)/) ?? url.match(/youtube\.com\/(?:shorts|embed|live)\/([\w-]+)/) ?? url.match(/[?&]v=([\w-]+)/);
  if (!m) return null;
  return { id: m[1], short: /\/shorts\//.test(url) };
}

async function getYouTubeTitle(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`, { next: { revalidate: 86400 } });
    if (!res.ok) return undefined;
    return ((await res.json()) as { title?: string }).title;
  } catch {
    return undefined;
  }
}

async function YouTubeEmbed({ url }: { url: string }) {
  const yt = parseYouTube(url);
  if (!yt) return null;
  return <YouTubeFacade id={yt.id} short={yt.short} title={await getYouTubeTitle(url)} />;
}

export function ReelEmbed({ url }: { url: string }) {
  if (isYouTubeUrl(url)) return <YouTubeEmbed url={url} />;
  return (
    <div className="w-[336px] overflow-hidden rounded-3xl bg-white shadow-[0_14px_24px_-14px_rgba(159,18,57,0.4)]">
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: `${VIDEO.width} / ${VIDEO.height}` }}
      >
        <iframe
          src={toEmbedUrl(url)}
          title="Instagram reel"
          loading="lazy"
          scrolling="no"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute left-0 top-0 border-0"
          style={{
            width: CARD_WIDTH,
            height: 800,
            transformOrigin: "0 0",
            transform: `scale(${SCALE}) translate(${-VIDEO.x}px, ${-VIDEO.y}px)`,
          }}
        />
        {/* Shorts-style overlay: brand on top, profile at the bottom (clicks pass through to the video) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="pointer-events-none absolute left-4 top-3.5 flex items-center gap-1.5 text-white">
          <InstagramLogo size={24} weight="fill" />
          <span className="text-lg font-bold tracking-tight">Reels</span>
        </div>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center gap-2.5 text-white">
          <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white">
            <Image src="/images/dr-img.png" alt="" fill sizes="32px" className="object-cover object-top" />
          </span>
          <span className="truncate text-sm font-medium">dr_prema_gynaecologist_cbe</span>
        </div>
      </div>
    </div>
  );
}
