import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { useUrlState } from "../../../hooks/useUrlState";
import type { TProduct, TProductCategory, TProductFilters, TSortOption } from "../product-types";
import { DEFAULT_FILTERS } from "../product-types";

export interface TUseProductFiltersResult {
  filters: TProductFilters;
  searchInput: string;
  setSearchInput: (v: string) => void;
  updateFilters: (partial: Partial<TProductFilters>) => void;
  resetFilters: () => void;
}

/**
 * Manages all filter state for the product list page.
 * Derives typed filters from URL search params and debounces the search input.
 */
export function useProductFilters(allProducts: TProduct[] | null): TUseProductFiltersResult & {
  priceBounds: { min: number; max: number };
} {
  const [urlState, setUrlState] = useUrlState({
    search: DEFAULT_FILTERS.search,
    categories: [] as string[],
    priceMin: undefined as string | undefined,
    priceMax: undefined as string | undefined,
    minRating: undefined as string | undefined,
    sort: DEFAULT_FILTERS.sort as string,
  });

  const [searchInput, setSearchInput] = useState(urlState.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync debounced search back to URL
  const prevDebouncedSearch = useRef(debouncedSearch);
  useEffect(() => {
    if (prevDebouncedSearch.current !== debouncedSearch) {
      setUrlState((s) => ({ ...s, search: debouncedSearch }));
      prevDebouncedSearch.current = debouncedSearch;
    }
  }, [debouncedSearch]);

  // Derive typed filters from URL string params
  const filters: TProductFilters = useMemo(() => {
    const rawCats = urlState.categories;
    const categories: TProductCategory[] = (Array.isArray(rawCats) ? rawCats : rawCats ? [rawCats as string] : []).filter(
      Boolean,
    ) as TProductCategory[];

    return {
      search: urlState.search ?? "",
      categories,
      priceMin: urlState.priceMin !== undefined ? Number(urlState.priceMin) : undefined,
      priceMax: urlState.priceMax !== undefined ? Number(urlState.priceMax) : undefined,
      minRating: urlState.minRating !== undefined ? Number(urlState.minRating) : undefined,
      sort: (urlState.sort ?? DEFAULT_FILTERS.sort) as TSortOption,
    };
  }, [urlState]);

  // Price bounds derived from loaded product data
  const priceBounds = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return { min: 0, max: 2000 };
    let min = allProducts[0].price;
    let max = allProducts[0].price;
    for (const p of allProducts) {
      if (p.price < min) min = p.price;
      if (p.price > max) max = p.price;
    }
    return { min: Math.floor(min), max: Math.ceil(max) };
  }, [allProducts]);

  const updateFilters = useCallback((partial: Partial<TProductFilters>) => {
    setUrlState((s) => ({
      ...s,
      ...(partial.categories !== undefined && { categories: partial.categories }),
      ...(partial.priceMin !== undefined && { priceMin: String(partial.priceMin) }),
      ...(partial.priceMax !== undefined && { priceMax: String(partial.priceMax) }),
      ...(partial.minRating !== undefined && { minRating: String(partial.minRating) }),
      ...(partial.sort !== undefined && { sort: partial.sort }),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchInput("");
    setUrlState({
      search: "",
      categories: [],
      priceMin: undefined,
      priceMax: undefined,
      minRating: undefined,
      sort: DEFAULT_FILTERS.sort,
    });
  }, []);

  return { filters, priceBounds, searchInput, setSearchInput, updateFilters, resetFilters };
}
