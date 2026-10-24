import { LockKeyIcon as LockKey, ShieldCheckIcon as ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

export function PrivacyNote() {
  return (
    <Reveal className="mx-auto mt-16 max-w-[90rem] px-[22px] md:px-8 lg:px-10">
      <div className="relative flex flex-col items-start gap-5 overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-rose-50 p-6 sm:flex-row sm:items-center md:p-8">
        <LockKey size={120} weight="light" aria-hidden className="pointer-events-none absolute -right-4 -top-4 text-sky-100" />
        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-400 text-white shadow-[0_12px_24px_-10px_rgba(14,165,233,0.7)]">
          <ShieldCheck size={28} weight="light" />
        </span>
        <div className="relative">
          <p className="font-display text-lg font-bold text-rose-950">Shared with permission, protected with care</p>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-rose-950/65">
            Every story on this page is shared with the patient&apos;s permission. Names and identifying details are adjusted to protect privacy.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
