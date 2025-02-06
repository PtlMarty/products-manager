import {
  createShop,
  deleteShop,
  getUserShops,
} from "@/lib/actions/Shop/shopActions";
import { Shop } from "@prisma/client";
import { useEffect, useState } from "react";

/**
 * Custom hook for managing shop operations (create, delete, state management)
 * @param initialShops - Initial array of shops to populate the state
 * @returns Object containing shops state and handler functions
 */
export const useShops = (initialShops: Shop[] = []) => {
  // Initialize shops state with sorted array (newest first)
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch shops on mount
  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const result = await getUserShops();
        if (result.success && result.shops) {
          setShops(result.shops);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch shops");
      } finally {
        setLoading(false);
      }
    };

    if (initialShops.length === 0) {
      fetchShops();
    }
  }, [initialShops.length]);

  /**
   * Handles shop deletion with confirmation
   * @param shopId - ID of the shop to delete
   * @returns Promise with success status and optional error
   */
  const handleDeleteShop = async (
    shopId: string
  ): Promise<{ success: boolean; error?: Error }> => {
    if (!window.confirm("Are you sure you want to delete this shop?")) {
      return { success: false };
    }

    try {
      const result = await deleteShop(shopId);
      if (result.success && result.data) {
        // Update local state by filtering out the deleted shop
        const updatedShops = shops.filter((s: Shop) => s.id !== shopId);
        setShops(updatedShops);
        return { success: true };
      }
      return { success: false, error: new Error(result.message) };
    } catch (error) {
      console.error("Failed to delete shop:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error : new Error("Failed to delete shop"),
      };
    }
  };

  /**
   * Handles shop creation
   * @param name - Name of the shop to create
   * @returns Promise with success status, optional created shop data, and optional error
   */
  const handleCreateShop = async (
    name: string
  ): Promise<{ success: boolean; data?: Shop; error?: Error }> => {
    try {
      const result = await createShop(name);
      if (result.success && result.data) {
        // Update local state with the newly created shop
        setShops([result.data, ...shops]);
        return { success: true, data: result.data };
      }
      return { success: false, error: new Error(result.message) };
    } catch (error) {
      console.error("Failed to create shop:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error : new Error("Failed to create shop"),
      };
    }
  };

  // Return shops state and handler functions
  return {
    shops,
    loading,
    error,
    setShops,
    handleDeleteShop,
    handleCreateShop,
  };
};
