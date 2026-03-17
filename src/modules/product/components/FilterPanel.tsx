import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/utils";
import type { TProductCategory, TProductFilters } from "../product-types";
import { CATEGORY_LABELS, PRICE_RANGE, PRODUCT_CATEGORIES } from "../product-types";
import { FilterPriceRangeSlider } from "./FilterRangeSlider";

interface FilterPanelProps {
  filters: TProductFilters;
  onChange: (filters: Partial<TProductFilters>) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterPanel({ filters, onChange, onReset, totalCount, filteredCount }: FilterPanelProps) {
  function toggleCategory(cat: TProductCategory) {
    const current = filters.categories;
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    onChange({ categories: next });
  }

  const hasActiveFilters =
    filters.categories.length > 0 || filters.priceMin > PRICE_RANGE.min || filters.priceMax < PRICE_RANGE.max || filters.minRating > 0;

  return (
    <aside className="flex flex-col gap-6">
      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-gray-900">{filteredCount.toLocaleString()}</span>
          {" of "}
          <span className="font-medium">{totalCount.toLocaleString()}</span>
          {" products"}
        </p>
        {hasActiveFilters && (
          <button onClick={onReset} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Clear all
          </button>
        )}
      </div>

      {/* Category filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{CATEGORY_LABELS[cat]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <FilterPriceRangeSlider
          label="Price Range"
          min={PRICE_RANGE.min}
          max={PRICE_RANGE.max}
          valueMin={filters.priceMin}
          valueMax={filters.priceMax}
          step={10}
          formatValue={(v) => `$${v}`}
          onChange={(min, max) => onChange({ priceMin: min, priceMax: max })}
        />
      </div>

      {/* Min rating */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Minimum Rating</h3>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="minRating"
                value={r}
                checked={filters.minRating === r}
                onChange={() => onChange({ minRating: r })}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className={cn("text-sm", filters.minRating === r ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900")}>
                {r === 0 ? "Any rating" : `${r}+ stars`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="secondary" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
      )}
    </aside>
  );
}
