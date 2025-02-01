"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { productSchema } from "@/types/product";
import { Product } from "@prisma/client";
import React, { useState } from "react";

interface ProductFormProps {
  shopId: string;
  onSubmit: (product: Partial<Product>) => Promise<void>;
  trigger?: React.ReactNode;
}

const initialState = {
  name: "",
  price: 0,
  shopId: "",
};

export function ProductForm({ shopId, onSubmit, trigger }: ProductFormProps) {
  const [formData, setFormData] = useState({ ...initialState, shopId });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const validatedData = productSchema.parse(formData);
      console.log("Validated Product Data:", validatedData);
      await onSubmit(validatedData);
      setFormData({ ...initialState, shopId });
      setOpen(false);
    } catch (error) {
      console.error("Form error:", error);
      setError(error instanceof Error ? error.message : "Invalid form data");
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
        {trigger || (
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Product
          </button>
        )}
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
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Create Product
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
