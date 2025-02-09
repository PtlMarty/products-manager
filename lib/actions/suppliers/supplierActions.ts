//get suppliers

"use server";
import db from "@/lib/db/db";
import { getSession } from "../getSession";

export const getSuppliers = async () => {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  // Get suppliers that are linked to the user's shops
  const suppliers = await db.supplier.findMany({
    where: {
      shops: {
        some: {
          shop: {
            users: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return suppliers;
};

export const createSupplier = async (data: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  shopId: string;
}) => {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify user has access to the shop
  const userShop = await db.shopUser.findFirst({
    where: {
      userId: userId,
      shopId: data.shopId,
    },
  });

  if (!userShop) {
    throw new Error("Unauthorized: User does not have access to this shop");
  }

  // Create supplier and link it to the shop
  const supplier = await db.supplier.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      shops: {
        create: {
          shopId: data.shopId,
        },
      },
    },
  });

  return supplier;
};

export const updateSupplier = async (
  supplierId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }
) => {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify user has access to the supplier through their shops
  const supplierAccess = await db.supplier.findFirst({
    where: {
      id: supplierId,
      shops: {
        some: {
          shop: {
            users: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
    },
  });

  if (!supplierAccess) {
    throw new Error("Unauthorized: User does not have access to this supplier");
  }

  const updatedSupplier = await db.supplier.update({
    where: {
      id: supplierId,
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    },
  });

  return updatedSupplier;
};

export const deleteSupplier = async (supplierId: string) => {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify user has access to the supplier through their shops
  const supplierAccess = await db.supplier.findFirst({
    where: {
      id: supplierId,
      shops: {
        some: {
          shop: {
            users: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
    },
  });

  if (!supplierAccess) {
    throw new Error("Unauthorized: User does not have access to this supplier");
  }

  // Check if supplier has any products
  const supplierProducts = await db.product.findFirst({
    where: {
      supplierId: supplierId,
    },
  });

  if (supplierProducts) {
    throw new Error("Cannot delete supplier with existing products");
  }

  // Check if supplier has any orders
  const supplierOrders = await db.order.findFirst({
    where: {
      supplierId: supplierId,
    },
  });

  if (supplierOrders) {
    throw new Error("Cannot delete supplier with existing orders");
  }

  // Delete supplier and its relationships
  await db.shopSupplier.deleteMany({
    where: {
      supplierId: supplierId,
    },
  });

  const deletedSupplier = await db.supplier.delete({
    where: {
      id: supplierId,
    },
  });

  return deletedSupplier;
};

export const getSupplierById = async (supplierId: string) => {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const supplier = await db.supplier.findFirst({
    where: {
      id: supplierId,
      shops: {
        some: {
          shop: {
            users: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
    },
    include: {
      products: true,
      shops: {
        include: {
          shop: true,
        },
      },
    },
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
};

export const deleteSupplierWithProducts = async (supplierId: string) => {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify user has access to the supplier through their shops
  const supplierAccess = await db.supplier.findFirst({
    where: {
      id: supplierId,
      shops: {
        some: {
          shop: {
            users: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
    },
  });

  if (!supplierAccess) {
    throw new Error("Unauthorized: User does not have access to this supplier");
  }

  // Delete all products associated with the supplier
  await db.product.deleteMany({
    where: {
      supplierId: supplierId,
    },
  });

  // Delete supplier relationships
  await db.shopSupplier.deleteMany({
    where: {
      supplierId: supplierId,
    },
  });

  // Delete the supplier
  const deletedSupplier = await db.supplier.delete({
    where: {
      id: supplierId,
    },
  });

  return deletedSupplier;
};
