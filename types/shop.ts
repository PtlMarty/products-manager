import { Shop as PrismaShop, Product, Supplier } from "@prisma/client";

export type Shop = PrismaShop;

export interface ShopProductsProps {
  shop: Shop;
  products: Product[];
  suppliers: Supplier[];
  onCreateProduct: (
    product: Partial<Product>
  ) => Promise<{ success: boolean; data?: Product; error?: Error }>;
  onDeleteProduct: (id: string) => Promise<{ success: boolean; error?: Error }>;
}
