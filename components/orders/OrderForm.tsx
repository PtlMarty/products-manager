"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/organisms/dialog";
import { Order, OrderStatus, Product, Shop, Supplier } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderFormData {
  totalAmount: number;
  status: OrderStatus;
  shopId: string;
  supplierId: string;
  orderItems: OrderItem[];
}

interface OrderFormProps {
  shopId: string;
  products: Product[];
  suppliers: Supplier[];
  shops?: Shop[];
  onSubmit: (
    order: OrderFormData
  ) => Promise<{ success: boolean; data?: Order; error?: Error }>;
  trigger?: React.ReactNode;
  title?: string;
  className?: string;
  initialData?: Order;
  standalone?: boolean;
}

const initialState: OrderFormData = {
  totalAmount: 0,
  status: OrderStatus.PENDING,
  shopId: "",
  supplierId: "",
  orderItems: [],
};

export function OrderForm({
  shopId,
  products = [],
  suppliers = [],
  shops,
  onSubmit,
  trigger,
  title = "Create New Order",
  className,
  initialData,
  standalone = true,
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>(
    initialData
      ? {
          totalAmount: initialData.totalAmount,
          status: initialData.status,
          shopId: initialData.shopId,
          supplierId: initialData.supplierId,
          orderItems: [], // Initialize empty, you'll need to fetch order items separately if needed
        }
      : { ...initialState, shopId }
  );
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (formData.orderItems.length === 0) {
        throw new Error("Please add at least one product to the order");
      }

      const result = await onSubmit(formData);

      if (result.success) {
        setFormData({ ...initialState, shopId });
        setOpen(false);
      } else {
        setError(result.error?.message || "Failed to create order");
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const addOrderItem = () => {
    setFormData((prev) => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        { productId: "", quantity: 1, price: 0 },
      ],
    }));
  };

  const updateOrderItem = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newItems = [...prev.orderItems];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === "productId") {
        const product = products.find((p) => p.id === value);
        if (product) {
          newItems[index].price = product.price;
        }
      }

      const totalAmount = calculateTotal(newItems);
      return { ...prev, orderItems: newItems, totalAmount };
    });
  };

  const removeOrderItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index),
    }));
  };

  // Add early return if required props are missing
  if (!products.length || !suppliers.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        Cannot create order: {!products.length ? "No products available. " : ""}
        {!suppliers.length ? "No suppliers available." : ""}
      </div>
    );
  }

  const formContent = (
    <>
      {title && (
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>
      )}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        {shops && shops.length > 0 && (
          <div className="space-y-2">
            <label
              htmlFor="shopId"
              className="block text-sm font-medium text-gray-700"
            >
              Shop
            </label>
            <select
              id="shopId"
              name="shopId"
              value={formData.shopId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="space-y-2">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.values(OrderStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Order Items
            </label>
            <button
              type="button"
              onClick={addOrderItem}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Item
            </button>
          </div>

          {formData.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-2 items-start p-3 border rounded-md"
            >
              <div className="flex-1">
                <select
                  value={item.productId}
                  onChange={(e) =>
                    updateOrderItem(index, "productId", e.target.value)
                  }
                  required
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ¥{product.price}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateOrderItem(index, "quantity", parseInt(e.target.value))
                }
                required
                className="w-20 px-2 py-1 border rounded"
                placeholder="Qty"
              />
              <button
                type="button"
                onClick={() => removeOrderItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="text-right text-lg font-semibold">
          Total: ¥{calculateTotal(formData.orderItems)}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {standalone && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? initialData
                ? "Updating..."
                : "Creating..."
              : initialData
              ? "Update Order"
              : "Create Order"}
          </button>
        </div>
      </form>
    </>
  );

  if (!standalone) {
    return formContent;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className={`inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${className}`}
          >
            <Plus className="h-5 w-5" />
            <span>{initialData ? "Edit Order" : "Create Order"}</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">{formContent}</DialogContent>
    </Dialog>
  );
}
