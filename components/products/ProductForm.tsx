"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { productSchema } from "@/types/product";
import { Product, Supplier } from "@prisma/client";
import { Plus } from "lucide-react";
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
}

const initialState = {
  name: "",
  price: 0,
  shopId: "",
  supplierId: "",
};

export function ProductForm({
  shopId,
  suppliers,
  onSubmit,
  trigger,
  title = "Add New Product",
  className,
}: ProductFormProps) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({ ...initialState, shopId });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Only show the form in dashboard routes or specific shop routes
  const allowedRoutes = ["/dashboard/shops"];
  const isShopRoute = pathname?.startsWith("/dashboard/shops/");
  const shouldShowForm = allowedRoutes.includes(pathname || "") || isShopRoute;

  if (!shouldShowForm) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const validatedData = productSchema.parse(formData);
      await onSubmit(validatedData);
      setFormData({ ...initialState, shopId });
      setOpen(false);
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
    const newValue = name === "price" ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className={`inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${className}`}
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (¥)
            </label>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="supplierId"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Supplier
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer appearance-none"
            >
              <option value="" className="text-gray-500 text-lg">
                Select a supplier
              </option>
              {suppliers.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                  className="py-2 text-lg"
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
