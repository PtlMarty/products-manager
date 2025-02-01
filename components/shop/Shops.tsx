"use client";

import {
  createProduct,
  deleteProduct,
} from "@/lib/actions/products/productsActions";
import { Product, Shop } from "@prisma/client";
import { useState } from "react";
import { ShopProducts } from "./ShopProducts";

interface ShopsProps {
  shops: Shop[];
  initialProducts: Product[];
  userId: string;
}

export function Shops({ shops, initialProducts }: ShopsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleCreateProduct = async (productData: Partial<Product>) => {
    try {
      console.log("Creating product with data:", productData);
      const result = await createProduct(productData);
      console.log("Create product result:", result);

      if (result.success && result.data) {
        setProducts((prev) => {
          const newProducts = [...prev, result.data as Product];
          console.log("Updating products state:", newProducts);
          return newProducts;
        });
      } else {
        console.error("Failed to create product:", result.message);
      }
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        setProducts(
          (prev) => prev.filter((p) => p.id !== productId) as Product[]
        );
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (!shops?.length) {
    return <div className="text-gray-600">No shops available.</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      {shops.map((shop) => (
        <ShopProducts
          key={shop.id}
          shop={shop}
          products={products.filter((p) => p.shopId === shop.id)}
          onCreateProduct={handleCreateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      ))}
    </div>
  );
}

export default Shops;
