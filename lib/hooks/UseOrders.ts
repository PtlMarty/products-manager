import {
  createOrder,
  getOrderById,
  getOrdersByShopId,
} from "@/lib/actions/orders/ordersActions";
import { Order, OrderItem, User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

type OrderWithUser = Order & { user: User };

type CreateOrderInput = Omit<Order, "id" | "createdAt" | "updatedAt"> & {
  orderItems: Omit<OrderItem, "id" | "orderId" | "createdAt" | "updatedAt">[];
};

export const useOrders = (shopId?: string) => {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersByShop = useCallback(async (shopId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getOrdersByShopId({ shopId });

      if (result.success && result.data) {
        setOrders(result.data as OrderWithUser[]);
        return { success: true, data: result.data };
      } else {
        const errorMsg = result.error || "Failed to fetch orders";
        setError(errorMsg);
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to fetch orders";
      setError(errorMsg);
      return { success: false, error: new Error(errorMsg) };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getOrderById({ id: orderId });

      if (result.success && result.data) {
        return { success: true, data: result.data };
      } else {
        const errorMsg = result.error || "Failed to fetch order";
        setError(errorMsg);
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to fetch order";
      setError(errorMsg);
      return { success: false, error: new Error(errorMsg) };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateOrder = useCallback(
    async (order: CreateOrderInput) => {
      try {
        setLoading(true);
        const result = await createOrder(order);
        if (result.success && shopId) {
          await fetchOrdersByShop(shopId);
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
      } finally {
        setLoading(false);
      }
    },
    [shopId, fetchOrdersByShop]
  );

  useEffect(() => {
    if (shopId) {
      fetchOrdersByShop(shopId);
    }
  }, [shopId, fetchOrdersByShop]);

  return {
    orders,
    loading,
    error,
    handleCreateOrder,
    setOrders,
    fetchOrdersByShop,
    fetchOrderById,
  };
};
