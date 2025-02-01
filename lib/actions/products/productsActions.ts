import db from "@/lib/db/db";
import { Product } from "@prisma/client";

export const deleteProduct = async (productId: string) => {
  try {
    const product = await db.product.delete({
      where: { id: productId },
    });
    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

export const createProduct = async (product: Product) => {
  if (!product) {
    throw new Error("Product data is required");
  }

  try {
    console.log("Attempting to create product:", product);
    const newProduct = await db.product.create({
      data: {
        name: product.name,
        price: product.price,
        supplierId: product.supplierId,
        shopId: product.shopId,
      },
    });
    return newProduct;
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
};
