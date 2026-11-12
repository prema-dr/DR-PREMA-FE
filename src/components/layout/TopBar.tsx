import { PhoneIcon as Phone } from "@phosphor-icons/react/dist/ssr";
import { PHONE_TEL, WHATSAPP_URL } from "./nav-links";

export function TopBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-[60] bg-rose-900 text-white">
      <div className="mx-auto flex h-8 max-w-[90rem] items-center justify-between gap-4 px-[22px] text-xs md:px-8 lg:px-10">
        <p className="flex min-w-0 items-center gap-2">
          <span className="size-1.5 shrink-0 rounded-full bg-rose-400" />
          <span className="truncate">Senior Consultant at Kovai Medical Center &amp; Hospital (KMCH), Coimbatore</span>
        </p>
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <a href={PHONE_TEL} className="inline-flex items-center gap-1.5 hover:text-rose-200">
            <Phone size={13} />
            +91 73734 47104
          </a>
          <span className="h-3 w-px bg-white/30" />
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-rose-200">
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
