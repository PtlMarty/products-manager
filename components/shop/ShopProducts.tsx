import { ProductForm } from "@/components/products/ProductForm";
import { ProductsTable } from "@/components/products/ProductsTable";
import { ShopProductsProps } from "@/types/shop";

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
          data={products.map((product) => ({ ...product, description: "" }))}
          onDelete={(product) => onDeleteProduct(product.id)}
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
