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
  const [formData, setFormData] = useState({ ...initialState, shopId });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const validatedData = productSchema.parse(formData);
      console.log("Validated Product Data:", validatedData);
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
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${className}`}
          >
            <Plus />
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <div>
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
              placeholder="Product Name"
              required
              className="mt-1 block w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              required
              className="mt-1 block w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="supplierId"
              className="block text-sm font-medium text-gray-700"
            >
              Supplier
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              required
              className="mt-1 block w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
