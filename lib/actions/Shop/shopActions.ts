"use server";

import { executeAction } from "@/lib/actions/executeAction";
import { auth } from "@/lib/auth";
import db from "@/lib/db/db";
import { shopSchema } from "@/types/shop";
import { Shop } from "@prisma/client";

export type ShopActionResult = {
  success: boolean;
  message?: string;
  data?: Shop;
  error?: Error;
  shops?: Shop[];
};

/**
 * Creates a new shop and links it to the current user as owner
 * @param name Name of the shop
 * @returns Promise with the created shop and status
 */
export async function createShop(name: string): Promise<ShopActionResult> {
  return executeAction({
    actionFn: async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("You must be logged in to create a shop");
      }

      const validatedData = shopSchema.parse({ name });

      // Create shop and link it to the user in a transaction
      const result = await db.$transaction(async (tx) => {
        // Create the shop
        const shop = await tx.shop.create({
          data: validatedData,
        });

        // Create the shop-user relationship with 'owner' role
        await tx.shopUser.create({
          data: {
            shopId: shop.id,
            userId: session.user.id,
            role: "owner",
          },
        });

        return shop;
      });

      return {
        success: true,
        message: "Shop created successfully",
        data: result,
      };
    },
  });
}

/**
 * Deletes a shop if the current user is the owner
 * @param shopId ID of the shop to delete
 * @returns Promise with the deleted shop and status
 */
export async function deleteShop(shopId: string): Promise<ShopActionResult> {
  return executeAction({
    actionFn: async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("You must be logged in to delete a shop");
      }

      // Check if user has permission to delete the shop
      const shopUser = await db.shopUser.findUnique({
        where: {
          shopId_userId: {
            shopId: shopId,
            userId: session.user.id,
          },
        },
      });

      if (!shopUser || shopUser.role !== "owner") {
        throw new Error("You don't have permission to delete this shop");
      }

      const deletedShop = await db.shop.delete({
        where: { id: shopId },
      });

      return {
        success: true,
        message: "Shop deleted successfully",
        data: deletedShop,
      };
    },
  });
}

/**
 * Gets all shops for the current user
 * @returns Promise with the user's shops
 */
export async function getUserShops(): Promise<ShopActionResult> {
  return executeAction({
    actionFn: async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("You must be logged in to view shops");
      }

      const shops = await db.shop.findMany({
        where: {
          users: {
            some: {
              userId: session.user.id,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        success: true,
        message: "Shops retrieved successfully",
        data: shops[0], // Return first shop since data is a single Shop type
        shops, // Add additional field for multiple shops
      };
    },
  });
}
