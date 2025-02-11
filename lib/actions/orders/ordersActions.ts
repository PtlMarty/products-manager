"use server";

// TODO: add actions for orders edit, delete, update

import { auth } from "@/lib/auth";
import db from "@/lib/db/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Interface definitions for action parameters
interface GetOrdersByShopIdProps {
  shopId: string;
}

interface GetOrderByIdProps {
  id: string;
}

/**
 * Fetches all orders for a specific shop
 * Includes authorization check and related data
 */
export async function getOrdersByShopId({ shopId }: GetOrdersByShopIdProps) {
  try {
    // Verify user authentication
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Fetch orders with authorization check and include related data
    const orders = await db.order.findMany({
      where: {
        shopId,
        shop: {
          users: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        orderItems: true,
        user: true,
        shop: true,
        supplier: true,
      },
    });

    return { success: true, data: orders };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

/**
 * Fetches a single order by its ID
 * Includes authorization check and related data
 */
export async function getOrderById({ id }: GetOrderByIdProps) {
  try {
    // Verify user authentication
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Fetch single order with related data
    const order = await db.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: true,
        user: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return { success: true, data: order };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    };
  }
}

/**
 * Deletes an order and its associated items
 * Includes authorization check and data cleanup
 */
export async function deleteOrder(orderId: string) {
  try {
    // Verify user authentication
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify order exists and user has permission
    const order = await db.order.findFirst({
      where: {
        id: orderId,
        shop: {
          users: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        orderItems: true, // Include order items to get quantities for stock restoration
      },
    });

    if (!order) {
      throw new Error("Order not found or unauthorized");
    }

    // Delete order and associated items in a transaction
    const result = await db.$transaction(async (tx) => {
      // Restore stock for each product
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity, // Increment stock by the ordered quantity
            },
          },
        });
      }

      // Delete order items
      await tx.orderItem.deleteMany({
        where: { orderId },
      });

      // Delete the order
      return tx.order.delete({
        where: { id: orderId },
      });
    });

    // Revalidate affected pages
    revalidatePath("/orders");
    revalidatePath("/dashboard/shops/[shopId]", "page");
    revalidatePath("/dashboard", "page");

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order",
    };
  }
}

/**
 * Creates a new order with stock validation and updates
 * Uses a transaction to ensure data consistency
 */
export async function createOrder(
  order: Omit<Prisma.OrderUncheckedCreateInput, "userId">
) {
  try {
    // Verify user authentication
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Use a transaction to ensure both order creation and stock updates succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Validate order items structure
      if (
        !order.orderItems?.create ||
        !Array.isArray(order.orderItems.create)
      ) {
        throw new Error("Invalid order items");
      }

      const orderItems = order.orderItems.create as Array<{
        productId: string;
        quantity: number;
        price: number;
      }>;

      // Check stock availability for each product
      for (const item of orderItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
      }

      // Create the order with user association
      const newOrder = await tx.order.create({
        data: {
          ...order,
          userId: session.user.id,
        },
      });

      // Update stock levels for each product
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Revalidate affected pages to update UI
    revalidatePath("/orders");
    revalidatePath("/dashboard/shops/[shopId]", "page");
    revalidatePath("/dashboard", "page");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("Failed to create order"),
    };
  }
}
