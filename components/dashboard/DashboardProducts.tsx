import { Product, Shop, Supplier } from "@prisma/client";
import { ProductForm } from "../products/ProductForm";
import { ProductsTable } from "../products/ProductsTable";

interface DashboardProductsProps {
  products: Product[];
  shops: Shop[];
  suppliers: Supplier[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: Error }>;
  onSubmit: (product: Partial<Product>) => Promise<{
    success: boolean;
    data?: Product;
    error?: Error;
  }>;
}

export const DashboardProducts = ({
  products,
  shops,
  suppliers,
  onDelete,
  onSubmit,
}: DashboardProductsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <ProductsTable
            products={products}
            onDelete={onDelete}
            className="w-full"
            suppliers={suppliers}
            shops={shops}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <ProductForm
          shopId={shops[0].id}
          onSubmit={onSubmit}
          className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded hover:bg-blue-600 w-fit"
          suppliers={suppliers}
        />
      </div>
    </div>
  );
};
