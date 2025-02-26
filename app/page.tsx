// This file is a server component
import OrdersTableWrapper from "@/components/orders/OrdersTableWrapper";
import { getSession } from "@/lib/actions/getSession";
import { getOrdersByShopId } from "@/lib/actions/orders/ordersActions";
import { getProductsByShopId } from "@/lib/actions/Shop/getProductsByShopId";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSuppliers } from "@/lib/actions/suppliers/supplierActions";
import { OrderWithRelations, Shop } from "@/types/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

// Define a type for the result object
type OrderResult = {
  success: boolean;
  data?: OrderWithRelations[];
  error?: string;
};

export default async function Home() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const user = session.user.id;
  const shops = await getShopsByUserId(user);

  // Get products and suppliers from the first shop for order creation
  const products = shops.length ? await getProductsByShopId(shops[0].id) : [];
  const suppliers = await getSuppliers();

  // Fetch initial orders for all shops
  const ordersPromises = shops.map((shop: Shop) =>
    getOrdersByShopId({ shopId: shop.id })
  );
  const ordersResults = await Promise.all(ordersPromises);
  const initialOrders = ordersResults
    .filter((result: OrderResult) => result.success && result.data)
    .flatMap((result: OrderResult) => result.data as OrderWithRelations[])
    .sort(
      (a: OrderWithRelations, b: OrderWithRelations) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  return (
    <main className="container mx-auto px-4 py-8 h-screen">
      <div className="flex flex-col gap-6">
        {/* Shops Navigation */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Your Shops</h2>
          <div className="flex flex-wrap gap-3">
            {shops.length > 0 ? (
              shops.map((shop: Shop) => (
                <Link
                  key={shop.id}
                  href={`/dashboard/shops/${shop.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
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

        {/* Recent Orders from All Shops */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">
            Recent Orders (All Shops)
          </h2>
          {shops.length > 0 && (
            <OrdersTableWrapper
              shopId={shops[0].id}
              userId={user}
              products={products}
              suppliers={suppliers}
              shops={shops}
              initialOrders={initialOrders}
            />
          )}
        </div>
      </div>
    </main>
  );
}
