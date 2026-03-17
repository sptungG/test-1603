export type TProductCategory = "electronics" | "clothing" | "books" | "home-garden" | "sports";

export interface TProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: TProductCategory;
  stock: number;
  image_url: string;
}

export type TSortOption = "created_at" | "price_asc" | "price_desc" | "rating_desc" | "name_asc" | "name_desc";

export interface TProductFilters {
  search: string;
  categories: TProductCategory[];
  /** undefined = no price floor applied */
  priceMin: number | undefined;
  /** undefined = no price ceiling applied */
  priceMax: number | undefined;
  /** undefined = no rating filter applied */
  minRating: number | undefined;
  sort: TSortOption;
}

export const PRODUCT_CATEGORIES: TProductCategory[] = ["electronics", "clothing", "books", "home-garden", "sports"];

export const CATEGORY_LABELS: Record<TProductCategory, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  books: "Books",
  "home-garden": "Home & Garden",
  sports: "Sports",
};

export const SORT_OPTIONS: { value: TSortOption; label: string }[] = [
  { value: "created_at", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

export const DEFAULT_FILTERS: TProductFilters = {
  search: "",
  categories: [],
  priceMin: undefined,
  priceMax: undefined,
  minRating: undefined,
  sort: "created_at",
};

export const PRICE_RANGE = { min: 0, max: 2000 };
