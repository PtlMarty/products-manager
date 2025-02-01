import { Product } from "@prisma/client";

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, onDelete }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-left">Product Name</th>
            <th className="px-4 py-2 border text-left">Price ($)</th>
            <th className="px-4 py-2 border text-left">Supplier</th>
            <th className="px-4 py-2 border text-left">Created At</th>
            <th className="px-4 py-2 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 border">{product.name}</td>
              <td className="px-4 py-2 border">${product.price}</td>
              <td className="px-4 py-2 border">{product.supplierId}</td>
              <td className="px-4 py-2 border">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">
                <button
                  className="text-red-600 hover:underline ml-4"
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
  );
}
