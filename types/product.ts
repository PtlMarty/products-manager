import { Product } from "@prisma/client";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  supplierId: z.string().min(1).optional(),
  shopId: z.string().min(1),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface CreateProductProps {
  product: Product;
}
