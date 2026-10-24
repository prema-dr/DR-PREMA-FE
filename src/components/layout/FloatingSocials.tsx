import {
  InstagramLogoIcon as InstagramLogo,
  MapPinIcon as MapPin,
  WhatsappLogoIcon as WhatsappLogo,
  YoutubeLogoIcon as YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { CLINIC_INFO } from "./clinic-info";
import { INSTAGRAM_URL, WHATSAPP_URL, YOUTUBE_URL } from "./nav-links";

const LINKS = [
  { label: "YouTube", href: YOUTUBE_URL, Icon: YoutubeLogo, color: "bg-red-600" },
  { label: "Instagram", href: INSTAGRAM_URL, Icon: InstagramLogo, color: "bg-pink-600" },
  { label: "WhatsApp", href: WHATSAPP_URL, Icon: WhatsappLogo, color: "bg-emerald-500" },
  { label: "Google Maps", href: CLINIC_INFO.mapUrl, Icon: MapPin, color: "bg-sky-600" },
];

export function FloatingSocials() {
  return (
    <nav
      aria-label="Social and contact links"
      className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2.5 sm:right-5"
    >
      {LINKS.map(({ label, href, Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`flex size-11 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${color}`}
        >
          <Icon size={22} weight="fill" />
        </a>
      ))}
    </nav>
  );
}
