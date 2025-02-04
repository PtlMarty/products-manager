"use server";

// getShop through shopId and link by userId on a join table name shopUsers

import db from "@/lib/db/db";

export const getShopsByUserId = async (userId: string) => {
  //get shops by userId
  const shops = await db.shopUser.findMany({
    //check userId match to  shopUIser
    where: { userId: userId },
    include: {
      shop: true,
    },
  });
  if (!shops) {
    return [];
  }
  return shops.map((userShop) => userShop.shop);
};
