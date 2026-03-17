import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import type { TProductFilters, TSortOption } from "../product-types";
import { SORT_OPTIONS } from "../product-types";

interface ProductSearchBarProps {
  searchInput: string;
  sort: TSortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (sort: TSortOption) => void;
  onFilterToggle: () => void;
}

export function ProductSearchBar({ searchInput, sort, onSearchChange, onSortChange, onFilterToggle }: ProductSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          aria-label="Search products"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as TSortOption)}
          className="rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          className="sm:hidden flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
          onClick={onFilterToggle}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>
    </div>
  );
}

// Re-export type used by consumers so they don't need a second import
export type { TProductFilters };
