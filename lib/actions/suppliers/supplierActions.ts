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
