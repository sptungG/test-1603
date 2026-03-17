import type { TProduct, TProductFilters, TSortOption } from "./product-types";

let cachedProducts: TProduct[] | null = null;

export async function fetchProducts(): Promise<TProduct[]> {
  if (cachedProducts) return cachedProducts;

  const response = await fetch("/products.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  const data: TProduct[] = await response.json();
  cachedProducts = data;
  return data;
}

export function filterAndSortProducts(products: TProduct[], filters: TProductFilters): TProduct[] {
  let result = products;

  // Search filter
  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim();
    result = result.filter((p) => p.name.toLowerCase().includes(query));
  }

  // Category filter
  if (filters.categories.length > 0) {
    result = result.filter((p) => filters.categories.includes(p.category));
  }

  // Price range filter
  result = result.filter((p) => p.price >= filters.priceMin && p.price <= filters.priceMax);

  // Min rating filter
  if (filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }

  // Sort
  result = sortProducts(result, filters.sort);

  return result;
}

function sortProducts(products: TProduct[], sort: TSortOption): TProduct[] {
  const sorted = [...products];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating_desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}
