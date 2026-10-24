import { createElement } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowsClockwiseIcon as ArrowsClockwise,
  BabyIcon as Baby,
  CalendarCheckIcon as CalendarCheck,
  CirclesThreeIcon as CirclesThree,
  DropIcon as Drop,
  FirstAidKitIcon as FirstAidKit,
  FlowerIcon as Flower,
  HandHeartIcon as HandHeart,
  HeartIcon as Heart,
  LinkIcon as LinkSimple,
  MagnifyingGlassIcon as MagnifyingGlass,
  ScissorsIcon as Scissors,
  ShieldCheckIcon as ShieldCheck,
  WavesIcon as Waves,
} from "@phosphor-icons/react/dist/ssr";

// A service stores an `iconKey` string in the database; this maps it to the icon component.
const ICONS: Record<string, Icon> = {
  Baby, Heart, Waves, Drop, FirstAidKit, ArrowsClockwise, ShieldCheck, Scissors, Flower,
  MagnifyingGlass, CirclesThree, LinkSimple, CalendarCheck, HandHeart,
};

function resolveIcon(key: string | null | undefined): Icon {
  if (!key) return FirstAidKit;
  const normalized = key.replace(/(^|[-_ ])(\w)/g, (_, __, c: string) => c.toUpperCase());
  return ICONS[key] ?? ICONS[normalized] ?? FirstAidKit;
}

type IconProps = { iconKey: string | null | undefined; size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string };

export function ServiceIcon({ iconKey, ...props }: IconProps) {
  // createElement: the icon is looked up from a fixed map, not created during render.
  return createElement(resolveIcon(iconKey), props);
}
