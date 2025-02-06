import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { auth } from "@/lib/auth";
import Link from "next/link";

interface Shop {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShopsPage = async () => {
  const session = await auth();
  if (!session?.user) return null;

  const shops = (await getShopsByUserId(session.user.id)) as Shop[];

  return (
    <div className="container mx-auto px-4 py-8 h-screen overflow-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
        Your Shops
      </h1>
      {shops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Card key={shop.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{shop.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center p-6">
                <Link
                  href={`/dashboard/shops/${shop.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
                >
                  View Dashboard
                </Link>
              </CardContent>
            </Card>
          ))}
          {/* //card to create new shop */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Shop</CardTitle>
              <CardDescription>
                Create a new shop to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/shops/new"
                className="inline-flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
              >
                Create New Shop
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No shops available</p>
          <Link
            href="/shops/new"
            className="inline-flex items-center justify-center px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
          >
            Create New Shop
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShopsPage;
