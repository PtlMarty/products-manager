import {
  getOrderById,
  getOrdersByShopId,
} from "@/lib/actions/orders/ordersActions";
import { Order, User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

type OrderWithUser = Order & { user: User };

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
        setError(result.error || "Failed to fetch orders");
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
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
        setError(result.error || "Failed to fetch order");
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch order";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shopId) {
      fetchOrdersByShop(shopId);
    }
  }, [shopId, fetchOrdersByShop]);

  return {
    orders,
    loading,
    error,
    setOrders,
    fetchOrdersByShop,
    fetchOrderById,
  };
};
