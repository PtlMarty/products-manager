// getProductsByShopId

import db from "@/lib/db/db";

export const getProductsByShopId = async (shopId: string) => {
  const products = await db.product.findMany({
    where: { shopId: shopId },
  });
  return products;
};
