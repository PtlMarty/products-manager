// This file is a server component
import Shops from "@/components/shop/Shops";
import { getProductsByShopId } from "@/lib/actions/Shop/getProductsByShopId";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import { getSuppliers } from "@/lib/actions/suppliers/supplierActions";
import { Product } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

const PRODUCTS_LIMIT = 6;

// Define the Shop type

export default async function Home() {
  const session = await getSession(); // Await the promise to get the session

  // Check if session and user are defined
  if (!session || !session.user) {
    redirect("/sign-in"); // Redirect if session or user is not found
    return null; // Return null to prevent further execution
  }
  // Access user id from session
  const user = session.user.id;
  // Fetch shops
  const shops = await getShopsByUserId(user);
  const suppliers = await getSuppliers();
  //get products by shop id dynamically
  const products = await Promise.all(
    shops.map(async (shop) => {
      const shopProducts = await getProductsByShopId(shop.id);
      return shopProducts
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, PRODUCTS_LIMIT);
    })
  );
  const getDisplayProducts = (products: Product[]) => {
    return products;
  };

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex gap-2">
        {shops.length > 0 ? (
          shops.map((shop) => (
            <div key={shop.id}>
              <Link
                href={`/dashboard/shops/${shop.id}`}
                className="text-gray-800 bg-violet-500 p-2 rounded-md border"
              >
                {shop.name}
              </Link>
            </div>
          ))
        ) : (
          <div className="text-gray-600 text-center">No shops available </div>
        )}
      </div>
      <Shops
        initialProducts={getDisplayProducts(products.flat())}
        shops={shops}
        userId={user}
        suppliers={suppliers}
      />
    </div>
  );
}
