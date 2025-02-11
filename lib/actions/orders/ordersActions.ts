"use server";

// TODO: add actions for orders edit, delete, update

import { auth } from "@/lib/auth";
import db from "@/lib/db/db";
import { Order, OrderItem } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface GetOrdersByShopIdProps {
  shopId: string;
}

interface GetOrderByIdProps {
  id: string;
}

interface CreateOrderInput
  extends Omit<Order, "id" | "createdAt" | "updatedAt"> {
  orderItems: Omit<OrderItem, "id" | "orderId" | "createdAt" | "updatedAt">[];
}

export async function getOrdersByShopId({ shopId }: GetOrdersByShopIdProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

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
      },
    });

    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

export async function getOrderById({ id }: GetOrderByIdProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

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
    console.error("Error fetching order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    };
  }
}

export async function createOrder(order: CreateOrderInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const newOrder = await db.order.create({
      data: {
        ...order,
        userId: session.user.id,
        shopId: order.shopId,
        totalAmount: order.totalAmount,
        status: order.status,
        orderItems: {
          create: order.orderItems,
        },
      },
    });

    revalidatePath("/orders");
    return { success: true, data: newOrder };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("Failed to create order"),
    };
  }
}
