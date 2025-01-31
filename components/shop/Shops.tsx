"use server";

import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { Product } from "@prisma/client";

type Props = {
  userId: string;
  products: Product[];
};

async function Shops({ userId, products }: Props) {
  const shops = await getShopsByUserId(userId);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {shops && shops.length > 0 ? (
        shops.map((shop) => {
          // Filter products belonging to the current shop
          const shopProducts = products.filter(
            (product) => product.shopId === shop.id
          );

          return (
            <div key={shop.id} className="mb-8">
              {/* Shop Name */}
              <h2 className="text-2xl font-semibold mb-4">{shop.name}</h2>

              {shopProducts.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                  <table className="min-w-full border border-gray-300">
                    {/* Table Head */}
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border text-left">
                          Product Name
                        </th>
                        <th className="px-4 py-2 border text-left">
                          Price ($)
                        </th>
                        <th className="px-4 py-2 border text-left">Supplier</th>
                        <th className="px-4 py-2 border text-left">
                          Created At
                        </th>
                        <th className="px-4 py-2 border text-left">Actions</th>
                      </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                      {shopProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-2 border">{product.name}</td>
                          <td className="px-4 py-2 border">${product.price}</td>
                          <td className="px-4 py-2 border">
                            {product.supplierId}
                          </td>
                          <td className="px-4 py-2 border">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 border">
                            <button className="text-blue-600 hover:underline">
                              Edit
                            </button>
                            <button className="text-red-600 hover:underline ml-4">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">
                  No products available for this shop.
                </p>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-gray-600 text-center">No shops available.</div>
      )}
    </div>
  );
}

export default Shops;
