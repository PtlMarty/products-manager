// TODO: Add a layout for the shop page

import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";

export default async function ShopLayout({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const shops = await getShopsByUserId(userId);

  if (!shops) {
    throw new Error("Products not found");
  } else {
    return <div>{children}</div>;
  }
}
