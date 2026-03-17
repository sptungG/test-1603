import { PackageOpen } from "lucide-react";
import type { CSSProperties } from "react";
import { List } from "react-window";
import type { TProduct } from "../product-types";
import { ViewProductCard } from "./ViewProductCard";

const ITEM_HEIGHT = 132; // px per row

interface TRowExtraProps {
  products: TProduct[];
}

function Row({
  index,
  style,
  products,
}: {
  ariaAttributes: Record<string, unknown>;
  index: number;
  style: CSSProperties;
} & TRowExtraProps) {
  const product = products[index];
  return <ViewProductCard product={product} style={style} />;
}

interface TProductListVirtualizedProps {
  products: TProduct[];
  height: number;
}

export function ProductListVirtualized({ products, height }: TProductListVirtualizedProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <PackageOpen className="h-12 w-12 mb-3 text-gray-300" />
        <p className="text-sm font-medium">No products found</p>
        <p className="text-xs mt-1">Try adjusting your filters or search</p>
      </div>
    );
  }

  return (
    <List<TRowExtraProps>
      style={{ height }}
      rowComponent={Row}
      rowCount={products.length}
      rowHeight={ITEM_HEIGHT}
      rowProps={{ products }}
      overscanCount={5}
    />
  );
}
