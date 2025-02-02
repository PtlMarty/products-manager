"use client";

import { useProducts } from "@/lib/hooks/useProducts";
import { Product, Shop, Supplier } from "@prisma/client";
import { ShopProducts } from "./ShopProducts";

interface ShopsProps {
  shops: Shop[];
  initialProducts: Product[];
  suppliers: Supplier[];
  userId: string;
}

export function Shops({ shops, initialProducts, suppliers }: ShopsProps) {
  const { products, handleCreateProduct, handleDeleteProduct } =
    useProducts(initialProducts);

  if (!shops?.length) {
    return <div className="text-gray-600">No shops available.</div>;
  }

  return (
    <div className="flex flex-col gap-4 bg-gray-100">
      {shops.map((shop) => (
        <ShopProducts
          key={shop.id}
          shop={shop}
          products={products.filter((p) => p.shopId === shop.id)}
          onCreateProduct={handleCreateProduct}
          onDeleteProduct={handleDeleteProduct}
          suppliers={suppliers}
        />
      ))}
    </div>
  );
}

export default Shops;
