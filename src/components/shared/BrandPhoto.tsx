import Image from "next/image";

export function BrandPhoto({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-rose-100 transition-shadow duration-300 hover:shadow-xl ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(min-width: 1024px) 480px, 90vw"}
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rose-950/20 via-rose-500/0 to-white/15 mix-blend-multiply" />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/50" />
    </div>
  );
}
