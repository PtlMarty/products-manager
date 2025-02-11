"use client";

import { OrderFormData } from "@/components/orders/OrderForm";
import {
  createOrder,
  deleteOrder,
  getOrdersByShopId,
} from "@/lib/actions/orders/ordersActions";
import { Order, Product, Shop, Supplier, User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

// Type definition extending Order to include related User, Shop, and Supplier data
type OrderWithUser = Order & { user: User; shop: Shop; supplier: Supplier };

// Hook for managing orders with products in a shop context
export const useOrders = (
  shopId: string, // ID of the current shop
  allShops: Shop[] | undefined, // List of all available shops
  initialOrders: OrderWithUser[], // Initial orders data
  initialProducts: Product[] // Initial products data
) => {
  // State management for orders and products
  const [orders, setOrders] = useState<OrderWithUser[]>(initialOrders);
  const [currentProducts, setCurrentProducts] =
    useState<Product[]>(initialProducts);

  // Update products when initial data changes
  useEffect(() => {
    if (initialProducts && Array.isArray(initialProducts)) {
      setCurrentProducts(initialProducts);
    }
  }, [initialProducts]);

  // Handler for creating new orders
  const handleCreateOrder = useCallback(
    async (formData: OrderFormData) => {
      try {
        // Validate product availability
        if (!currentProducts?.length) {
          throw new Error("No products available");
        }

        // Validate order items existence
        if (!formData.orderItems?.create?.length) {
          throw new Error("No items in order");
        }

        // Map and validate each product in the order
        const orderProducts = formData.orderItems.create.map((item) => {
          const product = currentProducts.find((p) => p.id === item.productId);
          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }
          return product;
        });

        // Prepare order input data
        const orderInput = {
          shopId: formData.shopId || shopId,
          totalAmount: formData.totalAmount,
          status: formData.status,
          supplierId: orderProducts[0].supplierId,
          orderItems: {
            create: formData.orderItems.create.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        };

        // Create order and refresh order list on success
        const result = await createOrder(orderInput);
        if (result.success) {
          const refreshResult = await getOrdersByShopId({ shopId });
          if (refreshResult.success && refreshResult.data) {
            setOrders(refreshResult.data as OrderWithUser[]);
          }
        }
        return result;
      } catch (error) {
        // Handle and return any errors during order creation
        return {
          success: false,
          error:
            error instanceof Error
              ? error
              : new Error("Failed to create order"),
        };
      }
    },
    [shopId, currentProducts]
  );

  // Handler for deleting orders
  const handleDeleteOrder = useCallback(
    async (order: Order) => {
      try {
        const result = await deleteOrder(order.id);
        if (result.success) {
          const refreshResult = await getOrdersByShopId({ shopId });
          if (refreshResult.success && refreshResult.data) {
            setOrders(refreshResult.data as OrderWithUser[]);
          }
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error
              : new Error("Failed to delete order"),
        };
      }
    },
    [shopId]
  );

  // Return hook state and handlers
  return {
    orders,
    handleCreateOrder,
    handleDeleteOrder,
  };
};
