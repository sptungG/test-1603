import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "../../components/ui/Button";
import { ViewCategoryBadge } from "./components/ViewCategoryBadge";
import { ViewStarRating } from "./components/ViewStarRating";
import { fetchProducts } from "./product-service";
import type { TProduct } from "./product-types";

export default function PageProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<TProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchProducts().then((products) => {
      const found = products.find((p) => p.id === id);
      if (found) {
        setProduct(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-10">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="h-72 w-full sm:w-80 bg-gray-200 rounded-2xl" />
            <div className="flex-1 flex flex-col gap-4">
              <div className="h-7 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/4 bg-gray-200 rounded" />
              <div className="h-6 w-1/3 bg-gray-200 rounded" />
              <div className="h-10 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-10 text-center">
        <div className="text-gray-300 text-6xl mb-4">404</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h1>
        <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link to="/">
          <Button variant="primary">Back to Explorer</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row gap-8">
        {/* Image */}
        <div className="sm:w-80 flex-shrink-0">
          <img src={product.image_url} alt={product.name} className="w-full rounded-2xl object-cover shadow-sm bg-gray-100" />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <ViewCategoryBadge category={product.category} />
            <h1 className="mt-2 text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>
          </div>

          <ViewStarRating rating={product.rating} size="md" />

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Product ID</span>
              <span className="font-mono text-xs text-gray-700 truncate max-w-[200px]">{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="text-gray-900 font-medium capitalize">{product.category.replace("-", " & ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Rating</span>
              <span className="text-gray-900 font-medium">{product.rating} / 5.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stock</span>
              <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="lg" disabled={product.stock === 0} className="flex-1">
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Link to="/">
              <Button variant="secondary" size="lg">
                Back
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
