import {
  createProduct,
  deleteProduct,
} from "@/lib/actions/products/productsActions";
import { Product } from "@prisma/client";
import { useState } from "react";

export const useProducts = (initialProducts: Product[] = []) => {
  const [products, setProducts] = useState<Product[]>(
    [...initialProducts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  const handleDeleteProduct = async (
    productId: string
  ): Promise<{ success: boolean; error?: Error }> => {
    if (!window.confirm("Are you sure?")) return { success: false };

    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        const updatedProducts = products.filter(
          (p: Product) => p.id !== productId
        );
        setProducts(updatedProducts);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Failed to delete product:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to delete product"),
      };
    }
  };

  const handleCreateProduct = async (
    productData: Partial<Product>
  ): Promise<{ success: boolean; data?: Product; error?: Error }> => {
    try {
      const result = await createProduct(productData);
      if (result.success && result.data) {
        setProducts([...products, result.data]);
        return { success: true, data: result.data };
      }
      return { success: false };
    } catch (error) {
      console.error("Failed to create product:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to create product"),
      };
    }
  };

  return {
    products,
    setProducts,
    handleDeleteProduct,
    handleCreateProduct,
  };
};
