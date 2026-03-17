import { useMemo, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { ProductFilterSearchBar } from "./components/ProductFilterSearchBar";
import { ProductFilterSidebar } from "./components/ProductFilterSidebar";
import { ProductListContent } from "./components/ProductListContent";
import { ProductListHeader } from "./components/ProductListHeader";
import { useProductFilters } from "./hooks/useProductFilters";
import { fetchProducts, filterAndSortProducts } from "./product-service";
import type { TProduct } from "./product-types";

const LIST_HEIGHT = 680;

export default function PageProductList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [{ data: allProducts, loading, error }] = useFetch<TProduct[]>(fetchProducts);

  const { filters, priceBounds, searchInput, setSearchInput, updateFilters, resetFilters } = useProductFilters(allProducts);

  const filteredProducts = useMemo(() => filterAndSortProducts(allProducts ?? [], filters), [allProducts, filters]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-red-500">Failed to load products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
      <ProductListHeader totalCount={allProducts?.length ?? 0} />

      <ProductFilterSearchBar
        searchInput={searchInput}
        sort={filters.sort}
        onSearchChange={setSearchInput}
        onSortChange={(sort) => updateFilters({ sort })}
        onFilterToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex gap-6">
        <ProductFilterSidebar
          open={sidebarOpen}
          loading={loading}
          filters={filters}
          priceBounds={priceBounds}
          totalCount={allProducts?.length ?? 0}
          filteredCount={filteredProducts.length}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />

        <div className="flex-1 min-w-0">
          <ProductListContent loading={loading} products={filteredProducts} height={LIST_HEIGHT} />
        </div>
      </div>
    </div>
  );
}
