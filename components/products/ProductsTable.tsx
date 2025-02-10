import { ProductsTableProps } from "@/types/product";

//TODO: Add stock, category, description, image, tags, attributes, variants to the products table

export function ProductsTable({
  data,
  onEdit,
  onDelete,
  isLoading,
  className,
}: ProductsTableProps) {
  if (isLoading) {
    return <div className="p-4 text-center">Loading products...</div>;
  }

  if (!data?.length) {
    return <div className="p-4 text-center">No products found</div>;
  }

  return (
    <div className={`overflow-x-auto bg-white shadow rounded-lg ${className}`}>
      {/* Mobile View */}
      <div className="block sm:hidden">
        {data.map((product) => (
          <div
            key={product.id}
            className="border-b p-4 space-y-2 hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div
                className="font-medium"
                data-testid={`product-name-${product.id}`}
              >
                {product.name}
              </div>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => onDelete?.(product)}
              >
                Delete
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Price: ¥{product.price}</div>
              <div>Stock: {product.stock}</div>
              <div>
                Created: {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Product Name ↓
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Price (¥)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td
                  className="px-4 py-3 text-sm"
                  data-testid={`product-name-${product.id}`}
                >
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm">¥{product.price}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">{product.stock}</td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={() => onEdit?.(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition-colors"
                    onClick={() => onDelete?.(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
