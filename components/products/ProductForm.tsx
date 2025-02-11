"use client";

//TODO: Add a stock field to the product form
//TODO: Add a category field to the product form
//TODO: Add a description field to the product form
//TODO: Add a image field to the product form
//TODO: Add a tags field to the product form
//TODO: Add a attributes field to the product form
//TODO: Add a variants field to the product form

import {
  BaseFormDialog,
  FormField,
  inputStyles,
  selectStyles,
} from "@/components/ui/organisms/base-form-dialog";
import { productSchema } from "@/types/product";
import { Product, Supplier } from "@prisma/client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface ProductFormProps {
  shopId: string;
  suppliers: Supplier[];
  onSubmit: (
    product: Partial<Product>
  ) => Promise<{ success: boolean; data?: Product; error?: Error }>;
  trigger?: React.ReactNode;
  title?: string;
  className?: string;
  initialData?: Product;
  standalone?: boolean;
}

const initialState = {
  name: "",
  price: 0,
  shopId: "",
  supplierId: "",
  stock: 0,
};

export function ProductForm({
  shopId,
  suppliers,
  onSubmit,
  trigger,
  title = "Add New Product",
  className,
  initialData,
  standalone = true,
}: ProductFormProps) {
  const pathname = usePathname();
  const [formData, setFormData] = useState(
    initialData || { ...initialState, shopId }
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Only show the form in dashboard routes or specific shop routes
  const allowedRoutes = ["/dashboard/shops"];
  const isShopRoute = pathname?.startsWith("/dashboard/shops/");
  const shouldShowForm = allowedRoutes.includes(pathname || "") || isShopRoute;

  if (!shouldShowForm) return null;

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const validatedData = productSchema.parse(formData);
      const result = await onSubmit(validatedData);
      if (result.success) {
        setFormData({ ...initialState, shopId });
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Form error:", error);
      setError(error instanceof Error ? error.message : "Invalid form data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let newValue: string | number = value;

    // Handle numeric fields
    if (name === "price" || name === "stock") {
      newValue = parseFloat(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setError(null);
  };

  return (
    <BaseFormDialog
      title={title}
      trigger={trigger}
      className={className}
      standalone={standalone}
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
      submitLabel={{
        default: initialData ? "Update Product" : "Create Product",
        loading: initialData ? "Updating..." : "Creating...",
      }}
    >
      <FormField label="Product Name" htmlFor="name">
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
          className={inputStyles}
        />
      </FormField>

      <FormField label="Price (¥)" htmlFor="price">
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          required
          className={inputStyles}
        />
      </FormField>

      <FormField label="Stock" htmlFor="stock">
        <input
          id="stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Enter stock"
          required
          className={inputStyles}
        />
      </FormField>

      <FormField label="Supplier" htmlFor="supplierId">
        <select
          id="supplierId"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          required
          className={selectStyles}
        >
          <option value="" className="text-gray-500">
            Select a supplier
          </option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </FormField>
    </BaseFormDialog>
  );
}
