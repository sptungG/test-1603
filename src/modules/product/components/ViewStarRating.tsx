import { cn } from "../../../utils/utils";

interface ViewStarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export function ViewStarRating({ rating, size = "md" }: ViewStarRatingProps) {
  const full = Math.floor(rating);
  const partial = rating - full;
  const empty = 5 - Math.ceil(rating);

  const svgSize = size === "sm" ? 12 : 16;

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`full-${i}`} fill={1} size={svgSize} />
      ))}
      {partial > 0 && <StarIcon fill={partial} size={svgSize} />}
      {Array.from({ length: empty }).map((_, i) => (
        <StarIcon key={`empty-${i}`} fill={0} size={svgSize} />
      ))}
      <span className={cn("ml-1 text-gray-600 font-medium", size === "sm" ? "text-xs" : "text-sm")}>{rating.toFixed(1)}</span>
    </div>
  );
}

function StarIcon({ fill, size }: { fill: number; size: number }) {
  const id = `star-gradient-${Math.random().toString(36).slice(2)}`;
  if (fill === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" fill="#FBBF24" />
      </svg>
    );
  }
  if (fill === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" fill="#E5E7EB" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#FBBF24" />
          <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
        </linearGradient>
      </defs>
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" fill={`url(#${id})`} />
    </svg>
  );
}
