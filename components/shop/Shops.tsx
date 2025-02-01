"use client";

import CreateProduct from "@/components/products/CreateProduct";
import NewProduct from "@/components/products/NewProduct";
import { deleteProduct } from "@/lib/actions/products/productsActions";
import { Product, Shop } from "@prisma/client";
import { z } from "zod";

type Props = {
  userId: string;
  products: Product[];
  shops: Shop[];
};

function Shops({ products, shops }: Props) {
  //zod validation for the product

  const productSchema = z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    supplierId: z.string().min(1).optional(),
    shopId: z.string().min(1),
  });

  const handleCreateProduct = async (product: Product) => {
    try {
      console.log("Product before validation:", product);
      const validatedProduct = productSchema.parse({
        ...product,
        supplierId: product.supplierId?.trim() || "",
      });

      console.log("Validated Product:", validatedProduct);
      const newProduct = await CreateProduct({
        product: {
          ...validatedProduct,
          supplierId: validatedProduct.supplierId || "",
          id: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log("Product created successfully:", newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleEdit = (productId: string) => {
    console.log(productId);
  };

  const handleDelete = async (productId: string) => {
    // open a dialog to confirm the deletion
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirm) {
      // Call the server action
      await deleteProduct(productId);
    }
  };

  return (
    <div className="p-6 bg-gray-100 ">
      {shops && shops.length > 0 ? (
        shops.map((shop) => {
          // Filter products belonging to the current shop
          const shopProducts = products.filter(
            (product) => product.shopId === shop.id
          );

          return (
            <div key={shop.id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{shop.name}</h2>

              {shopProducts.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                  <table className="min-w-full border border-gray-300">
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
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => handleEdit(product.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:underline ml-4"
                              onClick={() => handleDelete(product.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-center">
                    <NewProduct
                      handleCreateProduct={handleCreateProduct}
                      shopId={shop.id}
                    />
                  </div>
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
