import { Product, Shop, Supplier } from "@prisma/client";
import * as React from "react";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  shopId: z.string().min(1, "Shop ID is required"),
  supplierId: z.string().min(1, "Supplier ID is required"),
  stock: z.number().min(0, "Stock must be positive"),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface ProductActionResult {
  success: boolean;
  message: string;
  data?: Product;
}

export interface ProductsTableProps {
  products: Product[];
  suppliers: Supplier[];
  shops: Shop[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: Error }>;
  className?: string;
}

export interface ProductFormProps {
  shopId: string;
  suppliers: Supplier[];
  onSubmit: (
    product: Partial<Product>
  ) => Promise<{ success: boolean; data?: Product; error?: Error }>;
  trigger?: React.ReactNode;
  title?: string;
  className?: string;
}
