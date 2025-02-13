"use client";

import { Input } from "@/components/ui/atoms/input";
import {
  BaseFormDialog,
  FormField,
  selectStyles,
} from "@/components/ui/organisms/base-form-dialog";
import { Order, OrderStatus, Product, Shop, Supplier } from "@prisma/client";
import { Plus, Search, Trash2 } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import React, { useState } from "react";

// Interface for order form data structure
export interface OrderFormData {
  totalAmount: number;
  status: OrderStatus;
  shopId: string;
  orderItems: {
    create: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
  };
}

// Props interface for the OrderForm component
interface OrderFormProps {
  shopId: string;
  products: Product[];
  suppliers?: Supplier[];
  shops?: Shop[];
  session: Session | null;
  onSubmit: (
    order: OrderFormData
  ) => Promise<{ success: boolean; data?: Order; error?: Error }>;
  trigger?: React.ReactNode;
  title?: string;
  className?: string;
  initialData?: Order;
  standalone?: boolean;
}

// Initial state for the order form
const initialState: OrderFormData = {
  totalAmount: 0,
  status: OrderStatus.PENDING,
  shopId: "",
  orderItems: {
    create: [],
  },
};

/**
 * Product search combobox component
 * Provides search functionality for products
 */
function ProductCombobox({
  products,
  value = "",
  onChange,
}: {
  products: Product[];
  value?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter products based on search input
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="border rounded-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus:ring-0 focus:outline-none"
            placeholder="Search products..."
            onFocus={() => setOpen(true)}
          />
        </div>
        {open && (
          <div className="absolute w-full bg-white border rounded-b-md shadow-lg max-h-64 overflow-y-auto z-50">
            <div role="listbox">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  role="option"
                  aria-selected={value === product.id}
                  onClick={() => {
                    onChange(product.id);
                    setOpen(false);
                  }}
                  className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">¥{product.price}</div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Product card component for displaying selected products
 * Shows product details and quantity controls
 */
function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: {
  product: Product;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{product.name}</h4>
          <div className="text-sm text-gray-500 mt-1">
            <span>Stock: {product.stock}</span>
            <span className="mx-2">•</span>
            <span>Price: ¥{product.price}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="mt-3">
        <label className="text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value))}
          className="mt-1 w-24 px-2 py-1 border rounded"
        />
        {quantity > product.stock && (
          <p className="text-sm text-red-500 mt-1">
            Exceeds available stock ({product.stock})
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Main OrderForm component
 * Handles creation and editing of orders
 */
export function OrderForm({
  shopId,
  products = [],
  shops,
  session,
  onSubmit,
  trigger,
  title = "Create New Order",
  className,
  initialData,
  standalone = true,
}: OrderFormProps) {
  // Form state management
  const [formData, setFormData] = useState<OrderFormData>(
    initialData
      ? {
          totalAmount: initialData.totalAmount,
          status: initialData.status,
          shopId: initialData.shopId,
          orderItems: {
            create: [],
          },
        }
      : { ...initialState, shopId }
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validation checks
  if (!Array.isArray(products)) {
    console.error("[OrderForm] Products is not an array:", products);
    return (
      <div className="p-4 text-center text-gray-500">
        Error: Invalid products data. Please refresh the page.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Cannot create order: No products available.
      </div>
    );
  }

  // Helper function to calculate total amount
  const calculateTotal = (items: { quantity: number; price: number }[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Form submission handler
  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Validation checks
      if (!formData) {
        throw new Error("Form data is missing");
      }

      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      if (!formData.orderItems?.create?.length) {
        throw new Error("Please add at least one item to the order");
      }

      // Validate and process order items
      const validatedOrderItems = formData.orderItems.create.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        };
      });

      // Calculate total amount
      const totalAmount = calculateTotal(validatedOrderItems);

      // Prepare order data
      const orderData: OrderFormData = {
        totalAmount,
        status: formData.status,
        shopId: formData.shopId || shopId,
        orderItems: {
          create: validatedOrderItems,
        },
      };

      // Submit order and handle response
      const result = await onSubmit(orderData);

      if (result.success) {
        setFormData({ ...initialState, shopId });
      } else {
        throw new Error(result.error?.message || "Failed to create order");
      }
    } catch (error) {
      console.error("[handleSubmit] Error:", error);
      setError(error instanceof Error ? error.message : "Invalid form data");
    } finally {
      setIsLoading(false);
    }
  };

  // Form field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Order item management functions
  const addOrderItem = () => {
    setFormData((prev) => ({
      ...prev,
      orderItems: {
        create: [
          ...prev.orderItems.create,
          { productId: "", quantity: 1, price: 0 },
        ],
      },
    }));
  };

  const updateOrderItem = (
    index: number,
    field: "productId" | "quantity" | "price",
    value: string | number
  ) => {
    setFormData((prev) => {
      const newItems = [...prev.orderItems.create];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === "productId") {
        const product = products.find((p) => p.id === value);
        if (product) {
          newItems[index].price = product.price;
        }
      }

      const totalAmount = calculateTotal(newItems);
      return {
        ...prev,
        orderItems: { create: newItems },
        totalAmount,
      };
    });
  };

  const removeOrderItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      orderItems: {
        create: prev.orderItems.create.filter((_, i) => i !== index),
      },
    }));
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
        default: initialData ? "Update Order" : "Create Order",
        loading: initialData ? "Updating..." : "Creating...",
      }}
    >
      {shops && (
        <FormField label="Shop" htmlFor="shopId">
          {shops.length > 0 ? (
            <select
              id="shopId"
              name="shopId"
              value={formData.shopId}
              onChange={handleChange}
              required
              className={selectStyles}
            >
              <option value="">Select a shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-center py-4 border-2 border-dashed rounded-lg">
              <p className="text-sm text-gray-500">No shops available</p>
              <Link
                href="/dashboard/shops/new"
                className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create your first shop
              </Link>
            </div>
          )}
        </FormField>
      )}

      <FormField label="Status" htmlFor="status">
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className={selectStyles}
        >
          {Object.values(OrderStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </FormField>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Order Items
          </label>
          <button
            type="button"
            onClick={addOrderItem}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="max-h-[40vh] overflow-y-auto pr-2">
          {formData.orderItems.create.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
              <p>No items added to the order yet</p>
              <button
                type="button"
                onClick={addOrderItem}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Add your first item
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.orderItems.create.map((item, index: number) => {
                const selectedProduct = products.find(
                  (p) => p.id === item.productId
                );
                return (
                  <div key={index}>
                    {!selectedProduct ? (
                      <div className="mb-2">
                        <ProductCombobox
                          products={products}
                          value={item.productId}
                          onChange={(productId) =>
                            updateOrderItem(index, "productId", productId)
                          }
                        />
                      </div>
                    ) : (
                      <ProductCard
                        product={selectedProduct}
                        quantity={item.quantity}
                        onQuantityChange={(quantity) =>
                          updateOrderItem(index, "quantity", quantity)
                        }
                        onRemove={() => removeOrderItem(index)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Total Items:</span>
          <span className="font-medium">
            {formData.orderItems.create.length}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-700">Total Amount:</span>
          <span className="text-lg font-semibold">
            ¥{calculateTotal(formData.orderItems.create)}
          </span>
        </div>
      </div>
    </BaseFormDialog>
  );
}
