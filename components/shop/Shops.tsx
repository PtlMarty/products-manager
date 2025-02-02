"use client";

import { useProducts } from "@/lib/hooks/useProducts";
import { Product, Shop } from "@prisma/client";
import { ShopProducts } from "./ShopProducts";

interface ShopsProps {
  shops: Shop[];
  initialProducts: Product[];
  userId: string;
}

export function Shops({ shops, initialProducts }: ShopsProps) {
  const { products, handleCreateProduct, handleDeleteProduct } =
    useProducts(initialProducts);

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
