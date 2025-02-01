import db from "@/lib/db/db";
import { Product } from "@prisma/client";

export const deleteProduct = async (productId: string) => {
  try {
    return await db.product.delete({
      where: { id: productId },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const createProduct = async (product: Product) => {
  if (!product) {
    throw new Error("Product data is required");
  }

  try {
    return await db.product.create({
      data: {
        name: product.name,
        price: product.price,
        supplierId: product.supplierId,
        shopId: product.shopId,
      },
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
};
