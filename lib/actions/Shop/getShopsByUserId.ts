"use server";

// getShop through shopId and link by userId on a join table name shopUsers

import db from "@/lib/db/db";
import { getSession } from "../getSession";

export const getShopsByUserId = async (userId: string) => {
  // Verify the requesting user is the same as the userId being queried
  const session = await getSession();
  const requestingUserId = session?.user?.id;

  if (!requestingUserId || requestingUserId !== userId) {
    return [];
  }

  const shops = await db.shop.findMany({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      _count: {
        select: {
          products: true,
          suppliers: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return shops;
};
