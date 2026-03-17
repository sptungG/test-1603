import type { TProduct } from "../product-types";
import { ProductListVirtualized } from "./ProductListVirtualized";

interface TProductListContentProps {
  loading: boolean;
  products: TProduct[];
  height: number;
}

export function ProductListContent({ loading, products, height }: TProductListContentProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return <ProductListVirtualized products={products} height={height} />;
}
