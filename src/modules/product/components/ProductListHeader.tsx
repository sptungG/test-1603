interface TProductListHeaderProps {
  totalCount: number;
}

export function ProductListHeader({ totalCount }: TProductListHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Product Explorer</h1>
      <p className="text-sm text-gray-500 mt-1">Browse and filter our catalog of {totalCount.toLocaleString()} products</p>
    </div>
  );
}
