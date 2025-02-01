"use server";

import { createProduct } from "@/lib/actions/products/productsActions";
import { CreateProductProps } from "@/types/product";

const CreateProduct = async ({ product }: CreateProductProps) => {
  if (!product) {
    throw new Error("Product data is required");
  }

  try {
    const newProduct = await createProduct(product);
    if (!newProduct) {
      throw new Error("Failed to create product");
    }
    return newProduct;
  } catch (error) {
    console.error("Error in CreateProduct:", error);
    throw error;
  }
};

export default CreateProduct;
