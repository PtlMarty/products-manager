// create new shop action
"use server";
import db from "@/lib/db/db";
import { ShopActionResult, shopSchema } from "@/types/shop";
import { Shop } from "@prisma/client";
import { executeAction } from "../executeAction";

export async function createNewShop(
  shop: Partial<Shop>
): Promise<ShopActionResult> {
  return executeAction({
    actionFn: async () => {
      const validatedData = shopSchema.parse(shop);

      const newShop = await db.shop.create({
        data: validatedData,
      });

      return {
        success: true,
        message: "Shop created successfully",
        data: newShop,
      };
    },
  });
}
