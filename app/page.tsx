// This file is a server component
import Shops from "@/components/shop/Shops";
import { getProductsByShopId } from "@/lib/actions/Shop/getProductsByShopId";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import { Product } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
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
  //get products by shop id dynamically
  const products = await Promise.all(
    shops.map(async (shop) => {
      const productsArray: Product[] = [];
      const products = await getProductsByShopId(shop.id);
      products.forEach((product) => {
        productsArray.push(product);
      });
      return productsArray;
    })
  );

  return (
    <div>
      {session.user.email}
      <Shops userId={user} products={products.flat()} />
      {/* Flatten the products array */}
      {shops.map((shop) => (
        <div key={shop.id}>
          <Link
            href={`/dashboard/shop/${shop.id}`}
            className="text-blue-500 hover:text-blue-700 bg-slate-400 p-2 rounded-md border"
          >
            {shop.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
