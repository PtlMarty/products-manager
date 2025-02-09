// This file is a server component
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession(); // Await the promise to get the session

  // Check if session and user are defined
  if (!session || !session.user) {
    redirect("/sign-in"); // Redirect if session or user is not found
  }
  // Access user id from session
  const user = session.user.id;
  // Fetch shops
  const shops = await getShopsByUserId(user);

  return (
    <main className="container mx-auto px-4 py-8 h-screen">
      <div className="flex flex-col gap-6">
        {/* Shops Navigation */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Your Shops</h2>
          <div className="flex flex-wrap gap-3">
            {shops.length > 0 ? (
              shops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/dashboard/shops/${shop.id}`}
                  className="bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition-colors text-sm sm:text-base"
                >
                  {shop.name}
                </Link>
              ))
            ) : (
              <div className="text-gray-500 text-center w-full py-4">
                No shops available
              </div>
            )}
          </div>
        </div>

        {/* Shop Products */}
        <div className="bg-white rounded-lg shadow">HOME PAGE</div>
      </div>
    </main>
  );
}
