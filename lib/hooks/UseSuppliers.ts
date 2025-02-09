"use client";

import {
  createSupplier,
  deleteSupplier,
  deleteSupplierWithProducts,
  getSupplierById,
  getSuppliers,
  updateSupplier,
} from "@/lib/actions/suppliers/supplierActions";
import { Supplier } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export { type Supplier };

export const useSuppliers = (initialSuppliers?: Supplier[]) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>(
    initialSuppliers || []
  );
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);

  // Fetch all suppliers
  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      toast.error("Failed to fetch suppliers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch suppliers on mount only if no initial suppliers
  useEffect(() => {
    if (!initialSuppliers) {
      fetchSuppliers();
    }
  }, [fetchSuppliers, initialSuppliers]);

  // Fetch a single supplier
  const fetchSupplierById = useCallback(async (supplierId: string) => {
    try {
      setLoading(true);
      const data = await getSupplierById(supplierId);
      setCurrentSupplier(data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch supplier");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new supplier
  const addSupplier = useCallback(
    async (data: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      shopId: string;
    }) => {
      try {
        setLoading(true);
        const newSupplier = await createSupplier(data);
        setSuppliers((prev) => [newSupplier, ...prev]);
        toast.success("Supplier created successfully");
        router.refresh();
        // Refetch suppliers to ensure we have the latest data
        await fetchSuppliers();
        return newSupplier;
      } catch (error) {
        toast.error("Failed to create supplier");
        console.error(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [router, fetchSuppliers]
  );

  // Update a supplier
  const editSupplier = useCallback(
    async (
      supplierId: string,
      data: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
      }
    ) => {
      try {
        setLoading(true);
        const updatedSupplier = await updateSupplier(supplierId, data);
        setSuppliers((prev) =>
          prev.map((supplier) =>
            supplier.id === supplierId ? updatedSupplier : supplier
          )
        );
        setCurrentSupplier(updatedSupplier);
        toast.success("Supplier updated successfully");
        router.refresh();
        return updatedSupplier;
      } catch (error) {
        toast.error("Failed to update supplier");
        console.error(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Delete a supplier
  const removeSupplier = useCallback(
    async (supplierId: string, deleteWithProducts: boolean = false) => {
      try {
        // Check if supplier has products before attempting to delete
        const supplier = await getSupplierById(supplierId);
        if (supplier?.products && supplier.products.length > 0) {
          if (!deleteWithProducts) {
            toast.error(
              "This supplier has existing products. Use 'Delete with Products' to remove everything."
            );
            return false;
          }

          // Delete supplier with all its products
          setLoading(true);
          await deleteSupplierWithProducts(supplierId);
          setSuppliers((prev) =>
            prev.filter((supplier) => supplier.id !== supplierId)
          );
          if (currentSupplier?.id === supplierId) {
            setCurrentSupplier(null);
          }
          toast.success(
            "Supplier and all associated products deleted successfully"
          );
          router.refresh();
          return true;
        }

        // Regular delete for supplier without products
        setLoading(true);
        await deleteSupplier(supplierId);
        setSuppliers((prev) =>
          prev.filter((supplier) => supplier.id !== supplierId)
        );
        if (currentSupplier?.id === supplierId) {
          setCurrentSupplier(null);
        }
        toast.success("Supplier deleted successfully");
        router.refresh();
        return true;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to delete supplier");
        }
        console.error(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentSupplier?.id, router]
  );

  return {
    // States
    suppliers,
    currentSupplier,
    loading,

    // Actions
    fetchSuppliers,
    fetchSupplierById,
    addSupplier,
    editSupplier,
    removeSupplier,
  };
};
