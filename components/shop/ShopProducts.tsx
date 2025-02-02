import { ProductsTable } from "@/components/products/ProductsTable";
import { Product, Shop, Supplier } from "@prisma/client";
import { ProductForm } from "../products/ProductForm";

interface ShopProductsProps {
  shop: Shop;
  products: Product[];
  suppliers: Supplier[];
  onCreateProduct: (
    product: Partial<Product>
  ) => Promise<{ success: boolean; data?: Product; error?: Error }>;
  onDeleteProduct: (id: string) => Promise<{ success: boolean; error?: Error }>;
}

export function ShopProducts({
  shop,
  products,
  suppliers,
  onCreateProduct,
  onDeleteProduct,
}: ShopProductsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{shop.name}</h2>
      {products.length > 0 ? (
        <ProductsTable
          products={products}
          onDelete={onDeleteProduct}
          suppliers={suppliers}
        />
      ) : (
        <p className="text-gray-500">No products available for this shop.</p>
      )}
      <div className="flex justify-center mt-4">
        <ProductForm
          onSubmit={onCreateProduct}
          shopId={shop.id}
          suppliers={suppliers}
        />
      </div>
    </div>
  );
}
