import Link from "next/link";
import type { ComponentType } from "react";
import {
  BabyIcon as Baby,
  ClipboardTextIcon as ClipboardText,
  ClockIcon as Clock,
  DropIcon as Drop,
  FirstAidIcon as FirstAid,
  FlaskIcon as Flask,
  HeartIcon as Heart,
  MicroscopeIcon as Microscope,
  PillIcon as Pill,
  StethoscopeIcon as Stethoscope,
} from "@phosphor-icons/react/dist/ssr";
import type { BlogPost } from "@/lib/site-api";

type IconType = ComponentType<{ size?: number; weight?: "light" | "regular" | "bold"; className?: string }>;

const TONES = [
  { bg: "from-sky-50 via-sky-100 to-blue-100", title: "text-sky-950", icon: "text-sky-700" },
  { bg: "from-violet-50 via-purple-100 to-fuchsia-100", title: "text-purple-950", icon: "text-purple-700" },
  { bg: "from-rose-50 via-rose-100 to-pink-100", title: "text-rose-950", icon: "text-rose-700" },
];

const ICON_SETS: { match: RegExp; icons: [IconType, IconType, IconType] }[] = [
  { match: /pcos|menses|hormon/i, icons: [Drop, Pill, ClipboardText] },
  { match: /pregnan|delivery|postpartum|prenatal/i, icons: [Baby, Heart, ClipboardText] },
  { match: /fertil|infertil/i, icons: [Microscope, Flask, Heart] },
];
const DEFAULT_ICONS: [IconType, IconType, IconType] = [Stethoscope, Heart, FirstAid];

function hash(text: string) {
  let h = 0;
  for (const char of text) h = (h * 31 + char.charCodeAt(0)) >>> 0;
  return h;
}

export function BlogCard({ post }: { post: BlogPost }) {
  const tone = TONES[hash(post.slug) % TONES.length];
  const [IconA, IconB, IconC] =
    ICON_SETS.find((set) => set.match.test(post.category))?.icons ?? DEFAULT_ICONS;
  const bubble =
    "absolute flex size-12 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_-8px_rgba(30,41,59,0.3)] sm:size-14";

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_-12px_rgba(159,18,57,0.18)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-14px_rgba(159,18,57,0.28)]">
        {/* Illustrated banner */}
        <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${tone.bg}`}>
          <div
            aria-hidden
            className="absolute -bottom-16 -left-10 h-32 w-[120%] rounded-[50%] bg-white/40"
          />
          <h3
            className={`absolute left-6 top-1/2 line-clamp-4 w-[52%] -translate-y-1/2 font-display text-xl font-bold leading-tight ${tone.title}`}
          >
            {post.title}
          </h3>
          <span className={`${bubble} right-[22%] top-4`}>
            <IconA size={26} weight="light" className={tone.icon} />
          </span>
          <span className={`${bubble} right-5 top-[40%]`}>
            <IconB size={26} weight="light" className={tone.icon} />
          </span>
          <span className={`${bubble} bottom-3 right-[26%]`}>
            <IconC size={26} weight="light" className={tone.icon} />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <span className="w-fit rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
            {post.category}
          </span>
          <p className="mt-4 font-display text-lg font-semibold leading-snug text-rose-950 transition-colors group-hover:text-rose-700">
            {post.title}
          </p>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-rose-950/65">
            {post.excerpt}
          </p>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-rose-950/55">
            <Clock size={14} weight="regular" />
            {post.readTime}
          </p>
        </div>
      </article>
    </Link>
  );
}
