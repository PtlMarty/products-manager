"use server";

import { executeAction } from "@/lib/actions/executeAction";
import db from "@/lib/db/db";
import { ProductActionResult, productSchema } from "@/types/product";
import { Product } from "@prisma/client";

export async function createProduct(
  product: Partial<Product>
): Promise<ProductActionResult> {
  return executeAction({
    actionFn: async () => {
      const validatedData = productSchema.parse(product);

      const newProduct = await db.product.create({
        data: validatedData,
      });

      return {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      };
    },
  });
}

export async function deleteProduct(
  productId: string
): Promise<ProductActionResult> {
  return executeAction({
    actionFn: async () => {
      const deletedProduct = await db.product.delete({
        where: { id: productId },
      });

      return {
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
      };
    },
  });
}
