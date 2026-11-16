"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon as Play, YoutubeLogoIcon as YoutubeLogo } from "@phosphor-icons/react/dist/ssr";

// YouTube draws its own title/channel overlay inside the iframe and varies it per video, so
// every video is shown as a thumbnail with our own overlay; the real player loads on click.
export function YouTubeFacade({ id, short, title }: { id: string; short: boolean; title?: string }) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState("maxresdefault");

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-black shadow-[0_14px_24px_-14px_rgba(159,18,57,0.4)] ${
        short ? "w-[336px] max-w-[85vw]" : "w-[560px] max-w-[85vw]"
      }`}
      style={{ aspectRatio: short ? "9 / 16" : "16 / 9" }}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1&playsinline=1`}
          title={title ?? "YouTube video"}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="size-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label="Play video" className="group absolute inset-0 block size-full text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/${thumb}.jpg`}
            alt=""
            loading="lazy"
            onError={() => thumb !== "hqdefault" && setThumb("hqdefault")}
            className="absolute inset-0 size-full object-cover"
          />
          <span aria-hidden className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute left-4 top-3.5 flex items-center gap-1.5 text-white">
            <YoutubeLogo size={24} weight="fill" />
            <span className="text-lg font-bold tracking-tight">{short ? "Shorts" : "YouTube"}</span>
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-rose-600/95 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play size={28} weight="fill" />
            </span>
          </span>
          <span className="absolute inset-x-4 bottom-4 text-white">
            <span className="flex items-center gap-2.5">
              <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white">
                <Image src="/images/dr-img.png" alt="" fill sizes="32px" className="object-cover object-top" />
              </span>
              <span className="truncate text-sm font-medium">dr_prema_gynaecologist_cbe</span>
            </span>
            {title && <span className="mt-2 line-clamp-2 block text-sm font-semibold leading-snug">{title}</span>}
          </span>
        </button>
      )}
    </div>
  );
}
