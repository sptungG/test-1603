import { memo } from "react";
import { cn } from "../../../utils/utils";
import type { TProductCategory } from "../product-types";
import { CATEGORY_LABELS } from "../product-types";

interface TBadgeProps {
  category: TProductCategory;
  className?: string;
}

const CATEGORY_COLORS: Record<TProductCategory, string> = {
  electronics: "bg-blue-100 text-blue-700",
  clothing: "bg-purple-100 text-purple-700",
  books: "bg-amber-100 text-amber-700",
  "home-garden": "bg-green-100 text-green-700",
  sports: "bg-orange-100 text-orange-700",
};

export const ViewCategoryBadge = memo(function ViewCategoryBadge({ category, className }: TBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", CATEGORY_COLORS[category], className)}>
      {CATEGORY_LABELS[category]}
    </span>
  );
});
