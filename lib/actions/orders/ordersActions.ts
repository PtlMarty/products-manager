"use server";

// TODO: add actions for orders
// - get orders by shop id
// - get order by id
// - create order
// - update order
// - delete order

import { auth } from "@/lib/auth";
import db from "@/lib/db/db";
import { revalidatePath } from "next/cache";

interface GetOrdersByShopIdProps {
  shopId: string;
}

interface GetOrderByIdProps {
  id: string;
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
      },
    });

    revalidatePath("/orders");
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
