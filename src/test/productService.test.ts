import { describe, expect, it } from "vitest";
import { filterAndSortProducts } from "../modules/product/product-service";
import type { TProduct, TProductFilters } from "../modules/product/product-types";
import { DEFAULT_FILTERS } from "../modules/product/product-types";

function makeProduct(overrides: Partial<TProduct> = {}): TProduct {
  return {
    id: "test-id-1",
    name: "Test Product",
    price: 100,
    rating: 4.0,
    category: "electronics",
    stock: 10,
    image_url: "https://example.com/img.jpg",
    ...overrides,
  };
}

const SAMPLE_PRODUCTS: TProduct[] = [
  makeProduct({ id: "1", name: "Apple Laptop", price: 999, rating: 4.5, category: "electronics", stock: 5 }),
  makeProduct({ id: "2", name: "Blue Jeans", price: 49, rating: 3.8, category: "clothing", stock: 20 }),
  makeProduct({ id: "3", name: "React Cookbook", price: 29, rating: 4.9, category: "books", stock: 0 }),
  makeProduct({ id: "4", name: "Garden Hose", price: 15, rating: 2.5, category: "home-garden", stock: 100 }),
  makeProduct({ id: "5", name: "Yoga Mat", price: 35, rating: 4.2, category: "sports", stock: 30 }),
  makeProduct({ id: "6", name: "Wireless Headphones", price: 199, rating: 4.7, category: "electronics", stock: 15 }),
];

const baseFilters: TProductFilters = {
  ...DEFAULT_FILTERS,
  priceMax: 9999,
};

describe("filterAndSortProducts", () => {
  describe("search filter", () => {
    it("filters by name (case-insensitive)", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        search: "laptop",
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Apple Laptop");
    });

    it("returns all products when search is empty", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        search: "",
      });
      expect(result).toHaveLength(SAMPLE_PRODUCTS.length);
    });

    it("returns empty array when no match", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        search: "xyz-no-match-ever",
      });
      expect(result).toHaveLength(0);
    });

    it("trims whitespace before searching", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        search: "  yoga  ",
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Yoga Mat");
    });
  });

  describe("category filter", () => {
    it("filters by single category", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        categories: ["electronics"],
      });
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.category === "electronics")).toBe(true);
    });

    it("filters by multiple categories", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        categories: ["electronics", "sports"],
      });
      expect(result).toHaveLength(3);
    });

    it("returns all when no categories selected", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        categories: [],
      });
      expect(result).toHaveLength(SAMPLE_PRODUCTS.length);
    });
  });

  describe("price range filter", () => {
    it("filters by max price", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        priceMin: 0,
        priceMax: 50,
      });
      expect(result.every((p) => p.price <= 50)).toBe(true);
      expect(result).toHaveLength(4); // Blue Jeans(49), React Cookbook(29), Garden Hose(15), Yoga Mat(35)
    });

    it("filters by min price", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        priceMin: 100,
        priceMax: 9999,
      });
      expect(result.every((p) => p.price >= 100)).toBe(true);
      expect(result).toHaveLength(2); // Apple Laptop(999), Wireless Headphones(199)
    });

    it("filters by exact price range", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        priceMin: 29,
        priceMax: 49,
      });
      expect(result.every((p) => p.price >= 29 && p.price <= 49)).toBe(true);
    });
  });

  describe("minimum rating filter", () => {
    it("filters by minimum rating", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        minRating: 4.5,
      });
      expect(result.every((p) => p.rating >= 4.5)).toBe(true);
      expect(result).toHaveLength(3); // Apple(4.5), Cookbook(4.9), Headphones(4.7)
    });

    it("returns all when minRating is 0", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        minRating: 0,
      });
      expect(result).toHaveLength(SAMPLE_PRODUCTS.length);
    });
  });

  describe("sorting", () => {
    it("sorts by price ascending", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        sort: "price_asc",
      });
      for (let i = 1; i < result.length; i++) {
        expect(result[i].price).toBeGreaterThanOrEqual(result[i - 1].price);
      }
    });

    it("sorts by price descending", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        sort: "price_desc",
      });
      for (let i = 1; i < result.length; i++) {
        expect(result[i].price).toBeLessThanOrEqual(result[i - 1].price);
      }
    });

    it("sorts by rating descending", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        sort: "rating_desc",
      });
      expect(result[0].name).toBe("React Cookbook"); // rating 4.9
      for (let i = 1; i < result.length; i++) {
        expect(result[i].rating).toBeLessThanOrEqual(result[i - 1].rating);
      }
    });

    it("sorts by name ascending", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        sort: "name_asc",
      });
      for (let i = 1; i < result.length; i++) {
        expect(result[i].name.localeCompare(result[i - 1].name)).toBeGreaterThanOrEqual(0);
      }
    });

    it("sorts by name descending", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        sort: "name_desc",
      });
      for (let i = 1; i < result.length; i++) {
        expect(result[i].name.localeCompare(result[i - 1].name)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe("combined filters", () => {
    it("applies search + category + price together", () => {
      const result = filterAndSortProducts(SAMPLE_PRODUCTS, {
        ...baseFilters,
        search: "wire",
        categories: ["electronics"],
        priceMin: 100,
        priceMax: 300,
        minRating: 4,
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Wireless Headphones");
    });
  });

  it("does not mutate the original array", () => {
    const original = [...SAMPLE_PRODUCTS];
    filterAndSortProducts(SAMPLE_PRODUCTS, { ...baseFilters, sort: "price_desc" });
    expect(SAMPLE_PRODUCTS).toEqual(original);
  });
});
