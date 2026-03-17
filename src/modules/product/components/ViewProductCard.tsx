import { Link } from "react-router";
import { cn } from "../../../utils/utils";
import type { TProduct } from "../product-types";
import { ViewCategoryBadge } from "./ViewCategoryBadge";
import { ViewStarRating } from "./ViewStarRating";

interface ViewProductCardProps {
  product: TProduct;
  style?: React.CSSProperties;
}

export function ViewProductCard({ product, style }: ViewProductCardProps) {
  return (
    <div style={style} className="">
      <Link
        to={`/products/${product.id}`}
        className="flex gap-4 relative bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-md transition-all group"
      >
        <img src={product.image_url} alt={product.name} loading="lazy" className="h-24 w-24 rounded-lg object-cover shrink-0 bg-gray-100" />
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <h3 className="font-medium text-gray-900 text-sm leading-tight group-hover:text-blue-700 truncate">{product.name}</h3>
            <div className="mt-1">
              <ViewCategoryBadge category={product.category} />
            </div>
          </div>
          <div className="flex items-end mt-auto justify-between">
            <ViewStarRating rating={product.rating} size="md" />
            <div className="text-right">
              <p className="font-bold text-gray-900 leading-[1.2] text-base">${product.price.toFixed(2)}</p>
              <p className={cn("text-xs", product.stock > 0 ? "text-green-600" : "text-red-500")}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
