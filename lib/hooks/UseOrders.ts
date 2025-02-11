"use client";

import { OrderFormData } from "@/components/orders/OrderForm";
import {
  createOrder,
  getOrdersByShopId,
} from "@/lib/actions/orders/ordersActions";
import { Order, OrderItem, Shop, User } from "@prisma/client";
import { useCallback, useState } from "react";

type OrderWithUser = Order & { user: User; shop: Shop };

type CreateOrderInput = Omit<Order, "id" | "createdAt" | "updatedAt"> & {
  orderItems: Omit<OrderItem, "id" | "orderId" | "createdAt" | "updatedAt">[];
};

export const useOrders = (
  shopId: string,
  allShops: Shop[] | undefined,
  initialOrders: OrderWithUser[]
) => {
  const [orders, setOrders] = useState<OrderWithUser[]>(initialOrders);

  const handleCreateOrder = useCallback(
    async (formData: OrderFormData) => {
      try {
        // Convert OrderFormData to CreateOrderInput
        const orderInput: CreateOrderInput = {
          shopId: formData.shopId || shopId, // Use form shopId if provided, otherwise use default
          supplierId: formData.supplierId,
          totalAmount: formData.totalAmount,
          status: formData.status,
          userId: "", // This will be set by the server
          orderItems: formData.orderItems,
        };

        const result = await createOrder(orderInput);
        if (result.success) {
          // Refresh orders by fetching them again
          if (allShops && allShops.length > 0) {
            const ordersPromises = allShops.map((shop) =>
              getOrdersByShopId({ shopId: shop.id })
            );
            const results = await Promise.all(ordersPromises);
            const newOrders = results
              .filter((result) => result.success && result.data)
              .flatMap((result) => result.data!)
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .slice(0, 10);
            setOrders(newOrders as OrderWithUser[]);
          } else {
            const result = await getOrdersByShopId({ shopId });
            if (result.success && result.data) {
              setOrders(result.data as OrderWithUser[]);
            }
          }
        }
        return result;
      } catch (error) {
        console.error("Error creating order:", error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error
              : new Error("Failed to create order"),
        };
      }
    },
    [shopId, allShops]
  );

  return {
    orders,
    handleCreateOrder,
  };
};
