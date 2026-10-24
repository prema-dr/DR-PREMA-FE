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

export function ReelEmbed({ url }: { url: string }) {
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
      </div>
    </div>
  );
}
