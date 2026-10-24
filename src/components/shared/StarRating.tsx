import { StarIcon as Star } from "@phosphor-icons/react/dist/ssr";

export function StarRating({ rating = 5, className }: { rating?: number; className?: string }) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className ?? ""}`}
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={14}
          weight={index < rating ? "fill" : "regular"}
          className={index < rating ? "text-amber-400" : "text-rose-200"}
        />
      ))}
    </div>
  );
}
