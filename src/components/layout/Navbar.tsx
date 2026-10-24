"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import {
  ListIcon as List,
  CaretDownIcon as CaretDown,
  WhatsappLogoIcon as WhatsappLogo,
  XIcon as X,
} from "@phosphor-icons/react/dist/ssr";
import { ServiceIcon } from "@/lib/service-icons";
import type { NavService } from "@/lib/site-api";
import { NAV_LINKS, WHATSAPP_URL } from "./nav-links";

export function Navbar({ services }: { services: NavService[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  return (
    <motion.header
      initial={{ y: -96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-4 top-4 z-50 md:inset-x-8 lg:left-1/2 lg:right-auto lg:w-[calc(100%-5rem)] lg:max-w-[85rem] lg:-translate-x-1/2"
    >
      <div
        className={`flex h-16 items-center justify-between rounded-full border border-rose-100 bg-white/85 px-5 backdrop-blur-md transition-shadow duration-300 md:px-6 ${
          scrolled
            ? "shadow-[0_14px_40px_-14px_rgba(159,18,57,0.35)]"
            : "shadow-[0_10px_40px_-16px_rgba(159,18,57,0.2)]"
        }`}
      >
        <Link
          href="/"
          className="flex flex-col leading-none"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-xl font-semibold tracking-tight text-rose-950">
            Dr <span className="text-rose-700">Prema</span>
          </span>
          <span className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-rose-950/65">
            Gynecologist
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isServices = link.href === "/service";
            const active = isServices
              ? pathname.startsWith("/service")
              : pathname === link.href;
            const linkClass = `inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-base font-medium transition-colors ${
              active
                ? "bg-rose-50 text-rose-700"
                : "text-rose-950/70 hover:bg-rose-50/60 hover:text-rose-700"
            }`;

            if (!isServices) {
              return (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              );
            }

            return (
              <div key={link.href} className="group relative">
                <Link href={link.href} className={linkClass}>
                  {link.label}
                  <CaretDown
                    size={12}
                    weight="bold"
                    className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                  />
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1 rounded-3xl border border-rose-100 bg-white p-3 shadow-[0_20px_50px_-20px_rgba(159,18,57,0.35)]">
                    {services.map((service) => {
                      const current = pathname === `/service/${service.slug}`;
                      return (
                        <Link
                          key={service.slug}
                          href={`/service/${service.slug}`}
                          className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors hover:bg-rose-50 hover:text-rose-700 ${
                            current ? "bg-rose-50 text-rose-700" : "text-rose-950/80"
                          }`}
                        >
                          <ServiceIcon iconKey={service.iconKey} size={18} weight="light" className="shrink-0 text-rose-700" />
                          {service.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(159,18,57,0.6)] transition-all hover:bg-rose-800 active:scale-[0.97] lg:inline-flex"
        >
          <WhatsappLogo size={18} weight="fill" />
          Book Consultation
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-rose-950 transition-colors hover:bg-rose-50 active:scale-[0.96] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Primary"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 flex flex-col gap-1 rounded-3xl border border-rose-100 bg-white/95 p-3 shadow-[0_10px_40px_-16px_rgba(159,18,57,0.25)] backdrop-blur-md lg:hidden"
          >
            {NAV_LINKS.map((link) => {
              const isServices = link.href === "/service";
              const active = isServices
                ? pathname.startsWith("/service")
                : pathname === link.href;
              const mobileClass = `rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-rose-50 text-rose-700"
                  : "text-rose-950/70 hover:bg-rose-50/60 hover:text-rose-700"
              }`;

              if (!isServices) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={mobileClass}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <div key={link.href}>
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`${mobileClass} flex-1`}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileServices((v) => !v)}
                      aria-label="Toggle services list"
                      aria-expanded={mobileServices}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-rose-950 hover:bg-rose-50"
                    >
                      <CaretDown
                        size={16}
                        weight="bold"
                        className={`transition-transform ${mobileServices ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  {mobileServices && (
                    <div className="mb-1 ml-3 mt-1 max-h-64 space-y-0.5 overflow-y-auto border-l border-rose-100 pl-3">
                      {services.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/service/${service.slug}`}
                          onClick={() => setOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm text-rose-950/75 hover:bg-rose-50 hover:text-rose-700"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
