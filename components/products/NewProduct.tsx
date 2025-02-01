"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@prisma/client";
import React, { useState } from "react";

interface NewProductProps {
  handleCreateProduct: (product: Product) => Promise<void>;
  shopId: string;
}

const initialState = {
  name: "",
  price: 0,
  shopId: "",
};

export function NewProduct({ handleCreateProduct, shopId }: NewProductProps) {
  const [formData, setFormData] = useState({ ...initialState, shopId });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log("Submitting form data:", formData);
      await handleCreateProduct(formData as Product);
      setFormData({ ...initialState, shopId });
      setOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === "price" ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Product
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
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
              disabled={isLoading}
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
              disabled={isLoading}
              className="mt-1 block w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
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
