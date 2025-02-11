import { ProductsTableProps } from "@/types/product";
import { Product } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import { BaseTable } from "../ui/organisms/base-table";

//TODO: Add stock, category, description, image, tags, attributes, variants to the products table

export function ProductsTable({
  data,
  onEdit,
  onDelete,
  isLoading,
  className,
  suppliers,
}: ProductsTableProps) {
  const columns = [
    {
      header: "Product Name",
      accessor: "name" as const,
    },
    {
      header: "Price (¥)",
      accessor: (product: Product) => `¥${product.price}`,
    },
    {
      header: "Stock",
      accessor: "stock" as const,
    },
    {
      header: "Supplier",
      accessor: (product: Product) =>
        suppliers.find((s) => s.id === product.supplierId)?.name || "N/A",
    },
    {
      header: "Created At",
      accessor: (product: Product) =>
        new Date(product.createdAt).toLocaleDateString(),
    },
  ];

  const actions = [
    {
      icon: <Pencil size={16} />,
      onClick: (product: Product) => onEdit?.(product),
      label: "Edit product",
      className: "text-gray-600 hover:text-gray-800 transition-colors",
    },
    {
      icon: <Trash2 size={16} />,
      onClick: (product: Product) => onDelete?.(product),
      label: "Delete product",
      className: "text-red-600 hover:text-red-800 transition-colors",
    },
  ];

  return (
    <BaseTable<Product>
      data={data}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      className={className}
      emptyMessage="No products found"
      mobileAccessor={(product) => product.name}
    />
  );
}
