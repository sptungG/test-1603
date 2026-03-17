import { memo, useId } from "react";
import { cn } from "../../../utils/utils";

interface ViewStarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export const ViewStarRating = memo(function ViewStarRating({ rating, size = "md" }: ViewStarRatingProps) {
  const full = Math.floor(rating);
  const partial = rating - full;
  const empty = 5 - Math.ceil(rating);

  const svgSize = size === "sm" ? 12 : 16;

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <StarFull key={`full-${i}`} size={svgSize} />
      ))}
      {partial > 0 && <StarPartial fill={partial} size={svgSize} />}
      {Array.from({ length: empty }).map((_, i) => (
        <StarEmpty key={`empty-${i}`} size={svgSize} />
      ))}
      <span className={cn("ml-1 text-gray-600 font-medium", size === "sm" ? "text-xs" : "text-sm")}>{rating.toFixed(1)}</span>
    </div>
  );
});

// Static full/empty stars have no gradient — no id needed
function StarFull({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" fill="#FBBF24" />
    </svg>
  );
}

function StarEmpty({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" fill="#E5E7EB" />
    </svg>
  );
}

// Partial star needs a gradient — use useId() for a stable, unique id
function StarPartial({ fill, size }: { fill: number; size: number }) {
  const id = useId();
  const gradientId = `star-gradient-${id}`;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${fill * 100}%`} stopColor="#FBBF24" />
          <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
        </linearGradient>
      </defs>
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" fill={`url(#${gradientId})`} />
    </svg>
  );
}
