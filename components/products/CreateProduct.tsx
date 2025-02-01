"use server";

import { createProduct } from "@/lib/actions/products/productsActions";
import { Product } from "@prisma/client";

type CreateProductProps = {
  product: Product;
};

const CreateProduct = async ({ product }: CreateProductProps) => {
  if (!product) {
    throw new Error("Product data is required");
  }

  try {
    console.log("Creating product with data:", product); // Add logging
    const newProduct = await createProduct(product);

    if (!newProduct) {
      throw new Error("Failed to create product");
    }

    return newProduct;
  } catch (error) {
    console.error("Error in CreateProduct:", error);
    throw error; // Throw the original error for better debugging
  }
};

export default CreateProduct;
