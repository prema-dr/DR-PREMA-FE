import type { ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BuildingsIcon as Buildings,
  CertificateIcon as Certificate,
  ClockIcon as Clock,
  EnvelopeSimpleIcon as EnvelopeSimple,
  GraduationCapIcon as GraduationCap,
  HeartIcon as Heart,
  InstagramLogoIcon as InstagramLogo,
  MapPinIcon as MapPin,
  PhoneCallIcon as PhoneCall,
  PhoneIcon as Phone,
  UsersIcon as Users,
  WhatsappLogoIcon as WhatsappLogo,
  YoutubeLogoIcon as YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { NavService } from "@/lib/site-api";
import { NAV_LINKS, INSTAGRAM_URL, PHONE_TEL, WHATSAPP_URL, YOUTUBE_URL } from "./nav-links";
import { CLINIC_INFO } from "./clinic-info";

type IconType = ComponentType<{ size?: number; weight?: "light" | "regular" | "fill"; className?: string }>;

const TRUST: { icon: IconType; strong: string; text: string }[] = [
  { icon: GraduationCap, strong: "FICOG", text: "India" },
  { icon: Certificate, strong: "DNB (OBG)", text: "National Board" },
  { icon: Users, strong: "4,000+", text: "Patients cared for" },
  { icon: Heart, strong: "20+", text: "Years of experience" },
  { icon: Buildings, strong: "3", text: "Hospital affiliations" },
];

// Footer groups the existing service pages into procedures/conditions and maternity services.
const TREATMENT_SLUGS = [
  "fertility-treatment",
  "pcos",
  "uterine-fibroids",
  "bleeding-menses-problems",
  "no-scar-hysterectomy",
  "tubal-recanalisation",
];
const SERVICE_SLUGS = [
  "normal-delivery",
  "natural-birthing",
  "waterbirthing",
  "hydrotherapy-during-labour",
  "labour-pain-relief",
  "vbac",
  "high-risk-pregnancy-care",
  "postpartum-care",
];

const bySlug = (services: NavService[], slugs: string[]) =>
  slugs.flatMap((slug) => services.filter((service) => service.slug === slug));

const SOCIALS: { label: string; href: string; icon: IconType }[] = [
  { label: "YouTube", href: YOUTUBE_URL, icon: YoutubeLogo },
  { label: "Instagram", href: INSTAGRAM_URL, icon: InstagramLogo },
  { label: "WhatsApp", href: WHATSAPP_URL, icon: WhatsappLogo },
  { label: "Google Maps", href: CLINIC_INFO.mapUrl, icon: MapPin },
];

const linkClass =
  "group inline-flex items-start gap-2 text-sm leading-snug text-white/65 transition-colors hover:text-rose-300";

function ColumnHeading({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white">
      <span className="h-px w-5 bg-rose-400" />
      {children}
    </p>
  );
}

function ServiceList({ services, slugs }: { services: NavService[]; slugs: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {bySlug(services, slugs).map((service) => (
        <li key={service.slug}>
          <Link href={`/service/${service.slug}`} className={linkClass}>
            <span className="mt-[7px] size-1 shrink-0 rounded-full bg-rose-400/60 transition-all group-hover:w-2.5 group-hover:bg-rose-300" />
            {service.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer({ services }: { services: NavService[] }) {
  return (
    <footer className="relative mt-24 overflow-hidden bg-[rgb(17,24,39)] text-white">
      {/* ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-24 size-[32rem] rounded-full bg-rose-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 size-[28rem] rounded-full bg-sky-500/10 blur-3xl"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/70 to-transparent" />

      {/* Trust bar */}
      <div className="relative border-b border-white/10">
        <ul className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-[22px] py-5 md:px-8 lg:justify-between lg:px-10">
          {TRUST.map(({ icon: Icon, strong, text }) => (
            <li key={strong} className="flex items-center gap-2.5 text-sm">
              <Icon size={20} weight="regular" className="text-rose-400" />
              <span className="font-semibold text-white">{strong}</span>
              <span className="text-white/55">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto max-w-[90rem] px-[22px] pb-10 pt-16 md:px-8 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1.1fr_1.15fr] lg:gap-10">
          {/* Brand */}
          <div>
            <p className="font-display text-3xl font-bold tracking-tight">
              Dr. <span className="text-rose-400">Prema</span>
            </p>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/70">
              Consultant Obstetrician &amp; Gynaecologist with over two decades of experience,
              offering honest conversation and unhurried care at every stage of life.
            </p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full bg-white/[0.07] text-white/80 ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-rose-500 hover:text-white"
                >
                  <Icon size={18} weight="fill" />
                </a>
              ))}
            </div>
            <a
              href={PHONE_TEL}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(244,63,94,0.8)] transition-all hover:-translate-y-0.5 hover:bg-rose-400 active:scale-[0.98]"
            >
              <PhoneCall size={18} weight="regular" />
              Book Consultation
            </a>
          </div>

          {/* Quick links */}
          <div>
            <ColumnHeading>Quick Links</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    <span className="mt-[7px] size-1 shrink-0 rounded-full bg-rose-400/60 transition-all group-hover:w-2.5 group-hover:bg-rose-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <ColumnHeading>Treatments</ColumnHeading>
            <ServiceList services={services} slugs={TREATMENT_SLUGS} />
          </div>

          {/* Services */}
          <div>
            <ColumnHeading>Services</ColumnHeading>
            <ServiceList services={services} slugs={SERVICE_SLUGS} />
          </div>

          {/* Visit */}
          <div>
            <ColumnHeading>Visit the Clinic</ColumnHeading>
            <ul className="mt-5 space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} weight="regular" className="mt-0.5 shrink-0 text-rose-400" />
                <span className="leading-relaxed">
                  {CLINIC_INFO.addressLine1}
                  <br />
                  {CLINIC_INFO.addressLine2}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} weight="regular" className="mt-0.5 shrink-0 text-rose-400" />
                <span className="space-y-2 leading-snug">
                  {CLINIC_INFO.hours.map((slot) => (
                    <span key={slot.days} className="block">
                      <span className="block text-white/85">{slot.days}</span>
                      <span className="block text-xs text-white/55">{slot.time}</span>
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} weight="regular" className="shrink-0 text-rose-400" />
                <a href={`tel:${CLINIC_INFO.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-rose-300">
                  {CLINIC_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeSimple size={18} weight="regular" className="shrink-0 text-rose-400" />
                <a href={`mailto:${CLINIC_INFO.email}`} className="transition-colors hover:text-rose-300">
                  {CLINIC_INFO.email}
                </a>
              </li>
            </ul>

            <a
              href={CLINIC_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-5 block aspect-[16/9] w-full max-w-[240px] overflow-hidden rounded-2xl border border-white/10"
            >
              <Image
                src="/images/clinic-map.png"
                alt="Map showing the clinic's location near KMCH Hospital, Coimbatore"
                fill
                sizes="240px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-rose-950/10 transition-opacity group-hover:bg-rose-950/0" />
              <span className="absolute bottom-2 left-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-rose-700">
                Open in Maps
              </span>
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Dr. Prema Clinic. All rights reserved.</p>
          <p className="md:text-center">This site is informational and does not offer appointment booking.</p>
          <p>MBBS, MS (OBG), DGO, DNB (OBG), FICOG</p>
        </div>
      </div>
    </footer>
  );
}
