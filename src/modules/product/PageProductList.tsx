import { Search, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../../components/ui/Input";
import { useDebounce } from "../../hooks/useDebounce";
import { useUrlState } from "../../hooks/useUrlState";
import { FilterPanel } from "./components/FilterPanel";
import { VirtualizedProductList } from "./components/VirtualizedProductList";
import { fetchProducts, filterAndSortProducts } from "./product-service";
import type { TProduct, TProductCategory, TProductFilters, TSortOption } from "./product-types";
import { DEFAULT_FILTERS, SORT_OPTIONS } from "./product-types";

const LIST_HEIGHT = 680;

export default function PageProductList() {
  const [allProducts, setAllProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // URL state — priceMin/priceMax/minRating are omitted from URL until explicitly set
  const [urlState, setUrlState] = useUrlState({
    search: DEFAULT_FILTERS.search,
    categories: [] as string[],
    priceMin: undefined as string | undefined,
    priceMax: undefined as string | undefined,
    minRating: undefined as string | undefined,
    sort: DEFAULT_FILTERS.sort as string,
  });

  // Local search input (debounced before storing)
  const [searchInput, setSearchInput] = useState(urlState.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync debounced search to URL
  const prevDebouncedSearch = useRef(debouncedSearch);
  useEffect(() => {
    if (prevDebouncedSearch.current !== debouncedSearch) {
      setUrlState((s) => ({ ...s, search: debouncedSearch }));
      prevDebouncedSearch.current = debouncedSearch;
    }
  }, [debouncedSearch, setUrlState]);

  // Actual price bounds derived from loaded data
  const priceBounds = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 2000 };
    let min = allProducts[0].price;
    let max = allProducts[0].price;
    for (const p of allProducts) {
      if (p.price < min) min = p.price;
      if (p.price > max) max = p.price;
    }
    return { min: Math.floor(min), max: Math.ceil(max) };
  }, [allProducts]);

  // Derived filters from URL state — undefined URL params fall back to data-derived bounds
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

  // Load products
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setAllProducts(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filtered + sorted results
  const filteredProducts = useMemo(() => filterAndSortProducts(allProducts, filters), [allProducts, filters]);

  const updateFilters = useCallback(
    (partial: Partial<TProductFilters>) => {
      setUrlState((s) => ({
        ...s,
        ...(partial.categories !== undefined && {
          categories: partial.categories,
        }),
        ...(partial.priceMin !== undefined && {
          priceMin: String(partial.priceMin),
        }),
        ...(partial.priceMax !== undefined && {
          priceMax: String(partial.priceMax),
        }),
        ...(partial.minRating !== undefined && {
          minRating: String(partial.minRating),
        }),
        ...(partial.sort !== undefined && { sort: partial.sort }),
      }));
    },
    [setUrlState],
  );

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
  }, [setUrlState]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-red-500">Failed to load products: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Explorer</h1>
        <p className="text-sm text-gray-500 mt-1">Browse and filter our catalog of {allProducts.length.toLocaleString()} products</p>
      </div>

      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            aria-label="Search products"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
          <select
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value as TSortOption })}
            className="rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Mobile filter toggle */}
          <button
            className="sm:hidden flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? "block" : "hidden"} sm:block
            w-full sm:w-64 flex-shrink-0
          `}
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
                onChange={updateFilters}
                onReset={resetFilters}
                totalCount={allProducts.length}
                filteredCount={filteredProducts.length}
              />
            )}
          </div>
        </aside>

        {/* Product list */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-xl border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* <p className="text-xs text-gray-500 mb-3">
                Showing {filteredProducts.length.toLocaleString()} result{filteredProducts.length !== 1 ? "s" : ""}
              </p> */}
              <VirtualizedProductList products={filteredProducts} height={LIST_HEIGHT} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
