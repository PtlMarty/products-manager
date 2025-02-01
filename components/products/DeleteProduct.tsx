"use server";

import { deleteProduct } from "@/lib/actions/products/productsActions";

const DeleteProduct = async (productId: string) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const deletedProduct = await deleteProduct(productId);
    return deletedProduct;
  } catch (error) {
    console.error("Error in DeleteProduct:", error);
    throw error;
  }
};

export default DeleteProduct;
