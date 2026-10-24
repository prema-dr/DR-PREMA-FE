import { CLINIC_INFO } from "./clinic-info";
import { INSTAGRAM_URL, WHATSAPP_URL, YOUTUBE_URL } from "./nav-links";

const LINKS = [
  { label: "YouTube", href: YOUTUBE_URL, icon: "/svg/youtube-color-svgrepo-com.svg" },
  { label: "Instagram", href: INSTAGRAM_URL, icon: "/svg/instagram-2-1-logo-svgrepo-com.svg" },
  { label: "WhatsApp", href: WHATSAPP_URL, icon: "/svg/whatsapp-color-svgrepo-com.svg" },
  { label: "Google Maps", href: CLINIC_INFO.mapUrl, icon: "/svg/location-pin-svgrepo-com.svg", size: 34 },
];

export function FloatingSocials() {
  return (
    <nav
      aria-label="Social and contact links"
      className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2.5 sm:right-5"
    >
      {LINKS.map(({ label, href, icon, size = 26 }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="flex size-11 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-transform hover:scale-110 active:scale-95"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt="" aria-hidden width={size} height={size} style={{ width: size, height: size }} />
        </a>
      ))}
    </nav>
  );
}
