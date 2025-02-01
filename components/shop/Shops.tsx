"use client";

import CreateProduct from "@/components/products/CreateProduct";
import DeleteProduct from "@/components/products/DeleteProduct";
import { ShopProducts } from "@/components/shop/ShopProducts";
import { productSchema } from "@/types/product";
import { Product, Shop } from "@prisma/client";
import { useState } from "react";

interface ShopsProps {
  userId: string;
  products: Product[];
  shops: Shop[];
}

export default function Shops({
  products: initialProducts,
  shops,
}: ShopsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleCreateProduct = async (product: Product) => {
    try {
      const validatedProduct = productSchema.parse({
        ...product,
        supplierId: product.supplierId?.trim() || "",
      });

      const newProduct = await CreateProduct({
        product: {
          ...validatedProduct,
          supplierId: validatedProduct.supplierId || "",
          id: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      setProducts((prevProducts) => [...prevProducts, newProduct]);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await DeleteProduct(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (!shops?.length) {
    return <div className="text-gray-600 text-center">No shops available.</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      {shops.map((shop) => (
        <ShopProducts
          key={shop.id}
          shop={shop}
          products={products.filter((p) => p.shopId === shop.id)}
          onCreateProduct={handleCreateProduct}
          onDeleteProduct={handleDelete}
        />
      ))}
    </div>
  );
}
