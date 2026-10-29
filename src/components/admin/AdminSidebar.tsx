"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChatCircleTextIcon as ChatCircleText,
  ImagesIcon as Images,
  ListIcon as List,
  NotePencilIcon as NotePencil,
  PlayCircleIcon as PlayCircle,
  SquaresFourIcon as SquaresFour,
  BooksIcon as Books,
  XIcon as X,
} from "@phosphor-icons/react/dist/ssr";
import { LogoutButton } from "@/components/admin/LogoutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: SquaresFour, exact: true },
  { href: "/admin/blog", label: "Blogs", icon: NotePencil },
  { href: "/admin/testimonials", label: "Testimonials", icon: ChatCircleText },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/publications", label: "Publications", icon: Books },
  { href: "/admin/videos", label: "Videos", icon: PlayCircle },
];

export function AdminSidebar({ admin }: { admin: { name: string; email: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  const initials = admin.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed bottom-5 left-5 z-30 flex size-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg lg:hidden"
      >
        <List size={22} weight="bold" />
      </button>
      {open && <div className="fixed inset-0 z-20 bg-rose-950/50 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 flex-col overflow-hidden bg-gradient-to-b from-rose-950 via-[#6e1530] to-[#8f203f] text-rose-100 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-rose-500/20 blur-3xl" />

        <div className="relative flex items-center justify-between px-6 pb-5 pt-7">
          <div>
            <p className="font-name text-[26px] italic leading-none text-white">Dr Prema</p>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-300">Admin Console</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-1.5 text-rose-200 hover:bg-white/10 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" : "text-rose-200/80 hover:bg-white/6 hover:text-white"
                }`}
              >
                {active && <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-rose-400" />}
                <ItemIcon size={19} weight={active ? "fill" : "regular"} className={active ? "text-rose-300" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-400/25 text-xs font-semibold text-white">{initials || "A"}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{admin.name}</p>
              <p className="truncate text-[11px] text-rose-300/80">{admin.email || "Signed in"}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
