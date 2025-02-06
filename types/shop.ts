import { Shop as PrismaShop, Product, Supplier } from "@prisma/client";
import { z } from "zod";
export type Shop = PrismaShop;

export const shopSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export interface ShopProductsProps {
  shop: Shop;
  products: Product[];
  suppliers: Supplier[];
  onCreateProduct: (
    product: Partial<Product>
  ) => Promise<{ success: boolean; data?: Product; error?: Error }>;
  onDeleteProduct: (id: string) => Promise<{ success: boolean; error?: Error }>;
}

export interface ShopActionResult {
  success: boolean;
  message: string;
  data?: Shop;
}
