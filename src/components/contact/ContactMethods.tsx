import type { ComponentType } from "react";
import {
  ArrowUpRightIcon as ArrowUpRight,
  EnvelopeSimpleIcon as EnvelopeSimple,
  MapPinIcon as MapPin,
  PhoneCallIcon as PhoneCall,
  WhatsappLogoIcon as WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";
import { CLINIC_INFO } from "@/components/layout/clinic-info";
import { WHATSAPP_URL } from "@/components/layout/nav-links";

type IconType = ComponentType<{ size?: number; weight?: "light" | "regular" | "fill"; className?: string }>;

const METHODS: {
  icon: IconType;
  label: string;
  value: string;
  hint: string;
  href: string;
  external?: boolean;
  tile: string;
  glow: string;
}[] = [
  {
    icon: PhoneCall,
    label: "Call us",
    value: CLINIC_INFO.phone,
    hint: "Best for appointments",
    href: `tel:${CLINIC_INFO.phone.replace(/\s/g, "")}`,
    tile: "from-rose-500 to-pink-400",
    glow: "shadow-[0_12px_24px_-8px_rgba(244,63,94,0.7)]",
  },
  {
    icon: WhatsappLogo,
    label: "WhatsApp",
    value: "Chat with the clinic",
    hint: "Quick questions",
    href: WHATSAPP_URL,
    external: true,
    tile: "from-emerald-500 to-teal-400",
    glow: "shadow-[0_12px_24px_-8px_rgba(16,185,129,0.7)]",
  },
  {
    icon: EnvelopeSimple,
    label: "Email us",
    value: CLINIC_INFO.email,
    hint: "Replies within one business day",
    href: `mailto:${CLINIC_INFO.email}`,
    tile: "from-sky-500 to-blue-400",
    glow: "shadow-[0_12px_24px_-8px_rgba(14,165,233,0.7)]",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: CLINIC_INFO.addressLine1,
    hint: CLINIC_INFO.addressLine2,
    href: CLINIC_INFO.mapUrl,
    external: true,
    tile: "from-violet-500 to-fuchsia-400",
    glow: "shadow-[0_12px_24px_-8px_rgba(139,92,246,0.7)]",
  },
];

export function ContactMethods() {
  return (
    <Reveal className="relative z-10 mx-auto -mt-24 max-w-[90rem] px-[22px] md:px-8 lg:-mt-28 lg:px-10">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METHODS.map(({ icon: Icon, label, value, hint, href, external, tile, glow }) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white bg-white p-6 shadow-[0_30px_60px_-34px_rgba(159,18,57,0.5)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_70px_-34px_rgba(159,18,57,0.6)]"
            >
              <Icon size={110} weight="light" aria-hidden className="pointer-events-none absolute -bottom-6 -right-4 -rotate-12 text-rose-50 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
              <span className={`relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white ring-4 ring-white ${tile} ${glow}`}>
                <Icon size={28} weight="light" />
              </span>
              <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.18em] text-rose-600">{label}</p>
              <p className="relative mt-1.5 break-words font-display text-lg font-bold leading-snug text-rose-950">{value}</p>
              <p className="relative mt-1 flex-1 text-sm text-rose-950/60">{hint}</p>
              <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rose-600">
                {label === "Visit us" ? "Get directions" : label === "Call us" ? "Call now" : label === "Email us" ? "Write to us" : "Start chat"}
                <ArrowUpRight size={15} weight="bold" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
