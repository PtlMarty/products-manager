import {
  createProduct,
  deleteProduct,
} from "@/lib/actions/products/productsActions";
import { Product } from "@prisma/client";
import { useState } from "react";

/**
 * Custom hook for managing product operations (create, delete, state management)
 * @param initialProducts - Initial array of products to populate the state
 * @returns Object containing products state and handler functions
 */
export const useProducts = (initialProducts: Product[] = []) => {
  // Initialize products state with sorted array (newest first)
  const [products, setProducts] = useState<Product[]>(
    [...initialProducts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  /**
   * Handles product deletion with confirmation
   * @param productId - ID of the product to delete
   * @returns Promise with success status and optional error
   */
  const handleDeleteProduct = async (
    productId: string
  ): Promise<{ success: boolean; error?: Error }> => {
    if (!window.confirm("Are you sure?")) return { success: false };

    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        // Update local state by filtering out the deleted product
        const updatedProducts = products.filter(
          (p: Product) => p.id !== productId
        );
        setProducts(updatedProducts);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Failed to delete product:", error);
      // Ensure error is always returned as Error instance
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to delete product"),
      };
    }
  };

  /**
   * Handles product creation
   * @param productData - Partial product data to create new product
   * @returns Promise with success status, optional created product data, and optional error
   */
  const handleCreateProduct = async (
    productData: Partial<Product>
  ): Promise<{ success: boolean; data?: Product; error?: Error }> => {
    try {
      const result = await createProduct(productData);
      if (result.success && result.data) {
        // Update local state with the newly created product
        setProducts([...products, result.data]);
        return { success: true, data: result.data };
      }
      return { success: false };
    } catch (error) {
      console.error("Failed to create product:", error);
      // Ensure error is always returned as Error instance
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to create product"),
      };
    }
  };

  // Return products state and handler functions
  return {
    products,
    setProducts,
    handleDeleteProduct,
    handleCreateProduct,
  };
};
