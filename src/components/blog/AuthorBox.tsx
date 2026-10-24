import Image from "next/image";
import { InfoIcon as Info } from "@phosphor-icons/react/dist/ssr";

export function AuthorBox() {
  return (
    <div className="mt-16">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-sky-50 p-7 sm:flex-row sm:items-center md:p-8">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-rose-200 to-rose-100 ring-4 ring-white shadow-[0_16px_30px_-14px_rgba(159,18,57,0.5)]">
          <Image src="/images/hero-img.png" alt="Dr. Prema N." fill sizes="112px" className="object-cover object-top" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">Meet your doctor</p>
          <p className="mt-1 font-display text-2xl font-bold text-rose-950">Dr. Prema N.</p>
          <p className="text-sm font-medium text-rose-700">MBBS · MS (OBG) · DGO · DNB (OBG) · FICOG</p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-rose-950/65">
            Consultant Obstetrician and Gynaecologist with over two decades of experience, combining clinical expertise, academic knowledge and compassionate care.
          </p>
        </div>
      </div>
      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-rose-950/55">
        <Info size={15} className="mt-0.5 shrink-0 text-rose-400" />
        This article is for general information and does not replace a conversation with your own doctor.
      </p>
    </div>
  );
}
