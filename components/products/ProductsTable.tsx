import { ProductsTableProps } from "@/types/product";

export function ProductsTable({
  products,
  suppliers,
  shops,
  onDelete,
  className,
}: ProductsTableProps) {
  return (
    <div className={`overflow-x-auto bg-white shadow rounded-lg ${className}`}>
      {/* Mobile View */}
      <div className="block sm:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="border-b p-4 space-y-2 hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div className="font-medium">{product.name}</div>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Price: ¥{product.price}</div>
              <div>
                Shop: {shops.find((s) => s.id === product.shopId)?.name}
              </div>
              <div>
                Supplier:{" "}
                {suppliers.find((s) => s.id === product.supplierId)?.name}
              </div>
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
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Price (¥)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Shop
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Supplier
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{product.name}</td>
                <td className="px-4 py-3 text-sm">¥{product.price}</td>
                <td className="px-4 py-3 text-sm">
                  {shops.find((s) => s.id === product.shopId)?.name}
                </td>
                <td className="px-4 py-3 text-sm">
                  {suppliers.find((s) => s.id === product.supplierId)?.name}
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    className="text-red-600 hover:text-red-800 transition-colors"
                    onClick={() => onDelete(product.id)}
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
