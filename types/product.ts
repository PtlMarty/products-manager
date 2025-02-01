import { Product } from "@prisma/client";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  shopId: z.string().min(1, "Shop ID is required"),
  supplierId: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface ProductActionResult {
  success: boolean;
  message: string;
  data?: Product;
}
