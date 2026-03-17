import { FilterPanel } from "./FilterPanel";
import type { TProductFilters } from "../product-types";

interface ProductFilterSidebarProps {
  open: boolean;
  loading: boolean;
  filters: TProductFilters;
  priceBounds: { min: number; max: number };
  totalCount: number;
  filteredCount: number;
  onFiltersChange: (partial: Partial<TProductFilters>) => void;
  onReset: () => void;
}

export function ProductFilterSidebar({
  open,
  loading,
  filters,
  priceBounds,
  totalCount,
  filteredCount,
  onFiltersChange,
  onReset,
}: ProductFilterSidebarProps) {
  return (
    <aside
      className={`${open ? "block" : "hidden"} sm:block w-full sm:w-64 flex-shrink-0`}
    >
      <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <FilterPanel
            filters={filters}
            priceBounds={priceBounds}
            onChange={onFiltersChange}
            onReset={onReset}
            totalCount={totalCount}
            filteredCount={filteredCount}
          />
        )}
      </div>
    </aside>
  );
}
